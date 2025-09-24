import {useState} from 'react'
import {
  queryLLM,
  Entry,
  AssistantEntry,
  ChatSettings,
  Followup,
  HistoryEntry,
  EntryRole,
} from '~/hooks/useChat'
import Input from '~/components/Input'
import SendIcon from '~/components/icons-generated/PlaneSend'
import ChatEntry from '~/components/Chatbot/ChatEntry'

const scroll30 = () => {
  if (document.documentElement.scrollHeight - window.scrollY < window.innerHeight * 1.1) {
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
  }
}

const makeHistory = (query: string, entries: Entry[]): HistoryEntry[] => {
  const getRole = (entry: Entry): EntryRole => {
    if (entry.deleted) return 'deleted'
    if (entry.role === 'stampy') return 'assistant'
    return entry.role
  }

  const history = entries
    .filter((entry) => entry.role !== 'error')
    .map((entry) => ({
      role: getRole(entry),
      content: entry.content.trim(),
    }))
  return [...history, {role: 'user', content: query}]
}

type PlaygroundChatParams = {
  sessionId: string
  settings: ChatSettings
  onQuery?: (q: string) => void
  onNewEntry?: (history: Entry[]) => void
}

export const PlaygroundChat = ({
  sessionId,
  settings,
  onQuery,
  onNewEntry,
}: PlaygroundChatParams) => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState<AssistantEntry | undefined>()
  const [followups, setFollowups] = useState<Followup[]>([])
  const [controller, setController] = useState(() => new AbortController())
  const [isSearching, setIsSearching] = useState(false)

  const updateCurrent = (current: AssistantEntry) => {
    if (current?.phase === 'streaming') {
      setCurrent(current)
      scroll30()
    } else {
      setCurrent(current)
    }
  }

  const addResult = (
    query: string,
    {result, followups}: {result: Entry; followups?: Followup[]}
  ) => {
    const userEntry = {role: 'user', content: query} as Entry
    setEntries((prev) => {
      const entries = [...prev, userEntry, result]
      onNewEntry?.(entries)
      return entries
    })
    setFollowups(followups || [])
    setQuery('')
    scroll30()
  }

  const abortable =
    (f: any) =>
    (...args: any) => {
      controller.abort()
      const newController = new AbortController()
      setController(newController)
      return f(newController, ...args)
    }

  const search = async (controller: AbortController, query: string) => {
    setFollowups([])
    setIsSearching(true)

    const history = makeHistory(query, entries)

    const result = await queryLLM(history, updateCurrent, sessionId, controller, settings)

    if (result.result.content !== 'aborted') {
      addResult(query, result)
    }
    setCurrent(undefined)
    setIsSearching(false)
  }

  const deleteEntry = (i: number) => {
    const entry = entries[i]
    if (entry === undefined) return

    if (i === entries.length - 1 && ['assistant', 'stampy', 'error'].includes(entry.role)) {
      const prev = entries[i - 1]
      if (prev !== undefined) setQuery(prev.content)
      setEntries(entries.slice(0, i - 1))
      setFollowups([])
    } else {
      entry.deleted = true
      setEntries([...entries])
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <ul style={{listStyle: 'none', padding: 0}}>
        {entries.map(
          (entry, i) =>
            !entry.deleted && (
              <li key={i} style={{position: 'relative', marginBottom: '16px'}} className="group">
                <ChatEntry {...entry} no={i} />
                <span
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '8px',
                    cursor: 'pointer',
                    display: 'none',
                  }}
                  className="delete-item"
                  onClick={() => deleteEntry(i)}
                >
                  ✕
                </span>
              </li>
            )
        )}
      </ul>

      {followups.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginTop: '8px',
          }}
        >
          {followups.map((followup, i) => (
            <button
              key={i}
              style={{margin: '4px', padding: '4px 8px', border: '1px solid gray'}}
              onClick={() => search(controller, followup.text)}
            >
              {followup.text}
            </button>
          ))}
        </div>
      )}

      <div style={{position: 'relative', marginTop: '16px'}}>
        <Input
          placeholder="Ask a question..."
          className="large full-width"
          value={query}
          multiline
          onChange={(e) => {
            setQuery(e.target.value)
            onQuery?.(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && query.trim()) {
              e.preventDefault()
              abortable(search)(query)
            } else if (e.key === 'Escape') {
              controller.abort()
              setIsSearching(false)
            }
          }}
        />
        <SendIcon
          style={{position: 'absolute', right: '12px', top: '12px', cursor: 'pointer'}}
          onClick={() => query.trim() && abortable(search)(query)}
        />
      </div>

      {current && (
        <div style={{marginTop: '16px'}}>
          {current.phase === 'started' && <p>Loading: Sending query...</p>}
          {current.phase === 'semantic' && <p>Loading: Performing semantic search...</p>}
          {current.phase === 'context' && <p>Loading: Preparing context...</p>}
          {current.phase === 'llm' && <p>Loading: Thinking...</p>}
          {current.phase === 'streaming' && <ChatEntry {...current} />}
          {current.phase === 'followups' && (
            <>
              <ChatEntry {...current} />
              <p>Checking for followups...</p>
            </>
          )}
        </div>
      )}

      {!current && entries.length > 0 && (
        <button onClick={() => setEntries([])} style={{marginTop: '16px'}}>
          Clear history
        </button>
      )}
    </div>
  )
}
