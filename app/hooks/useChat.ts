export const CHATBOT_URL = 'https://chat.stampy.ai:8443/chat'

export type Citation = {
  title: string
  authors: string[]
  date: string
  url: string
  source: string
  index: number
  text: string
  reference: string
  id?: string
}

export type Entry = (UserEntry | AssistantEntry | ErrorMessage | StampyEntry) & {no?: number}
export type ChatPhase =
  | 'started'
  | 'semantic'
  | 'history'
  | 'context'
  | 'prompt'
  | 'llm'
  | 'thinking'
  | 'streaming'
  | 'followups'
  | 'done'

export type UserEntry = {
  role: 'user'
  content: string
  deleted?: boolean
}

export type AssistantEntry = {
  role: 'assistant'
  question?: string
  content: string
  citations?: Citation[]
  citationsMap?: Map<string, Citation>
  deleted?: boolean
  phase?: ChatPhase
  thoughts?: string
}

export type ErrorMessage = {
  role: 'error'
  content: string
  deleted?: boolean
}

export type StampyEntry = {
  role: 'stampy'
  pageid: string
  content: string
  deleted?: boolean
  title?: string
}

export type Followup = {
  text: string
  pageid?: string
}
export type SearchResult = {
  followups?: Followup[]
  result: Entry
}

type Model =
  | 'openai/gpt-3.5-turbo'
  | 'openai/gpt-3.5-turbo-16k'
  | 'openai/o1'
  | 'openai/o1-mini'
  | 'openai/gpt-4'
  | 'openai/gpt-4-turbo-preview'
  | 'openai/gpt-4o'
  | 'openai/gpt-4o-mini'
  | 'openai/o4-mini'
  | 'openai/o3'
  | 'openai/gpt-4.1-nano'
  | 'openai/gpt-4.1-mini'
  | 'openai/gpt-4.1'
  | 'anthropic/claude-3-opus-20240229'
  | 'anthropic/claude-3-5-sonnet-20240620'
  | 'anthropic/claude-3-5-sonnet-20241022'
  | 'anthropic/claude-3-5-sonnet-latest'
  | 'anthropic/claude-opus-4-20250514'
  | 'anthropic/claude-sonnet-4-20250514'
  | 'anthropic/claude-sonnet-4-20250514'
  | 'anthropic/claude-opus-4-20250514'

export type Mode = 'rookie' | 'concise' | 'default'
export type ChatSettings = {
  mode?: Mode
  completions?: Model
}

const DATA_HEADER = 'data: '
const EVENT_END_HEADER = 'event: close'

export type EntryRole = 'error' | 'stampy' | 'assistant' | 'user' | 'deleted'
export type HistoryEntry = {
  role: EntryRole
  content: string
  question?: string
}

export const formatCitations: (text: string) => string = (text) => {
  // ---------------------- normalize citation form ----------------------
  // the general plan here is just to add parsing cases until we can respond
  // well to almost everything the LLM emits. We won't ever reach five nines,
  // but the domain is one where occasionally failing isn't catastrophic.

  // transform all things that look like [1, 2, 3] into [1][2][3]
  let response = text.replace(
    /\[((?:\d+,\s*)*\d+)\]/g, // identify groups of this form

    (block: string) =>
      block
        .split(',')
        .map((x) => x.trim())
        .join('][')
  )

  // transform all things that look like [(1), (2), (3)] into [(1)][(2)][(3)]
  response = response.replace(
    /\[((?:\(\d+\),\s*)*\(\d+\))\]/g, // identify groups of this form

    (block: string) =>
      block
        .split(',')
        .map((x) => x.trim())
        .join('][')
  )

  // transform all things that look like [(3)] into [3]
  response = response.replace(/\[\((\d+)\)\]/g, (_match: string, x: string) => `[${x}]`)

  // transform all things that look like [ 12 ] into [12]
  response = response.replace(/\[\s*(\d+)\s*\]/g, (_match: string, x: string) => `[${x}]`)
  return response
}

export const findCitations: (text: string, citations: Citation[]) => Map<string, Citation> = (
  text,
  citations
) => {
  // figure out what citations are in the response, and map them appropriately
  const cite_map = new Map<string, Citation>()
  const byRef = citations.reduce((acc, c) => ({...acc, [c.reference]: c}), {}) as {
    [k: string]: Citation
  }
  let index = 1
  const articles = new Map<string, Citation>()

  // find all citations in the text
  const refs = [...text.matchAll(/\[(\d+)\]/g)]
  refs.forEach(([_, num]) => {
    if (!num || cite_map.has(num)) return
    const citation = byRef[num as keyof typeof byRef]
    if (!citation) return

    let article = articles.get(citation.id || '')
    if (!article) {
      article = {...citation, index: index++}
      articles.set(citation.id || '', article)
    }
    cite_map.set(num, {...citation, index: article.index})
  })

  return cite_map
}

const ignoreAbort = (error: Error) => {
  if (error.name !== 'AbortError') {
    throw error
  }
  console.log(error)
}

export async function* iterateData(res: Response) {
  const reader = res.body!.getReader()
  let message = ''

  while (true) {
    const {done, value} = await reader.read()

    if (done) return

    const chunk = new TextDecoder('utf-8').decode(value)
    for (const line of chunk.split('\n')) {
      // Most times, it seems that a single read() call will be one SSE "message",
      // but I'll do the proper aggregation spec thing in case that's not always true.

      if (line.startsWith(EVENT_END_HEADER)) {
        return
      } else if (line.startsWith(DATA_HEADER)) {
        message += line.slice(DATA_HEADER.length)
        // Fixes #43
      } else if (line !== '') {
        message += line
      } else if (message !== '') {
        yield JSON.parse(message)
        message = ''
      }
    }
  }
}

const makeEntry = (question?: string) =>
  ({
    role: 'assistant',
    question,
    content: '',
    citations: [],
    citationsMap: new Map(),
  }) as AssistantEntry

export const extractAnswer = async (
  question: string | undefined,
  res: Response,
  setCurrent: (e: AssistantEntry) => void
): Promise<SearchResult> => {
  const formatResponse = (result: AssistantEntry, data: Entry) => {
    const content = formatCitations((result?.content || '') + data.content)
    return {
      content,
      question,
      thoughts: result?.thoughts,
      role: 'assistant',
      citations: result?.citations || [],
      citationsMap: findCitations(content, result?.citations || []),
    } as AssistantEntry
  }

  let result: AssistantEntry = makeEntry(question)
  let followups: Followup[] = []
  for await (const data of iterateData(res)) {
    switch (data.state) {
      case 'loading':
        setCurrent({phase: data.phase, ...result})
        break
      case 'thinking':
        result = {
          ...result,
          thoughts: (result.thoughts || '') + data.content,
        }
        setCurrent({phase: 'thinking', ...result})
        break

      case 'citations':
        result = {
          ...result,
          citations: data?.citations || result?.citations || [],
        }
        setCurrent({phase: data.phase, ...result})
        break

      case 'streaming':
        // incrementally build up the response
        result = formatResponse(result, data)
        setCurrent({phase: 'streaming', ...result})
        break

      case 'followups':
        // add any potential followup questions
        followups = data.followups.map((value: any) => value as Followup)
        break
      case 'done':
        result = {...result, phase: 'done'}
        break
      case 'error':
        throw data.error
    }
  }
  return {result, followups}
}

const formatHistoryItem = ({role, content}: HistoryEntry): HistoryEntry | null => {
  if (role === 'stampy') {
    role = 'assistant'
  } else if (['error', 'deleted'].includes(role)) {
    return null
  }

  return {content: formatCitations(content), role}
}

const makePayload = (
  sessionId: string | undefined,
  history: HistoryEntry[],
  settings?: ChatSettings
): string => {
  const payload = JSON.stringify({
    sessionId,
    history: history.map(formatHistoryItem).filter(Boolean),
    settings,
  })
  if (payload.length < 70000) return payload
  if (history.length === 1) throw 'You question is too long - please shorten it'
  return makePayload(sessionId, history.slice(1), settings)
}

const fetchLLM = async (
  sessionId: string | undefined,
  history: HistoryEntry[],
  controller: AbortController,
  settings?: ChatSettings
): Promise<Response | void> =>
  fetch(CHATBOT_URL, {
    signal: controller.signal,
    method: 'POST',
    cache: 'no-cache',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: makePayload(sessionId, history, settings),
  }).catch(ignoreAbort)

export const queryLLM = async (
  history: HistoryEntry[],
  setCurrent: (e: AssistantEntry) => void,
  sessionId: string | undefined,
  controller: AbortController,
  settings?: ChatSettings
): Promise<SearchResult> => {
  const question = history[history.length - 1]?.content
  setCurrent({...makeEntry(question), phase: 'started'})
  // do SSE on a POST request.
  const res = await fetchLLM(sessionId, history, controller, settings)

  if (!res) {
    return {result: {role: 'error', content: 'No response from server'}}
  } else if (!res.ok) {
    return {result: {role: 'error', content: 'POST Error: ' + res.status}}
  }

  try {
    return await extractAnswer(question, res, setCurrent)
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') {
      return {result: {role: 'error', content: 'aborted'}}
    }
    return {
      result: {role: 'error', content: e ? e.toString() : 'unknown error'},
    }
  }
}
