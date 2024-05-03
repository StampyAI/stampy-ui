import {useEffect, useRef, useState} from 'react'
import {Link, useFetcher} from '@remix-run/react'
import StampyIcon from '~/components/icons-generated/Stampy'
import SendIcon from '~/components/icons-generated/PlaneSend'
import Button from '~/components/Button'
import {queryLLM, Entry, AssistantEntry, StampyEntry, Followup, ChatSettings} from '~/hooks/useChat'
import ChatEntry from './ChatEntry'
import './widgit.css'
import {questionUrl} from '~/routesMapper'
import {Question} from '~/server-utils/stampy'
import {useSearch} from '~/hooks/useSearch'
import Input from '~/components/Input'

// to be replaced with actual pool questions
const poolQuestions = [
  {
    title: 'What is AI Safety? - from pool',
    pageid: '8486',
  },
  {
    title: 'How would the AI even get out in the world? -- from pool',
    pageid: '7638',
  },
  {
    title: 'What is the AI alignment problem? -- from pool',
    pageid: '8EL9',
  },
  {
    title: 'What are existential risks (x-risks)? -- from pool',
    pageid: '89LL',
  },
  {
    title: "Isn't the real concern misuse? -- from pool",
    pageid: '9B85',
  },
  {
    title: "Aren't there easy solutions to AI alignment? -- from pool",
    pageid: '6172',
  },
  {
    title: 'Will we ever build superintelligence? -- from pool',
    pageid: '7565',
  },
  {
    title: 'Will the first AGI be an LLM? -- from pool',
    pageid: '85E2',
  },
  {
    title: 'Why not just raise AI like kids? -- from pool',
    pageid: '93R9',
  },
  {
    title: 'Why is AI alignment a hard problem? -- from pool',
    pageid: '8163',
  },
]

export const WidgetStampy = () => {
  const [question, setQuestion] = useState('')
  const questions = [
    'What is AI Safety?',
    'How would the AI even get out in the world?',
    'Do people seriously worry about existential risk from AI?',
  ]

  const stampyUrl = (question: string) => `/chat/?question=${question.trim()}`
  return (
    <div className="centered col-9 padding-bottom-128">
      <div className="col-6 padding-bottom-56">
        <h2 className="teal-500">Questions?</h2>
        <h2>Ask Stampy, our chatbot, any question about AI safety</h2>
      </div>

      <div className="sample-messages-container padding-bottom-24">
        <StampyIcon />
        <div className="sample-messages rounded">
          <div className="padding-bottom-24">Try asking me...</div>
          {questions.map((question, i) => (
            <div key={i} className="padding-bottom-16">
              <Button className="secondary-alt-large" action={stampyUrl(question)}>
                {question}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="widget-ask">
        <input
          type="text"
          className="full-width bordered secondary"
          placeholder="Ask Stampy a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && question.trim()) {
              window.location = stampyUrl(question) as any
            }
          }}
        />
        <Link to={stampyUrl(question)}>
          <SendIcon />
        </Link>
      </div>
    </div>
  )
}

type QuestionInputProps = {
  initial?: string
  onChange?: (val: string) => void
  onAsk?: (val: string) => void
}
const QuestionInput = ({initial, onChange, onAsk}: QuestionInputProps) => {
  const [question, setQuestion] = useState(initial || '')
  const [placeholder, setPlaceholder] = useState('Ask Stampy a question...')
  const handleAsk = (val: string) => {
    onAsk && onAsk(val)
    setQuestion('')
    setPlaceholder('Message Stampy')
  }

  const handleChange = (val: string) => {
    setQuestion(val)
    onChange && onChange(val)
  }

  return (
    <div className="widget-ask flex-container">
      <Input
        placeHolder={placeholder}
        className="large col-10"
        value={question}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && question.trim() && onAsk) {
            handleAsk(question)
          }
        }}
      />
      <SendIcon className="pointer" onClick={() => handleAsk(question)} />
    </div>
  )
}

type FollowupsProps = {
  title?: string
  followups?: Followup[]
  onSelect: (followup: Followup) => void
  className?: string
}
const Followups = ({title, followups, onSelect, className}: FollowupsProps) => (
  <>
    {title && <div className={'padding-bottom-24 color-grey ' + (className || '')}>{title}</div>}

    {followups?.map(({text, pageid}, i) => (
      <div key={i} className="padding-bottom-16">
        <Button className="secondary-alt" action={() => onSelect({text, pageid})}>
          {text}
        </Button>
      </div>
    ))}
  </>
)

const SplashScreen = ({
  questions,
  onQuestion,
}: {
  questions?: string[]
  onQuestion: (v: string) => void
}) => (
  <>
    <div className="padding-top-40">
      <StampyIcon />
      <div className="col-6 padding-bottom-40 padding-top-40">
        <h2 className="teal-500">Hi there, I'm Stampy.</h2>
        <h2>I can answer your questions about AI Safety</h2>
      </div>
      <Followups
        title="Popular questions"
        followups={questions?.map((text: string) => ({text}))}
        onSelect={({text}: Followup) => onQuestion(text)}
      />
    </div>
  </>
)

type ChatbotProps = {
  question?: string
  questions?: string[]
  settings?: ChatSettings
}
export const Chatbot = ({question, questions, settings}: ChatbotProps) => {
  const [followups, setFollowups] = useState<Followup[]>()

  // FIXME: Generate session id
  const [sessionId] = useState('asd')
  const [history, setHistory] = useState([] as Entry[])
  const [controller, setController] = useState(() => new AbortController())
  const fetcher = useFetcher({key: 'followup-fetcher'})
  const {search, resultsForRef, waitForResults} = useSearch(1)

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== 'idle') return

    const question = (fetcher.data as any)?.question?.data as Question
    if (!question || !question.pageid) return

    setHistory((history) =>
      history.map((item, i) => {
        // Ignore non human written entries
        if ((item as StampyEntry).pageid !== question.pageid) return item
        // this is the current entry, so update it
        if (i === history.length - 1) {
          // check proper insertion of pool questions
          // question.relatedQuestions = question.relatedQuestions.slice(0,2);
          setFollowups(
            [...(question.relatedQuestions || []), ...poolQuestions.sort(() => Math.random() - 0.5)]
              .slice(0, 3)
              .map(({title, pageid}) => ({text: title, pageid}))
          )
          return {...item, title: question.title, content: question.text || ''}
        }
        // this is a previous human written article that didn't load properly - don't
        // update the text as that could cause things to jump around - the user has
        // already moved on, anyway
        if (!item.content) return {...item, content: '...'}
        // Any fully loaded previous human articles should just be returned
        return item
      })
    )
  }, [fetcher.data, fetcher.state])

  const showFollowup = async ({text, pageid}: Followup) => {
    if (pageid) fetcher.load(questionUrl({pageid}))
    setHistory((prev) => [
      ...prev,
      {role: 'user', content: text},
      {pageid, role: 'stampy'} as StampyEntry,
    ])
    setFollowups(undefined)
  }

  const onQuestion = async (question: string) => {
    // Cancel any previous queries
    controller.abort()
    const newController = new AbortController()
    setController(newController)

    // Add a new history entry, replacing the previous one if it was canceled
    const message = {content: question, role: 'user'} as Entry
    setHistory((current) => {
      const last = current[current.length - 1]
      if (
        (last?.role === 'assistant' &&
          ['streaming', 'followups', 'done'].includes(last?.phase || '')) ||
        (last?.role === 'stampy' && last?.content) ||
        ['error'].includes(last?.role)
      ) {
        return [...current, message, {role: 'assistant'} as AssistantEntry]
      } else if (last?.role === 'user' && last?.content === question) {
        return [...current.slice(0, current.length - 1), {role: 'assistant'} as AssistantEntry]
      }
      return [
        ...current.slice(0, current.length - 2),
        message,
        {role: 'assistant'} as AssistantEntry,
      ]
    })

    setFollowups(undefined)
    const updateReply = (reply: Entry) =>
      setHistory((current) => [...current.slice(0, current.length - 2), message, reply])

    search(question)
    const [humanWritten] = await waitForResults(100, 1000)
    if (newController.signal.aborted) {
      return
    }

    if (humanWritten && humanWritten.score > 0.85 && question === resultsForRef.current) {
      fetcher.load(questionUrl({pageid: humanWritten.pageid}))
      updateReply({pageid: humanWritten.pageid, role: 'stampy'} as StampyEntry)
      return
    }

    const {followups, result} = await queryLLM(
      [...history, message],
      updateReply,
      sessionId,
      newController,
      settings
    )
    if (!newController.signal.aborted) {
      updateReply(result)
      setFollowups(followups)
    }
  }

  const fetchFlag = useRef(false)
  useEffect(() => {
    if (question && !fetchFlag.current) {
      fetchFlag.current = true
      onQuestion(question)
    }
  })

  return (
    <div className="centered col-10 height-70">
      {history.length === 0 ? (
        <SplashScreen questions={questions} onQuestion={onQuestion} />
      ) : undefined}
      {history.map((item, i) => (
        <ChatEntry key={`chat-entry-${i}`} {...item} />
      ))}

      <div className="padding-bottom-56">
        {followups ? (
          <Followups
            title="Continue the conversation"
            followups={followups}
            onSelect={showFollowup}
          />
        ) : undefined}
      </div>

      <QuestionInput onAsk={onQuestion} />

      <div className={'warning-floating'}>
        <p className={'xs'}>
          <span className={'red xs-bold'}>Caution! </span>
          This is an early prototype. Don’t automatically trust what it says, and make sure to
          follow its sources.
        </p>
      </div>
    </div>
  )
}

export default Chatbot
