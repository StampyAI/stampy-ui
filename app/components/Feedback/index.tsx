import {useEffect, useState} from 'react'
import {Action, ActionType} from '~/routes/questions.actions'
import './feedback.css'
import FeedbackForm from './Form'
import type {Citation} from '~/hooks/useChat'
import {ButtonSecondaryWrapper} from '../ButtonSecondary'

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
  formClassName?: string
  options?: string[]
  onSubmit: (message: string, option?: string) => Promise<any>
}
const Feedback = ({
  pageid,
  showForm,
  labels,
  upHint,
  downHint,
  options,
  formClassName,
  onSubmit,
}: FeedbackProps) => {
  const [showThanks, setShowThanks] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [voted, setVoted]: any = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setShowThanks(false), 6000)
    return () => clearInterval(timeout)
  }, [showThanks])

  return (
    <div className="feedback">
      <ButtonSecondaryWrapper>
        <Action
          pageid={pageid}
          showText={!!labels}
          actionType={ActionType.HELPFUL}
          disabled={voted}
          hint={upHint}
          setVoted={setVoted}
          onClick={() => {
            setShowThanks(true)
          }}
        />
        <Action
          pageid={pageid}
          showText={!!labels}
          hint={downHint}
          actionType={ActionType.UNHELPFUL}
          disabled={voted}
          setVoted={setVoted}
          onClick={() => {
            if (!showForm) setShowThanks(true)
            setShowFeedbackForm(!!showForm)
          }}
        />
      </ButtonSecondaryWrapper>

      <p className={'thanks ' + (showThanks ? 'show' : 'hide')}>Thank you for your feedback!</p>

      {showFeedbackForm && (
        <FeedbackForm
          onSubmit={(att) => {
            setShowThanks(true)
            return onSubmit(att)
          }}
          onClose={() => {
            setShowFeedbackForm(false)
          }}
          options={options}
          className={formClassName}
        />
      )}
    </div>
  )
}

export default Feedback
