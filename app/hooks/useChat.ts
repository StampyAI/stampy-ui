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

export type Entry = UserEntry | AssistantEntry | ErrorMessage | StampyEntry
export type ChatPhase =
  | 'started'
  | 'semantic'
  | 'history'
  | 'context'
  | 'prompt'
  | 'llm'
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
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-turbo-preview'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307'
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
  let index = 1

  // scan a regex for [x] over the response. If x isn't in the map, add it.
  // (note: we're actually doing this twice - once on parsing, once on render.
  // if that looks like a problem, we could swap from strings to custom ropes).
  const regex = /\[(\d+)\]/g
  let match
  while ((match = regex.exec(text)) !== null) {
    const ref = match[1]
    if (!ref || cite_map.has(ref!)) continue

    const citation = citations[parseInt(ref, 10)]
    if (!citation) continue

    cite_map.set(ref!, {...citation, index})
    index++
  }
  return cite_map
}

const ignoreAbort = (error: Error) => {
  if (error.name !== 'AbortError') {
    throw error
  }
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

const fetchLLM = async (
  sessionId: string | undefined,
  history: HistoryEntry[],
  controller: AbortController,
  settings?: ChatSettings
): Promise<Response | void> =>
  fetch(`${CHATBOT_URL}`, {
    signal: controller.signal,
    method: 'POST',
    cache: 'no-cache',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({sessionId, history, settings}),
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
