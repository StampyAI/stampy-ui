import React, {useState} from 'react'
import {CompositeButton} from '~/components/Button'
import {Action, ActionType} from '~/routes/questions.actions'
import './article.css'
import FeedbackForm from '~/components/Article/FeedbackForm'

type FeedbackProps = {
  pageid: string
  showForm?: boolean
  labels?: boolean
  upHint?: string
  downHint?: string
}
const Feedback = ({pageid, showForm, labels, upHint, downHint}: FeedbackProps) => {
  const [showFeedback, setShowFeedback] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [isFormFocused, setIsFormFocused] = useState(false)

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
    <CompositeButton className="flex-container relative feedback">
      <Action
        pageid={pageid}
        showText={!!labels}
        actionType={ActionType.HELPFUL}
        hint={upHint}
        onSuccess={() => setShowFeedback(true)}
      />
      <Action
        pageid={pageid}
        showText={!!labels}
        hint={downHint}
        actionType={ActionType.UNHELPFUL}
        onClick={() => setShowFeedbackForm(!!showForm)}
      />
      <div className={['action-feedback-text', showFeedback ? 'show' : ''].join(' ')}>
        Thanks for your feedback!
      </div>
      <FeedbackForm
        pageid={pageid}
        className={['feedback-form', showFeedbackForm ? 'show' : ''].join(' ')}
        onClose={() => {
          setShowFeedback(true)
          setShowFeedbackForm(false)
        }}
        onBlur={() => setIsFormFocused(false)}
        onFocus={() => setIsFormFocused(true)}
        hasOptions={false}
      />
    </CompositeButton>
  )
}

export default Feedback
