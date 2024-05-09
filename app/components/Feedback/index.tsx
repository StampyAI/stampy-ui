import {useEffect, useState} from 'react'
import {CompositeButton} from '~/components/Button'
import {Action, ActionType} from '~/routes/questions.actions'
import './feedback.css'
import FeedbackForm from './Form'
import type {Citation} from '~/hooks/useChat'

type FeedbackType = {
  option?: string
  message?: string
  question?: string
  answer: string
  pageid?: string
  citations?: Citation[]
  type: 'human' | 'bot' | 'error'
}
export const logFeedback = async (feedback: FeedbackType) =>
  fetch(`/chat/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  })

type FeedbackProps = {
  pageid: string
  showForm?: boolean
  labels?: boolean
  upHint?: string
  downHint?: string
  options?: string[]
  onSubmit?: (message: string, option?: string) => Promise<any>
}
const Feedback = ({
  pageid,
  showForm,
  labels,
  upHint,
  downHint,
  options,
  onSubmit,
}: FeedbackProps) => {
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
          onClick={() => {
            setShowFeedback(true)
            onSubmit && onSubmit('', '')
          }}
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
          onSubmit={onSubmit}
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
