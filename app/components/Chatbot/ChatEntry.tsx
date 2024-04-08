import {ComponentType} from 'react'
import {Link} from '@remix-run/react'
import QuestionMarkIcon from '~/components/icons-generated/QuestionMark'
import BotIcon from '~/components/icons-generated/Bot'
import PersonIcon from '~/components/icons-generated/Person'
import StampyIcon from '~/components/icons-generated/Stampy'
import Contents from '~/components/Article/Contents'
import useGlossary from '~/hooks/useGlossary'
import './chat_entry.css'
import type {Entry, AssistantEntry, StampyEntry, Citation} from '~/hooks/useChat'

const hints = {
  bot: 'bla bla bla something bot',
  human: 'bla bla bla by humans',
}

const AnswerInfo = ({answerType}: {answerType?: 'human' | 'bot'}) => {
  if (!answerType) return null
  return (
    <span className="info">
      {answerType === 'human' ? <PersonIcon /> : <BotIcon />}
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
  answerType?: 'human' | 'bot'
}
const Title = ({title, Icon, answerType}: TitleProps) => (
  <div className="flex-container title">
    <Icon />
    <span className="default-bold flex-double">{title}</span>
    <AnswerInfo answerType={answerType} />
  </div>
)

const UserQuery = ({content}: Entry) => (
  <div>
    <Title title="You" Icon={PersonIcon} />
    <div>{content}</div>
  </div>
)

// FIXME: this id should be unique across the page - I doubt it will be now
const ReferenceLink = ({id, reference}: {id: string; reference: string}) => (
  <Link id={`#${id}-ref`} to={`#${id}`} className="reference-link">
    {reference}
  </Link>
)

const Reference = ({id, title, authors, source, url, reference}: Citation) => {
  const referenceSources = {
    arxiv: 'Scientific paper',
    blogs: 'Blogpost',
    eaforum: 'EAForum',
    alignmentforum: 'AlignmentForum',
    lesswrong: 'LessWrong',
    arbital: 'Arbital',
    distill: 'Distill',
    'aisafety.info': 'AISafety.info',
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
    <div key={id} id={`#${id}`} className="reference padding-bottom-32">
      <div className="reference-num small">{reference}</div>
      <div>
        <div className="title">{title}</div>
        <div>
          <Authors authors={authors} />
          <span>{'  ·  '}</span>
          <Link className="source-link" to={url}>
            {referenceSources[source as keyof typeof referenceSources] || new URL(url).host}
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

  const references = citations.map(({reference}) => reference).join('')
  const referencesRegex = new RegExp(`(\\[[${references}]\\])`)

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
      <div>
        {content?.split(referencesRegex).map((chunk, i) => {
          if (chunk.match(referencesRegex)) {
            const ref = citationsMap?.get(chunk[1])
            return <ReferenceLink key={i} id={ref?.id || chunk[i]} reference={chunk[1]} />
          } else {
            return <span key={i}>{chunk}</span>
          }
        })}
      </div>
      {citations?.map(Reference)}
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

const ChatEntry = (props: Entry) => {
  const roles = {
    user: UserQuery,
    stampy: StampyArticle,
    assistant: ChatbotReply,
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
