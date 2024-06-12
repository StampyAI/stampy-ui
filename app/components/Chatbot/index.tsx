import {useEffect, useRef, useState} from 'react'
import {useFetcher, useNavigate} from '@remix-run/react'
import ExclamationIcon from '../icons-generated/Exclamation'
import IconStampyLarge from '~/components/icons-generated/StampyLarge'
import IconStampySmall from '~/components/icons-generated/StampySmall'
import SendIcon from '~/components/icons-generated/PlaneSend'
import Button from '~/components/Button'
import {queryLLM, Entry, AssistantEntry, StampyEntry, Followup, ChatSettings} from '~/hooks/useChat'
import useOutsideOnClick from '~/hooks/useOnOutsideClick'
import useOnSiteQuestions from '~/hooks/useOnSiteQuestions'
import ChatEntry from './ChatEntry'
import './widgit.css'
import {questionUrl} from '~/routesMapper'
import {Question} from '~/server-utils/stampy'
import {useSearch} from '~/hooks/useSearch'
import Input from '~/components/Input'
import useIsMobile from '~/hooks/isMobile'

const MIN_SIMILARITY = 0.85

type QuestionInputProps = {
  initial?: string
  onChange?: (val: string) => void
  onAsk?: (val: string) => void
  onSuggestedAsk?: (followup: Followup) => void
  fixed?: boolean
  placeholder?: string
}
const QuestionInput = ({
  initial,
  onChange,
  onAsk,
  onSuggestedAsk,
  fixed,
  placeholder = 'Ask Stampy a question...',
}: QuestionInputProps) => {
  const [question, setQuestion] = useState(initial || '')
  const {results, search, clear} = useSearch(1)
  const clickDetectorRef = useOutsideOnClick(() => handleChange(''))
  const mobile = useIsMobile()

  const handleAsk = (val: string) => {
    clear()
    onAsk && onAsk(val)
    setQuestion('')
  }

  const handleSuggestedAsk = (followUp: Followup) => {
    clear()
    onSuggestedAsk && onSuggestedAsk(followUp)
    setQuestion('')
  }

  const handleChange = (val: string) => {
    search(val, 0.7)
    setQuestion(val)
    onChange && onChange(val)
  }

  return (
    <div
      className={
        'widget-ask ' +
        (fixed ? `fixed z-index-1 ${mobile ? 'mobile-chat-width' : 'col-10'}` : 'col-9')
      }
      ref={clickDetectorRef}
    >
      {results.length > 0 ? (
        <Button
          className="full-width suggestion"
          action={() => handleSuggestedAsk({text: results[0].title, pageid: results[0].pageid})}
        >
          <p className="default">{results[0].title}</p>
        </Button>
      ) : undefined}
      <div className="relative">
        <Input
          placeholder={placeholder}
          className="large full-width shadowed"
          value={question}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleChange('')
            } else if (e.key === 'Enter' && question.trim() && onAsk) {
              handleAsk(question)
            }
          }}
        />
        <SendIcon className="send pointer" onClick={() => handleAsk(question)} />
      </div>
      {fixed && <div className="white-space" />}

      <div className="mobile-only grey mobile-caution xxs padding-top-8">
        <ExclamationIcon />{' '}
        <span className="padding-left-4">Stampy can be inaccurate. Always verify its sources.</span>
      </div>
    </div>
  )
}

export const WidgetStampy = ({className}: {className?: string}) => {
  const [question, setQuestion] = useState('')
  const {selected: questions} = useOnSiteQuestions()
  const navigate = useNavigate()

  const stampyUrl = (question: string) => `/chat/?question=${question.trim()}`
  return (
    <div className={`centered col-9 padding-bottom-128 ${className || ''}`}>
      <div className="col-6 padding-bottom-56">
        <h2 className="teal-500">Questions?</h2>
        <h2>Ask Stampy, our chatbot, any question about AI safety</h2>
      </div>

      <div className="sample-messages-container padding-bottom-24">
        <IconStampySmall />
        <div className="sample-messages rounded">
          <div className="padding-bottom-24">Try asking me...</div>
          {questions.map(({title}, i) => (
            <div key={i} className="padding-bottom-16">
              <Button className="secondary-alt-large" action={stampyUrl(title)}>
                {title}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <QuestionInput
        initial={question}
        onChange={setQuestion}
        onAsk={(question) => {
          navigate({
            pathname: '/chat/',
            search: `?question=${question.trim()}`,
          })
        }}
      />
    </div>
  )
}

type FollowupsProps = {
  title?: string
  followups?: Followup[]
  onSelect: (followup: Followup) => void
  className?: string
}
const Followups = ({title, followups, onSelect, className}: FollowupsProps) => {
  const {randomQuestions} = useOnSiteQuestions()
  const items =
    (followups?.length || 0) >= 3
      ? followups
      : [
          ...(followups || []),
          ...randomQuestions().map(({title, pageid}) => ({text: title, pageid})),
        ].slice(0, 3)
  return (
    <>
      {title && <div className={'padding-bottom-24' + (className || '')}>{title}</div>}

      {items?.map(({text, pageid}, i) => (
        <div key={i} className="padding-bottom-16">
          <Button
            className="secondary-alt-large text-align-left followup-button"
            action={() => onSelect({text, pageid})}
          >
            {text}
          </Button>
        </div>
      ))}
    </>
  )
}

const SplashScreen = ({
  questions,
  onSelection,
}: {
  questions?: Followup[]
  onSelection: (followup: Followup) => void
}) => (
  <div className="padding-top-40">
    <IconStampyLarge />
    <div className="col-6 padding-bottom-40 padding-top-40">
      <h2 className="teal-500">Hi there, I’m Stampy.</h2>
      <h2>I can answer your questions about AI Safety.</h2>
    </div>
    <Followups
      title="Not sure where to start? Try these:"
      followups={questions}
      onSelect={onSelection}
    />
  </div>
)

type ChatbotProps = {
  question?: string
  questions?: Question[]
  settings?: ChatSettings
}
export const Chatbot = ({question, questions, settings}: ChatbotProps) => {
  const [followups, setFollowups] = useState<Followup[]>()
  const [sessionId] = useState(crypto.randomUUID())
  const [history, setHistory] = useState([] as Entry[])
  const [controller, setController] = useState(() => new AbortController())
  const fetcher = useFetcher({key: 'followup-fetcher'})
  const {search, resultsForRef, waitForResults, loadedQuestions} = useSearch(1)
  const mobile = useIsMobile()

  // When a page needs to be loaded fetcher.load(url) is called and then this
  // effect takes care of filling in the content of the StampyArticle ChatEntry
  // once it has been loaded.
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
            (question.relatedQuestions || [])
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

  const showArticleByID = async ({text, pageid}: Followup) => {
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
    const answer = {role: 'assistant', question} as AssistantEntry
    setHistory((current) => {
      const last = current[current.length - 1]
      if (
        (last?.role === 'assistant' &&
          ['streaming', 'followups', 'done'].includes(last?.phase || '')) ||
        (last?.role === 'stampy' && last?.content) ||
        ['error'].includes(last?.role)
      ) {
        return [...current, message, answer]
      } else if (last?.role === 'user' && last?.content === question) {
        return [...current.slice(0, current.length - 1), answer]
      }
      return [...current.slice(0, current.length - 2), message, answer]
    })

    setFollowups(undefined)
    const updateReply = (reply: Entry) =>
      setHistory((current) => [...current.slice(0, current.length - 2), message, reply])

    search(question, MIN_SIMILARITY)
    const [humanWritten] = await waitForResults(100, 1000)
    if (newController.signal.aborted) {
      return
    }

    if (humanWritten && question === resultsForRef.current) {
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
    if (loadedQuestions && question && !fetchFlag.current) {
      fetchFlag.current = true
      onQuestion(question)
    }
    // eslint-disable-next-line
  }, [loadedQuestions, question])

  return (
    <div className={`centered height-70 ${mobile ? 'mobile-chat-width' : 'col-10'}`}>
      {history.length === 0 ? (
        <SplashScreen
          questions={questions?.map(({title, pageid}) => ({pageid, text: title}))}
          onSelection={showArticleByID}
        />
      ) : undefined}
      {history.map((item, i) => (
        <ChatEntry key={`chat-entry-${i}`} {...item} no={i} />
      ))}

      <div className="followups-container">
        {followups ? (
          <Followups
            title="Continue the conversation"
            followups={followups}
            onSelect={showArticleByID}
          />
        ) : undefined}
      </div>

      <QuestionInput
        onAsk={onQuestion}
        onSuggestedAsk={showArticleByID}
        placeholder={history.length > 0 ? 'Message Stampy' : undefined}
        fixed
      />

      <div className="desktop-only warning-floating z-index-1">
        <p className="xs">
          <span className="red xs-bold">Caution! </span>
          This is an early prototype. Don’t automatically trust what it says, and make sure to
          follow its sources.
        </p>
      </div>
    </div>
  )
}

export default Chatbot
