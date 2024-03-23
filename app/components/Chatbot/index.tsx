import {useState} from 'react'
import {Link} from '@remix-run/react'
import PersonIcon from '~/components/icons-generated/Person'
import StampyIcon from '~/components/icons-generated/Stampy'
import SendIcon from '~/components/icons-generated/PlaneSend'
import Button from '~/components/Button'
import {queryLLM, Entry, AssistantEntry, Followup} from '~/hooks/useChat'
import './widgit.css'

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
}
const Followups = ({title, followups}: FollowupsProps) => (
  <>
    {title && <div className="padding-bottom-24">{title}</div>}

    {followups?.map(({text, action}, i) => (
      <div key={i} className="padding-bottom-16">
        <Button className="secondary-alt" action={action}>
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
      followups={questions?.map((text: string) => ({text, action: () => onQuestion(text)}))}
    />
  </>
)

const UserQuery = ({content}: Entry) => (
  <div>
    <div>
      <PersonIcon /> <span className="default-bold">You</span>
    </div>
    <div> {content} </div>
  </div>
)

const ChatbotReply = ({content, phase}: AssistantEntry) => {
  const PhaseState = () => {
    switch (phase) {
      case 'started':
        return <p>Loading: Sending query...</p>
      case 'semantic':
        return <p>Loading: Performing semantic search...</p>
      case 'history':
        return <p>Loading: Processing history...</p>
      case 'context':
        return <p>Loading: Creating context...</p>
      case 'prompt':
        return <p>Loading: Creating prompt...</p>
      case 'llm':
        return <p>Loading: Waiting for LLM...</p>
      case 'streaming':
      case 'followups':
      default:
        return null
    }
  }

  return (
    <div>
      <div>
        <StampyIcon /> <span className="default-bold">Stampy</span>
      </div>
      <PhaseState />
      <div>{content}</div>
      {phase === 'followups' ? <p>Checking for followups...</p> : undefined}
    </div>
  )
}

const ChatEntry = (props: Entry) => {
  switch (props.role) {
    case 'user':
      return <UserQuery {...props} />
    case 'assistant':
      return <ChatbotReply {...props} />
  }
}

export const Chatbot = ({question, questions}: {question?: string; questions?: string[]}) => {
  const [followups, setFollowups] = useState<Followup[]>()

  const [sessionId] = useState('asd')
  const [history, setHistory] = useState([] as Entry[])
  const [controller, setController] = useState(() => new AbortController())

  const showFollowup = (pageid: string) => {
    // Fetch and display the given article
    console.log(pageid)
  }

  const abortSearch = () => controller.abort()
  console.log(abortSearch) // to stop the linter from complaining

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
    setFollowups(
      followups?.map(({text, pageid}: Followup) => ({
        text,
        action: () => pageid && showFollowup(pageid),
      }))
    )
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
        <Followups title="continue the conversation" followups={followups} />
      ) : undefined}
      <QuestionInput initial={question} onAsk={onQuestion} />
    </div>
  )
}

export default Chatbot
