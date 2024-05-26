import {useState, useRef} from 'react'
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
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [voted, setVoted]: any = useState(false)

  const thanksRef = useRef<HTMLDivElement | null>(null)

  function showThanks() {
    if (thanksRef.current) thanksRef.current.style.opacity = '1'
    const timeout = setInterval(() => {
      if (thanksRef.current) thanksRef.current.style.opacity = '0'
    }, 6000)
    return () => clearInterval(timeout)
  }

  return (
    <div className="flex items-center">
      <ButtonSecondaryWrapper>
        <Action
          pageid={pageid}
          showText={!!labels}
          actionType={ActionType.HELPFUL}
          disabled={voted}
          hint={upHint}
          setVoted={setVoted}
          onClick={() => {
            showThanks()
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
            if (!showForm) showThanks()
            setShowFeedbackForm(!!showForm)
          }}
        />
      </ButtonSecondaryWrapper>

      <div ref={thanksRef} className="thanks ml-2 opacity-0 pointer-events-none">
        Thank you for your feedback!
      </div>

      {showFeedbackForm && (
        <FeedbackForm
          onSubmit={(att) => {
            showThanks()
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
