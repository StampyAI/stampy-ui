import {useEffect, useState} from 'react'
import {CompositeButton} from '~/components/Button'
import {Action, ActionType} from '~/routes/questions.actions'
import './feedback.css'
import FeedbackForm from './Form'

type FeedbackProps = {
  pageid: string
  showForm?: boolean
  labels?: boolean
  upHint?: string
  downHint?: string
  options?: string[]
}
const Feedback = ({pageid, showForm, labels, upHint, downHint, options}: FeedbackProps) => {
  const [showFeedback, setShowFeedback] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  useEffect(() => {
    const timeout = setInterval(() => setShowFeedback(false), 6000)
    return () => clearInterval(timeout)
  }, [showFeedback])

  return (
    <div className="feedback relative">
      <CompositeButton className="flex-container">
        <Action
          pageid={pageid}
          showText={!!labels}
          actionType={ActionType.HELPFUL}
          hint={upHint}
          onClick={() => setShowFeedback(true)}
        />
        <Action
          pageid={pageid}
          showText={!!labels}
          hint={downHint}
          actionType={ActionType.UNHELPFUL}
          onClick={() => {
            setShowFeedback(!showForm)
            setShowFeedbackForm(!!showForm)
          }}
        />
      </CompositeButton>

      {showFeedback && <div className="thanks">Thanks for your feedback!</div>}

      {showFeedbackForm && (
        <FeedbackForm
          onClose={() => {
            setShowFeedback(true)
            setShowFeedbackForm(false)
          }}
          options={options}
        />
      )}
    </div>
  )
}

export default Feedback
