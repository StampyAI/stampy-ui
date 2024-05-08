import {ComponentType} from 'react'
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
      <QuestionMarkIcon className="hint" />
      <div className="hint-contents rounded">{hint}</div>
    </span>
  )
}

type TitleProps = {
  title: string
  Icon: ComponentType
  answerType?: 'human' | 'bot' | 'error'
  hint?: string
}
const Title = ({title, Icon, answerType, hint}: TitleProps) => (
  <div className="flex-container title padding-bottom-16">
    <Icon />
    <span className="default-bold flex-double">{title}</span>
    <AnswerInfo answerType={answerType} hint={hint} />
  </div>
)

const UserQuery = ({content}: Entry) => (
  <div>
    <Title title="You" Icon={PersonInCircleIcon} />
    <div className="padding-left-56 large-reading">{content}</div>
  </div>
)

const ReferenceSummary = ({title, authors, source, url}: Citation & {titleClass?: string}) => {
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

  return (
    <div>
      <div className="title padding-bottom-4">{title}</div>
      <div className="small">
        <Authors authors={authors} />
        <span>{'  ·  '}</span>
        <Link className="source-link teal-500" to={url} target="_blank" rel="noopener noreferrer">
          {referenceSources[source as keyof typeof referenceSources] || new URL(url).host}{' '}
          <LinkIcon width="16" height="16" />
        </Link>
      </div>
    </div>
  )
}

const md = new MarkdownIt({html: true})
const ReferencePopup = (citation: Citation) => {
  const parsed = citation.text?.match(/^###.*?###\s+"""(.*?)"""$/ms)
  if (!parsed) return undefined
  return (
    <div className="reference-contents rounded">
      <ReferenceSummary {...citation} titleClass="large-bold" />
      <div className="grey padding-bottom-16 padding-top-24">Referenced excerpt</div>
      <div
        dangerouslySetInnerHTML={{
          __html: md.render(parsed[1]),
        }}
      />
    </div>
  )
}

const ReferenceLink = (citation: Citation) => {
  const {id, index} = citation
  if (!index || index > MAX_REFERENCES) return ''

  return (
    <>
      <Link id={`${id}-ref`} to={`#${id}`} className={`reference-link ref-${index}`}>
        <span>{index}</span>
      </Link>
      <ReferencePopup {...citation} />
    </>
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

const ChatbotReply = ({question, phase, content, citationsMap}: AssistantEntry) => {
  const citations = [] as Citation[]
  citationsMap?.forEach((v) => {
    citations.push(v)
  })
  citations.sort((a, b) => a.index - b.index)

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
      <Title
        title="Stampy"
        Icon={IconStampySmall}
        answerType="bot"
        hint="Generated by an AI model"
      />
      <PhaseState />
      <div className="padding-bottom-56 padding-left-56 large-reading">
        {content?.split(/(\[\d+\])|(\n)/).map((chunk, i) => {
          if (chunk?.match(/(\[\d+\])/)) {
            const refId = chunk.slice(1, chunk.length - 1)
            const ref = citationsMap?.get(refId)
            return ref && <ReferenceLink key={i} {...ref} />
          } else if (chunk === '\n') {
            return <br key={i} />
          } else {
            return <span key={i}>{chunk}</span>
          }
        })}
      </div>
      {citations && citations.length > 0 && (
        <>
          <hr />
          <div className="padding-top-56">{citations?.slice(0, MAX_REFERENCES).map(Reference)}</div>
        </>
      )}
      {['followups', 'done'].includes(phase || '') ? (
        <Feedback
          showForm
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
      {phase === 'followups' ? <p>Checking for followups...</p> : undefined}
    </div>
  )
}

const StampyArticle = ({pageid, content, title}: StampyEntry) => {
  const glossary = useGlossary()
  const hint = `This response is pulled from our article "${title}" which was written by members of AISafety.info`

  return (
    <div>
      <Title title="Stampy" Icon={StampyIcon} answerType="human" hint={hint} />
      <div className="answer">
        <article className="stampy">
          <Contents
            pageid={pageid || ''}
            html={content || 'Loading...'}
            glossary={glossary || {}}
          />
        </article>
        <Feedback
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
