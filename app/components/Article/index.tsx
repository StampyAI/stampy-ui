import React, {useState} from 'react'
import {Link} from '@remix-run/react'
import KeepGoing from '~/components/Article/KeepGoing'
import CopyIcon from '~/components/icons-generated/Copy'
import EditIcon from '~/components/icons-generated/Pencil'
import Button, {CompositeButton} from '~/components/Button'
import {Action, ActionType} from '~/routes/questions.actions'
import type {Glossary, Question} from '~/server-utils/stampy'
import {tagUrl} from '~/routesMapper'
import Contents from './Contents'
import './article.css'
import FeedbackForm from '~/components/Article/FeedbackForm'

const isLoading = ({text}: Question) => !text || text === 'Loading...'

const ArticleFooter = (question: Question) => {
  const [showFeedback, setShowFeedback] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [isFormFocused, setIsFormFocused] = useState(false)
  const date =
    question.updatedAt &&
    new Date(question.updatedAt).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
    })

  React.useEffect(() => {
    // Hide the form after 10 seconds if the user hasn't interacted with it
    const timeoutId = setInterval(() => {
      if (!isFormFocused) {
        setShowFeedbackForm(false)
      }
    }, 10000)

    // Clear the timeout to prevent it from running if the component unmounts
    return () => clearInterval(timeoutId)
  }, [showFeedbackForm, isFormFocused])

  React.useEffect(() => {
    const timeout = setInterval(() => setShowFeedback(false), 6000)
    return () => clearInterval(timeout)
  }, [showFeedback])

  return (
    !isLoading(question) && (
      <div className="footer-comtainer padding-bottom-40">
        {date && <div className="grey"> {`Updated ${date}`}</div>}
        <div className="flex-double">
          <Button
            className="secondary"
            action={question.answerEditLink || ''}
            tooltip="Edit article"
            props={{target: '_blank', rel: 'noopener noreferrer'}}
          >
            <EditIcon className="no-fill" />
          </Button>
        </div>
        <span>Was this page helpful?</span>

        <CompositeButton className="flex-container">
          <Action
            pageid={question.pageid}
            showText={true}
            actionType={ActionType.HELPFUL}
            onSuccess={() => setShowFeedback(true)}
          />
          <Action
            pageid={question.pageid}
            showText={true}
            actionType={ActionType.UNHELPFUL}
            onClick={() => setShowFeedbackForm(true)}
          />
          <div className={['action-feedback-text', showFeedback ? 'show' : ''].join(' ')}>
            Thanks for your feedback!
          </div>
          <FeedbackForm
            pageid={question.pageid}
            className={['feedback-form', showFeedbackForm ? 'show' : ''].join(' ')}
            onClose={() => {
              setShowFeedback(true)
              setShowFeedbackForm(false)
            }}
            onBlur={() => setIsFormFocused(false)}
            onFocus={() => setIsFormFocused(true)}
            hasOptions={true}
          />
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
      <Button
        className="secondary"
        action={answerEditLink || ''}
        tooltip="Edit article"
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
