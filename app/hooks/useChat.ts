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

export type UserEntry = {
  role: 'user'
  content: string
  deleted?: boolean
}

export type AssistantEntry = {
  role: 'assistant'
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
}

export type Followup = {
  text: string
  pageid?: string
}
export type SearchResult = {
  followups?: Followup[]
  result: Entry
}

export type Mode = 'rookie' | 'concise' | 'default' | 'discord'

const DATA_HEADER = 'data: '
const EVENT_END_HEADER = 'event: close'

export type EntryRole = 'error' | 'stampy' | 'assistant' | 'user' | 'deleted'
export type HistoryEntry = {
  role: EntryRole
  content: string
}

export const formatCitations: (text: string) => string = (text) => {
  // ---------------------- normalize citation form ----------------------
  // the general plan here is just to add parsing cases until we can respond
  // well to almost everything the LLM emits. We won't ever reach five nines,
  // but the domain is one where occasionally failing isn't catastrophic.

  // transform all things that look like [a, b, c] into [a][b][c]
  let response = text.replace(
    /\[((?:[a-z]+,\s*)*[a-z]+)\]/g, // identify groups of this form

    (block: string) =>
      block
        .split(',')
        .map((x) => x.trim())
        .join('][')
  )

  // transform all things that look like [(a), (b), (c)] into [(a)][(b)][(c)]
  response = response.replace(
    /\[((?:\([a-z]+\),\s*)*\([a-z]+\))\]/g, // identify groups of this form

    (block: string) =>
      block
        .split(',')
        .map((x) => x.trim())
        .join('][')
  )

  // transform all things that look like [(a)] into [a]
  response = response.replace(/\[\(([a-z]+)\)\]/g, (_match: string, x: string) => `[${x}]`)

  // transform all things that look like [ a ] into [a]
  response = response.replace(/\[\s*([a-z]+)\s*\]/g, (_match: string, x: string) => `[${x}]`)
  return response
}

export const findCitations: (text: string, citations: Citation[]) => Map<string, Citation> = (
  text,
  citations
) => {
  // figure out what citations are in the response, and map them appropriately
  const cite_map = new Map<string, Citation>()

  // scan a regex for [x] over the response. If x isn't in the map, add it.
  // (note: we're actually doing this twice - once on parsing, once on render.
  // if that looks like a problem, we could swap from strings to custom ropes).
  const regex = /\[([a-z]+)\]/g
  let match
  while ((match = regex.exec(text)) !== null) {
    const letter = match[1]
    if (!letter || cite_map.has(letter!)) continue

    const citation = citations[letter.charCodeAt(0) - 'a'.charCodeAt(0)]
    if (!citation) continue

    cite_map.set(letter!, citation)
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

const makeEntry = () =>
  ({
    role: 'assistant',
    content: '',
    citations: [],
    citationsMap: new Map(),
  }) as AssistantEntry

export const extractAnswer = async (
  res: Response,
  setCurrent: (e: AssistantEntry) => void
): Promise<SearchResult> => {
  const formatResponse = (result: AssistantEntry, data: Entry) => {
    const content = formatCitations((result?.content || '') + data.content)
    return {
      content,
      role: 'assistant',
      citations: result?.citations || [],
      citationsMap: findCitations(content, result?.citations || []),
    } as AssistantEntry
  }

  let result: AssistantEntry = makeEntry()
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
  controller: AbortController
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
    body: JSON.stringify({sessionId, history, settings: {mode: 'default'}}),
  }).catch(ignoreAbort)

export const queryLLM = async (
  history: HistoryEntry[],
  setCurrent: (e: AssistantEntry) => void,
  sessionId: string | undefined,
  controller: AbortController
): Promise<SearchResult> => {
  setCurrent({...makeEntry(), phase: 'started'})
  // do SSE on a POST request.
  const res = await fetchLLM(sessionId, history, controller)

  if (!res) {
    return {result: {role: 'error', content: 'No response from server'}}
  } else if (!res.ok) {
    return {result: {role: 'error', content: 'POST Error: ' + res.status}}
  }

  try {
    return await extractAnswer(res, setCurrent)
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') {
      return {result: {role: 'error', content: 'aborted'}}
    }
    return {
      result: {role: 'error', content: e ? e.toString() : 'unknown error'},
    }
  }
}
