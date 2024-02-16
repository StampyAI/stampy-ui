import {useState} from 'react'
import {Link} from '@remix-run/react'
import KeepGoing from '~/components/Article/KeepGoing'
import CopyIcon from '~/components/icons-generated/Copy'
import EditIcon from '~/components/icons-generated/Pencil'
import Button, {CompositeButton} from '~/components/Button'
import {Action, ActionType} from '~/routes/questions.actions'
import type {Glossary, Question} from '~/server-utils/stampy'
import Contents from './Contents'
import './article.css'

const isLoading = ({text}: Question) => !text || text === 'Loading...'

const ArticleFooter = (question: Question) => {
  const date =
    question.updatedAt &&
    new Date(question.updatedAt).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
    })

  return (
    !isLoading(question) && (
      <div className="footer-comtainer">
        {date && <div className="grey"> {`Updated ${date}`}</div>}
        <div className="flex-double">
          <Button
            className="secondary"
            action={question.answerEditLink || ''}
            tooltip="Edit article"
          >
            <EditIcon className="no-fill" />
          </Button>
        </div>
        <span>Did this page help you?</span>

        <CompositeButton className="flex-container">
          <Action pageid={question.pageid} showText={true} actionType={ActionType.HELPFUL} />
          <Action pageid={question.pageid} showText={true} actionType={ActionType.UNHELPFUL} />
        </CompositeButton>
      </div>
    )
  )
}

const ArticleActions = ({answerEditLink}: Question) => {
  const [tooltip, setTooltip] = useState('Copy link to clipboard')

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.toString())
    setTooltip('Copied link to clipboard')
    setTimeout(() => setTooltip('Copy link to clipboard'), 1000)
  }

  return (
    <CompositeButton>
      <Button className="secondary" action={copyLink} tooltip={tooltip}>
        <CopyIcon />
      </Button>
      <Button className="secondary" action={answerEditLink || ''} tooltip="Edit article">
        <EditIcon className="no-fill" />
      </Button>
    </CompositeButton>
  )
}

const ArticleMeta = ({question, className}: {question: Question; className?: string}) => {
  const {text} = question

  const ttr = (text: string, rate = 160) => {
    const time = text.split(' ')
    return Math.ceil(time.length / rate) // ceil to avoid "0 min read"
  }

  return (
    !isLoading(question) && (
      <div className={'article-meta ' + (className || '')}>
        <p className="grey large">{ttr(text || '')} min read</p>

        <ArticleActions {...question} />
      </div>
    )
  )
}

const Tags = ({tags}: Question) => (
  <div className="tags">
    {tags?.map((tag) => (
      <Link key={tag} className="tag bordered" to={`/tags/${tag}`}>
        {tag}
      </Link>
    ))}
  </div>
)

type ArticleProps = {
  question: Question
  glossary?: Glossary
}
export const Article = ({question, glossary}: ArticleProps) => {
  const {title, text, pageid} = question

  return (
    <article>
      <h1 className="teal padding-bottom-24">{title}</h1>
      <ArticleMeta question={question} className="padding-bottom-56" />

      <Contents pageid={pageid} html={text || ''} glossary={glossary || {}} />

      <KeepGoing {...question} />

      <ArticleFooter {...question} />
      <hr />

      <Tags {...question} />
    </article>
  )
}
export default Article
