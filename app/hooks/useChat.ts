const PROD_CHATBOT_URL = 'https://chat.stampy.ai:8443/chat'
const LOCAL_CHATBOT_URL = 'http://localhost:3001/chat'
export const CHATBOT_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? LOCAL_CHATBOT_URL
    : PROD_CHATBOT_URL

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

export type ContentBlock =
  | {type: 'text'; text: string}
  | {type: 'thinking'; thinking: string}
  | {type: 'tool_use'; id?: string; name: string; input: Record<string, any>}
  | {type: 'tool_result'; tool: string; tool_use_id?: string; model_output: string; ui_output: any}

export type Entry = (UserEntry | AssistantEntry | ErrorMessage | StampyEntry) & {no?: number}
export type ChatPhase = 'started' | 'thinking' | 'streaming' | 'turn' | 'followups' | 'done'

export type UserEntry = {
  role: 'user'
  content: string
  deleted?: boolean
}

export type AssistantEntry = {
  role: 'assistant'
  question?: string
  blocks: ContentBlock[]
  content: string // derived: concatenation of text blocks
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
  | 'anthropic/claude-sonnet-4-6'
  | 'anthropic/claude-opus-4-6'
  | 'anthropic/claude-haiku-4-5'
  | 'anthropic/claude-sonnet-4-5-20250929'
  | 'anthropic/claude-opus-4-5-20251101'
  | 'anthropic/claude-sonnet-4-20250514'
  | 'anthropic/claude-opus-4-20250514'
  | 'anthropic/claude-3-7-sonnet-latest'
  | 'anthropic/claude-3-5-sonnet-latest'

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
  content: string | ContentBlock[]
  question?: string
}

export const formatCitations: (text: string) => string = (text) => {
  let response = text.replace(/\[((?:\d+,\s*)*\d+)\]/g, (block: string) =>
    block
      .split(',')
      .map((x) => x.trim())
      .join('][')
  )
  response = response.replace(/\[((?:\(\d+\),\s*)*\(\d+\))\]/g, (block: string) =>
    block
      .split(',')
      .map((x) => x.trim())
      .join('][')
  )
  response = response.replace(/\[\((\d+)\)\]/g, (_match: string, x: string) => `[${x}]`)
  response = response.replace(/\[\s*(\d+)\s*\]/g, (_match: string, x: string) => `[${x}]`)
  return response
}

export const findCitations: (text: string, citations: Citation[]) => Map<string, Citation> = (
  text,
  citations
) => {
  const cite_map = new Map<string, Citation>()
  const byRef = citations.reduce((acc, c) => ({...acc, [c.reference]: c}), {}) as {
    [k: string]: Citation
  }
  let index = 1
  const articles = new Map<string, Citation>()

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
      if (line.startsWith(EVENT_END_HEADER)) {
        return
      } else if (line.startsWith(DATA_HEADER)) {
        message += line.slice(DATA_HEADER.length)
      } else if (line !== '') {
        message += line
      } else if (message !== '') {
        yield JSON.parse(message)
        message = ''
      }
    }
  }
}

/** Extract citations from tool result ui_output (search results). */
const extractCitationsFromBlocks = (blocks: ContentBlock[]): Citation[] => {
  const citations: Citation[] = []
  for (const block of blocks) {
    if (block.type !== 'tool_result') continue
    if (!Array.isArray(block.ui_output)) continue
    for (const item of block.ui_output) {
      if (item.title && item.url) {
        citations.push(item as Citation)
      }
    }
  }
  return citations
}

const makeEntry = (question?: string) =>
  ({
    role: 'assistant',
    question,
    blocks: [],
    content: '',
    citations: [],
    citationsMap: new Map(),
  }) as AssistantEntry

export const extractAnswer = async (
  question: string | undefined,
  res: Response,
  setCurrent: (e: AssistantEntry) => void,
  priorCitations?: Citation[]
): Promise<SearchResult> => {
  let result: AssistantEntry = makeEntry(question)
  let followups: Followup[] = []
  const prior = priorCitations || []

  /** Append to or create the last block of a given type in result.blocks. */
  const appendToBlock = (type: 'thinking' | 'text', key: 'thinking' | 'text', delta: string) => {
    const last = result.blocks[result.blocks.length - 1]
    if (last && last.type === type) {
      const mutable = last as Record<string, any>
      mutable[key] += delta
    } else {
      result.blocks = [...result.blocks, {type, [key]: delta} as ContentBlock]
    }
  }

  for await (const data of iterateData(res)) {
    switch (data.state) {
      case 'thinking':
        appendToBlock('thinking', 'thinking', data.content || '')
        result = {...result, blocks: [...result.blocks]}
        setCurrent({phase: 'thinking', ...result})
        break

      case 'streaming': {
        appendToBlock('text', 'text', data.content || '')
        const content = formatCitations(result.content + (data.content || ''))
        const citations = [...prior, ...extractCitationsFromBlocks(result.blocks)]
        result = {
          ...result,
          blocks: [...result.blocks],
          content,
          citations,
          citationsMap: findCitations(content, citations),
        }
        setCurrent({phase: 'streaming', ...result})
        break
      }

      case 'turn':
        if (data.role === 'assistant') {
          if (Array.isArray(data.content)) {
            for (const block of data.content) {
              if (block.type === 'tool_use') {
                result.blocks.push(block)
              }
            }
          }
        } else if (data.role === 'tool') {
          result.blocks.push({
            type: 'tool_result',
            tool: data.tool,
            tool_use_id: data.tool_use_id,
            model_output: data.model_output || '',
            ui_output: data.ui_output,
          })
          const citations = [...prior, ...extractCitationsFromBlocks(result.blocks)]
          result = {...result, citations}
        }
        setCurrent({phase: 'turn', ...result})
        break

      case 'followups':
        followups = data.followups.map((value: any) => value as Followup)
        break

      case 'done':
        result = {...result, phase: 'done'}
        break

      case 'error':
        throw data.error

      case 'loading':
        setCurrent({phase: data.phase as ChatPhase, ...result})
        break
    }
  }
  return {result, followups}
}

const formatHistoryItem = (entry: Entry): HistoryEntry | null => {
  let role = entry.role as EntryRole
  if (role === 'stampy') role = 'assistant'
  else if (['error', 'deleted'].includes(role)) return null

  // For assistant entries with blocks, send structured content (strip thinking, drop ui_output)
  if (role === 'assistant' && 'blocks' in entry) {
    const {blocks} = entry as AssistantEntry
    if (blocks?.length) {
      const cleaned: ContentBlock[] = blocks
        .filter((b) => b.type !== 'thinking')
        .map((b) =>
          b.type === 'tool_result'
            ? {
                type: 'tool_result',
                tool: b.tool,
                tool_use_id: b.tool_use_id,
                model_output: b.model_output,
                ui_output: b.ui_output,
              }
            : b
        ) as ContentBlock[]
      return {content: cleaned, role}
    }
  }

  const content = 'content' in entry && typeof entry.content === 'string' ? entry.content : ''
  return {content: formatCitations(content), role}
}

const makePayload = (
  sessionId: string | undefined,
  history: Entry[],
  settings?: ChatSettings
): string => {
  const payload = JSON.stringify({
    sessionId,
    history: history.map(formatHistoryItem).filter(Boolean),
    settings,
  })
  if (payload.length < 200000) return payload
  if (history.length === 1) throw 'Your question is too long - please shorten it'
  return makePayload(sessionId, history.slice(1), settings)
}

const fetchLLM = async (
  sessionId: string | undefined,
  history: Entry[],
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
  history: Entry[],
  setCurrent: (e: AssistantEntry) => void,
  sessionId: string | undefined,
  controller: AbortController,
  settings?: ChatSettings
): Promise<SearchResult> => {
  const lastContent = history[history.length - 1]?.content
  const question = typeof lastContent === 'string' ? lastContent : undefined
  setCurrent({...makeEntry(question), phase: 'started'})
  const res = await fetchLLM(sessionId, history, controller, settings)

  if (!res) {
    return {result: {role: 'error', content: 'No response from server'}}
  } else if (!res.ok) {
    return {result: {role: 'error', content: 'POST Error: ' + res.status}}
  }

  // Collect citations from prior assistant entries so cross-turn references resolve
  const priorCitations: Citation[] = history
    .filter((e): e is AssistantEntry => e.role === 'assistant' && 'citations' in e)
    .flatMap((e) => e.citations || [])

  try {
    return await extractAnswer(question, res, setCurrent, priorCitations)
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') {
      return {result: {role: 'error', content: 'aborted'}}
    }
    return {
      result: {role: 'error', content: e ? e.toString() : 'unknown error'},
    }
  }
}
