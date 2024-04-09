import {useEffect, useState} from 'react'
import {Link, useFetcher} from '@remix-run/react'
import StampyIcon from '~/components/icons-generated/Stampy'
import SendIcon from '~/components/icons-generated/PlaneSend'
import Button from '~/components/Button'
import {queryLLM, Entry, AssistantEntry, StampyEntry, Followup} from '~/hooks/useChat'
import ChatEntry from './ChatEntry'
import './widgit.css'
import {questionUrl} from '~/routesMapper'
import {Question} from '~/server-utils/stampy'

export const WidgetStampy = () => {
  const [question, setQuestion] = useState('')
  const questions = [
    'Why couldn’t we just turn the AI off?',
    'How would the AI even get out in the world?',
    'Do people seriously worry about existential risk from AI?',
  ]

  const stampyUrl = (question: string) => `https://chat.aisafety.info/?question=${question.trim()}`
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
              <Button className="secondary-alt" action={stampyUrl(question)}>
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

  const handleChange = (val: string) => {
    setQuestion(val)
    onChange && onChange(val)
  }

  return (
    <div className="widget-ask flex-container">
      <input
        type="text"
        className="full-width bordered secondary"
        placeholder="Ask Stampy a question..."
        value={question}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && question.trim() && onAsk) {
            onAsk(question)
          }
        }}
      />
      <SendIcon className="pointer" onClick={() => onAsk && onAsk(question)} />
    </div>
  )
}

type FollowupsProps = {
  title?: string
  followups?: Followup[]
  onSelect: (followup: Followup) => void
}
const Followups = ({title, followups, onSelect}: FollowupsProps) => (
  <>
    {title && <div className="padding-bottom-24">{title}</div>}

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
    <StampyIcon />
    <div className="col-6 padding-bottom-56">
      <h2 className="teal-500">Hi there, I'm Stampy.</h2>
      <h2>I can answer your questions about AI safety</h2>
    </div>
    <Followups
      title="Popular questions"
      followups={questions?.map((text: string) => ({text}))}
      onSelect={({text}: Followup) => onQuestion(text)}
    />
  </>
)

export const Chatbot = ({question, questions}: {question?: string; questions?: string[]}) => {
  const [followups, setFollowups] = useState<Followup[]>()

  const [sessionId] = useState('asd')
  const [history, setHistory] = useState([] as Entry[])
  const [controller, setController] = useState(() => new AbortController())
  const fetcher = useFetcher({key: 'followup-fetcher'})

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
          setFollowups(
            question.relatedQuestions?.slice(0, 3).map(({title, pageid}) => ({text: title, pageid}))
          )
          return {...item, content: question.text || ''}
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

  const abortSearch = () => controller.abort() // eslint-disable-line @typescript-eslint/no-unused-vars

  const onQuestion = async (question: string) => {
    const message = {content: question, role: 'user'} as Entry
    const controller = new AbortController()
    setController(controller)

    setFollowups(undefined)
    setHistory((current) => [...current, message, {role: 'assistant'} as AssistantEntry])
    const updateReply = (reply: Entry) =>
      setHistory((current) => [...current.slice(0, current.length - 2), message, reply])

    const {followups, result} = await queryLLM(
      [...history, message],
      updateReply,
      sessionId,
      controller
    )
    updateReply(result)
    setFollowups(followups)
  }

  return (
    <div className="centered col-9 padding-bottom-128">
      {history.length === 0 ? (
        <SplashScreen questions={questions} onQuestion={onQuestion} />
      ) : undefined}
      {history.map((item, i) => (
        <ChatEntry key={`chat-entry-${i}`} {...item} />
      ))}
      {followups ? (
        <Followups
          title="continue the conversation"
          followups={followups}
          onSelect={showFollowup}
        />
      ) : undefined}
      <QuestionInput initial={question} onAsk={onQuestion} />
    </div>
  )
}

export default Chatbot
