import {ComponentType} from 'react'
import {Link} from '@remix-run/react'
import MarkdownIt from 'markdown-it'
import QuestionMarkIcon from '~/components/icons-generated/QuestionMark'
import Contents from '~/components/Article/Contents'
import useGlossary from '~/hooks/useGlossary'
import './chat_entry.css'
import type {Entry, AssistantEntry, StampyEntry, Citation, ErrorMessage} from '~/hooks/useChat'

// icons
import IconBotSmall from '~/components/icons-generated/BotSmall'
import LinkIcon from '~/components/icons-generated/Link'
import PersonIcon from '~/components/icons-generated/Person'
import StampyIcon from '~/components/icons-generated/Stampy'
import PersonInCircleIcon from '~/components/icons-generated/PersonInCircle'

const MAX_REFERENCES = 10
const hints = {
  bot: 'bla bla bla something bot',
  human: 'bla bla bla by humans',
  error: null,
}

const AnswerInfo = ({answerType}: {answerType?: 'human' | 'bot' | 'error'}) => {
  if (!answerType || !hints[answerType]) return null
  return (
    <span className="info">
      {answerType === 'human' ? <PersonIcon /> : <IconBotSmall />}
      <span className="small grey">
        {answerType === 'human' ? 'Human-written' : 'Bot-generated'} response
      </span>
      <QuestionMarkIcon className="hint" />
      <div className="hint-contents">{hints[answerType]}</div>
    </span>
  )
}

type TitleProps = {
  title: string
  Icon: ComponentType
  answerType?: 'human' | 'bot' | 'error'
}
const Title = ({title, Icon, answerType}: TitleProps) => (
  <div className="flex-container title padding-bottom-16">
    <Icon />
    <span className="default-bold flex-double">{title}</span>
    <AnswerInfo answerType={answerType} />
  </div>
)

const UserQuery = ({content}: Entry) => (
  <div>
    <Title title="You" Icon={PersonInCircleIcon} />
    <div className="padding-left-56 large-reading">{content}</div>
  </div>
)

const md = new MarkdownIt({html: true})
const ReferenceLink = ({id, index, text}: Citation) => {
  if (!index || index > MAX_REFERENCES) return ''

  const parsed = text?.match(/^###.*?###\s+"""(.*?)"""$/ms)
  return (
    <>
      <Link id={`${id}-ref`} to={`#${id}`} className={`reference-link ref-${index}`}>
        <span>{index}</span>
      </Link>
      {parsed && (
        <div
          className="reference-contents rounded"
          dangerouslySetInnerHTML={{
            __html: md.render(parsed[1]),
          }}
        />
      )}
    </>
  )
}

const Reference = ({id, title, authors, source, url, index}: Citation) => {
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
    <div key={id} id={id} className="reference padding-bottom-32">
      <div className={`reference-num small-bold ref-${index}`}>{index}</div>
      <div>
        <div className="title">{title}</div>
        <div>
          <Authors authors={authors} />
          <span>{'  ·  '}</span>
          <Link className="source-link" to={url} target="_blank" rel="noopener noreferrer">
            {referenceSources[source as keyof typeof referenceSources] || new URL(url).host}{' '}
            <LinkIcon width="16" height="16" />
          </Link>
        </div>
      </div>
    </div>
  )
}

const ChatbotReply = ({phase, content, citationsMap}: AssistantEntry) => {
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
      <Title title="Stampy" Icon={StampyIcon} answerType="bot" />
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
      {phase === 'followups' ? <p>Checking for followups...</p> : undefined}
    </div>
  )
}

const StampyArticle = ({pageid, content}: StampyEntry) => {
  const glossary = useGlossary()

  return (
    <div>
      <Title title="Stampy" Icon={StampyIcon} answerType="human" />
      <article className="stampy">
        <Contents pageid={pageid || ''} html={content || 'Loading...'} glossary={glossary || {}} />
      </article>
    </div>
  )
}

const ErrorReply = ({content}: ErrorMessage) => {
  return (
    <div>
      <Title title="Error" Icon={StampyIcon} answerType="error" />
      <div>{content}</div>
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
    <div className="chat-entry padding-bottom-40">
      <Role {...props} />
    </div>
  )
}

export default ChatEntry
