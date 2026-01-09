import {ComponentType, ReactNode, useRef, memo} from 'react'
import {Link} from '@remix-run/react'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import Contents from '~/components/Article/Contents'
import Feedback, {logFeedback} from '~/components/Feedback'
import useGlossaryInjection from '~/hooks/useGlossaryInjection'
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

const md = new MarkdownIt({html: true, breaks: true})

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
  const contentRef = useRef<HTMLDivElement>(null)
  const citations = [] as Citation[]
  citationsMap?.forEach((v) => {
    citations.push({...v, id: `${v.id}-${no}`})
  })
  citations.sort((a, b) => a.index - b.index)

  // Only inject glossary links when streaming is complete
  const isStreamingComplete = phase === 'followups' || phase === 'done'
  useGlossaryInjection({
    elementRef: contentRef,
    enabled: isStreamingComplete,
  })

  // Render content with markdown and inject citations
  const renderContentWithCitations = () => {
    if (!content) return null

    // Replace [N] citations with citation HTML (markdown-it will preserve this with html: true)
    const processedContent = content.replace(/\[(\d+)\]/g, (match, refId) => {
      const ref = citationsMap?.get(refId)
      if (!ref) return match
      const targetId = `${ref.id}-${no}`
      return `<span class="ref-container"><a id="${targetId}-ref" href="#${targetId}" class="reference-link ref-${ref.index}" onclick="event.preventDefault(); document.getElementById('${targetId}')?.scrollIntoView({block: 'start'});"><span>${ref.index}</span></a></span>`
    })

    // Render markdown (breaks: true will convert single newlines to <br>)
    const renderedHtml = md.render(processedContent)

    // Sanitize HTML to prevent XSS attacks from LLM-generated content
    // Allow onclick for citation navigation (safe since we control the content)
    const sanitizedHtml = DOMPurify.sanitize(renderedHtml, {
      ADD_ATTR: ['onclick'],
    })

    return (
      <article
        ref={contentRef}
        className="contents"
        dangerouslySetInnerHTML={{__html: sanitizedHtml}}
      />
    )
  }

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
        {renderContentWithCitations()}
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
  const seenGlossaryTermsRef = useRef(new Set<string>())
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
            seenGlossaryTermsRef={seenGlossaryTermsRef}
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
