import {ComponentType, ReactNode, MouseEvent, useState, useRef, memo} from 'react'
import {Link} from '@remix-run/react'
import MarkdownIt from 'markdown-it'
import Contents from '~/components/Article/Contents'
import Feedback, {logFeedback} from '~/components/Feedback'
import useGlossary from '~/hooks/useGlossary'
import './chat_entry.css'
import type {Entry, AssistantEntry, StampyEntry, Citation, ErrorMessage} from '~/hooks/useChat'

// icons
import IconBotSmall from '~/components/icons-generated/BotSmall'
import LinkIcon from '~/components/icons-generated/LinkOut'
import PersonIcon from '~/components/icons-generated/Person'
import StampyIcon from '~/components/icons-generated/Stampy'
import PersonInCircleIcon from '~/components/icons-generated/PersonInCircle'
import IconStampySmall from '~/components/icons-generated/StampySmall'
import QuestionMarkIcon from '~/components/icons-generated/QuestionMark'
import useIsMobile from '~/hooks/isMobile'
import {togglePopup} from '../popups'

const MAX_REFERENCES = 10

const AnswerInfo = ({
  answerType,
  hint,
}: {
  hint?: string
  answerType?: 'human' | 'bot' | 'error'
}) => {
  if (!answerType || !hint) return null
  return (
    <span className="info">
      {answerType === 'human' ? <PersonIcon /> : <IconBotSmall />}
      <span className="small grey">
        {answerType === 'human' ? 'Human-written' : 'Bot-generated'} response
      </span>
      <div className="icon-container leading-0">
        <QuestionMarkIcon className="hint" />
        <div className="hint-contents-container">
          <div className="hint-contents xs">{hint}</div>
        </div>
      </div>
    </span>
  )
}

type TitleProps = {
  title: string
  Icon: ({width, height}: {width: string; height: string}) => ReactNode
  answerType?: 'human' | 'bot' | 'error'
  hint?: string
}
const Title = ({title, Icon, answerType, hint}: TitleProps) => (
  <div className="title-container padding-bottom-8">
    <Icon width="40" height="40" />
    <div className="title-inner-container">
      <span className="default-bold">{title}</span>
      <AnswerInfo answerType={answerType} hint={hint} />
    </div>
  </div>
)

const UserQuery = ({content}: Entry) => (
  <div>
    <Title title="You" Icon={PersonInCircleIcon} />
    <div className="padding-left-56-rigid large-reading">{content}</div>
  </div>
)

const ReferenceSummary = ({
  title,
  authors,
  source,
  url,
  titleClass,
}: Citation & {titleClass?: string}) => {
  const referenceSources = {
    arxiv: 'Scientific paper',
    blogs: 'Blogpost',
    eaforum: 'EAForum',
    alignmentforum: 'AlignmentForum',
    lesswrong: 'LessWrong',
    arbital: 'Arbital',
    distill: 'Distill',
    'aisafety.info': 'AISafety.info',
    youtube: 'YouTube',
  }

  const Authors = ({authors}: {authors?: string[]}) => {
    if (!authors || !authors.length || authors.length === 0) return null
    return (
      <span className="authors">
        {authors.slice(0, 3).join(', ')}
        {authors.length <= 3 ? '' : ' et. al.'}
      </span>
    )
  }

  function convertAscii(str: string) {
    return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
  }

  return (
    <div>
      <div className={`black padding-bottom-8 ${titleClass}`}>{convertAscii(title)}</div>
      <div className="small">
        {source !== 'youtube' && (
          <>
            <Authors authors={authors} />
            <span>{'  ·  '}</span>
          </>
        )}
        <Link className="source-link teal-500" to={url} target="_blank" rel="noopener noreferrer">
          {referenceSources[source as keyof typeof referenceSources] || new URL(url).host}{' '}
          <LinkIcon width="16" height="16" />
        </Link>
      </div>
    </div>
  )
}

const md = new MarkdownIt({html: true})
const ReferencePopup = (
  citation: Citation & {className?: string; onClose?: (event: MouseEvent) => void}
) => {
  const parsed = citation.text?.match(/^###.*?###\s+"""(.*?)"""$/ms)
  if (!parsed) return undefined

  return (
    <div
      className={`reference-popup background z-index-2 ${citation.className || ''}`}
      onClick={citation.onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="reference-contents bordered">
        <ReferenceSummary {...citation} titleClass="large-bold" />
        <div className="grey padding-bottom-16 padding-top-32 xs">Referenced excerpt</div>
        <div
          className="default inner-html"
          dangerouslySetInnerHTML={{
            __html: md.render(parsed[1]),
          }}
        />
      </div>
    </div>
  )
}

const ReferenceLink = (citation: Citation & {mobile?: boolean}) => {
  const ref = useRef<HTMLAnchorElement>(null)
  const [shown, setShown] = useState(false)
  const clickHandler = !citation.mobile
    ? undefined
    : togglePopup(() => setShown((current) => !current), ref.current || undefined)

  const {id, index} = citation
  if (!index || index > MAX_REFERENCES) return ''

  return (
    <span className="ref-container">
      <Link
        ref={ref}
        id={`${id}-ref`}
        to={`#${id}`}
        className={`reference-link ref-${index}`}
        onClick={clickHandler}
      >
        <span>{index}</span>
      </Link>
      <ReferencePopup {...citation} className={shown ? 'shown' : 'hidden'} onClose={clickHandler} />
    </span>
  )
}

const Reference = (citation: Citation) => {
  return (
    <div key={citation.id} id={citation.id} className="reference padding-bottom-32">
      <div className={`reference-num small ref-${citation.index}`}>{citation.index}</div>
      <ReferenceSummary {...citation} />
    </div>
  )
}

const Citations = ({citations}: {citations?: Citation[]}) => {
  if (!citations || citations.length === 0) return null
  const uniqueCitations = Object.values(
    citations.reduce(
      (acc, citation) => ({...acc, [citation.id || '']: citation}),
      {} as {[key: string]: Citation}
    )
  )
  const sortedCitations = uniqueCitations.sort((a, b) => a.index - b.index)
  return (
    <>
      <hr />
      <div className="padding-top-56">
        {sortedCitations?.slice(0, MAX_REFERENCES).map(Reference)}
      </div>
    </>
  )
}

const PhaseState = memo(
  ({phase}: {phase?: AssistantEntry['phase']}) => {
    const phaseMessageClass = 'phase-message large-reading'
    const texts = {
      started: 'Loading: Sending query',
      semantic: 'Loading: Performing semantic search',
      history: 'Loading: Processing history',
      context: 'Loading: Creating context',
      prompt: 'Loading: Creating prompt',
      llm: 'Loading: Waiting for LLM',
    }

    const text = texts[phase as keyof typeof texts]
    if (!text) return null

    return (
      <p className={phaseMessageClass}>
        {text}
        <span className="animated-ellipsis"></span>
      </p>
    )
  },
  (prev, next) => prev.phase === next.phase
)
PhaseState.displayName = 'PhaseState'

const Thinking = ({
  phase,
  thoughts,
}: {
  phase?: AssistantEntry['phase']
  thoughts?: AssistantEntry['thoughts']
}) => {
  return (
    <details className="phase-message">
      <summary className="grey large-reading">
        {phase === 'thinking' ? (
          <>
            Thinking<span className="animated-ellipsis"></span>
          </>
        ) : (
          'Thoughts'
        )}
      </summary>
      <div className="xs padding-top-8" style={{whiteSpace: 'pre-wrap'}}>
        {thoughts}
      </div>
    </details>
  )
}

const ChatbotReply = ({
  question,
  phase,
  content,
  thoughts,
  citationsMap,
  no,
}: AssistantEntry & {no: number}) => {
  const mobile = useIsMobile()
  const citations = [] as Citation[]
  citationsMap?.forEach((v) => {
    citations.push({...v, id: `${v.id}-${no}`})
  })
  citations.sort((a, b) => a.index - b.index)

  return (
    <div>
      <Title
        title="Stampy"
        Icon={IconStampySmall}
        answerType="bot"
        hint="Generated by an AI model"
      />
      <PhaseState phase={phase} />
      {thoughts && <Thinking thoughts={thoughts} phase={phase} />}
      <div className="padding-bottom-56 padding-left-56-rigid large-reading">
        {content?.split(/(\[\d+\])|(\n)/).map((chunk, i) => {
          if (chunk?.match(/(\[\d+\])/)) {
            const refId = chunk.slice(1, chunk.length - 1)
            const ref = citationsMap?.get(refId)
            return ref && <ReferenceLink key={i} mobile={mobile} {...ref} id={`${ref.id}-${no}`} />
          } else if (chunk === '\n') {
            return <br key={i} />
          } else {
            return <span key={i}>{chunk}</span>
          }
        })}
      </div>
      <Citations citations={citations} />
      {['followups', 'done'].includes(phase || '') ? (
        <Feedback
          showForm
          className={citations && citations.length > 0 ? '' : 'padding-left-56-rigid'}
          pageid="chatbot"
          upHint="This response was helpful"
          downHint="This response was unhelpful"
          onSubmit={async (message: string, option?: string) =>
            logFeedback({message, option, type: 'bot', question, answer: content, citations})
          }
          options={[
            'Making things up',
            'Wrong subject',
            'Confusing',
            'Issues with sources',
            'Other',
          ]}
        />
      ) : undefined}
      {phase === 'followups' ? (
        <p className="followups">
          Checking for followups<span className="animated-ellipsis"></span>
        </p>
      ) : undefined}
    </div>
  )
}

const StampyArticle = ({pageid, content, title, no}: StampyEntry & {no: number}) => {
  const glossary = useGlossary()
  const hint = `This response is pulled from our article "${title}" which was written by members of AISafety.info`

  const uniqueReferences = (content: string, idFinder: string) =>
    content
      .replaceAll(new RegExp(`id="(${idFinder})"`, 'g'), `id="$1-${no}"`)
      .replaceAll(new RegExp(`href="#(${idFinder})"`, 'g'), `href="#$1-${no}"`)

  return (
    <div>
      <Title title="Stampy" Icon={StampyIcon} answerType="human" hint={hint} />
      <div className="answer">
        <article className="stampy">
          <Contents
            pageid={pageid || ''}
            html={uniqueReferences(content || 'Loading...', 'fn\\d+-.*?')}
            glossary={glossary || {}}
          />
        </article>
        <Feedback
          className="padding-left-56-rigid"
          showForm
          pageid={pageid}
          upHint="This response was helpful"
          downHint="This response was unhelpful"
          onSubmit={async (message: string, option?: string) =>
            logFeedback({message, option, type: 'human', question: title, answer: content, pageid})
          }
          options={[
            'Making things up',
            'Wrong subject',
            'Confusing',
            'Issues with sources',
            'Other',
          ]}
        />
      </div>
    </div>
  )
}

const ErrorReply = ({content}: ErrorMessage) => {
  console.error(content)
  return (
    <div>
      <Title title="Error" Icon={StampyIcon} answerType="error" />
      <div>Sorry, something has gone wrong. Please ask your question again!</div>
    </div>
  )
}

const ChatEntry = (props: Entry) => {
  const roles = {
    user: UserQuery,
    stampy: StampyArticle,
    assistant: ChatbotReply,
    error: ErrorReply,
  } as {[k: string]: ComponentType<Entry>}
  const Role = roles[props.role] as ComponentType<Entry>
  if (!Role) return null
  return (
    <div className="chat-entry padding-bottom-56">
      <Role {...props} />
    </div>
  )
}

export default ChatEntry
