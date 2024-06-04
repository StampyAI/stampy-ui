import {useState} from 'react'
import {Link} from '@remix-run/react'
import KeepGoing from '~/components/Article/KeepGoing'
import CopyIcon from '~/components/icons-generated/Copy'
import EditIcon from '~/components/icons-generated/Pencil'
import Button, {CompositeButton} from '~/components/Button'
import Feedback, {logFeedback} from '~/components/Feedback'
import {tagUrl} from '~/routesMapper'
import type {Glossary, Question, Banner as BannerType} from '~/server-utils/stampy'
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
      <div className="footer-comtainer padding-bottom-40">
        {date && <div className="grey"> {`Updated ${date}`}</div>}
        <CompositeButton secondary>
          <Button
            secondary
            action={question.answerEditLink || ''}
            tooltip="Google Doc"
            props={{target: '_blank', rel: 'noopener noreferrer'}}
          >
            <EditIcon />
          </Button>
        </CompositeButton>
        <Feedback
          showForm
          pageid={question.pageid}
          onSubmit={async (message: string, option?: string) =>
            logFeedback({
              message,
              option,
              type: 'bot',
              question: question.title || '',
              answer: question.text || '',
            })
          }
          options={['Unclear', 'Too wordy', 'Confusing', 'Incorrect', 'Other']}
          upHint="This page was helpful"
          downHint="This page was unhelpful"
        />
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
      <Button
        className="secondary"
        action={answerEditLink || ''}
        tooltip="Suggest changes in Google Docs"
        props={{target: '_blank', rel: 'noopener noreferrer'}}
      >
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

const Banner = ({title, text, icon, backgroundColour, textColour}: BannerType) => {
  return (
    <div
      key={title}
      className="banner rounded shadowed"
      style={{
        backgroundColor: backgroundColour || 'inherit',
        color: textColour || 'inherit',
      }}
    >
      <h3>
        <img src={icon?.url} alt={icon?.name} />
        <span className="title">{title}</span>
      </h3>
      <div
        className="banner-contents"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      ></div>
    </div>
  )
}

const Tags = ({tags}: Question) => (
  <div className="tags">
    {tags?.map((tag) => (
      <Link key={tag} className="tag bordered" to={tagUrl({name: tag})}>
        {tag}
      </Link>
    ))}
  </div>
)

type ArticleProps = {
  question: Question
  glossary?: Glossary
  className?: string
}
export const Article = ({question, glossary, className}: ArticleProps) => {
  const {title, text, pageid} = question

  return (
    <article className={`${className} ${isLoading(question) ? 'loading' : ''}`}>
      <h1 className="teal-500 padding-bottom-24">{title}</h1>
      {question.banners?.filter((b) => b.title).map(Banner)}
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
