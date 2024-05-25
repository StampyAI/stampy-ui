import {useEffect, useState, useRef} from 'react'
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
  const [vote, setVote]: any = useState(undefined)

  const thanksRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (showThanks && thanksRef.current) {
      thanksRef.current.style.opacity = '1'
      setTimeout(() => {
        if (thanksRef.current) thanksRef.current.style.opacity = '0'
      }, 6000)
    }
  }, [showThanks])

  return (
    <div className="flex items-center">
      <ButtonSecondaryWrapper>
        <Action
          pageid={pageid}
          showText={!!labels}
          actionType={ActionType.HELPFUL}
          active={vote === 'helpful'}
          dissabled={!!vote}
          hint={upHint}
          onClick={() => {
            setVote('helpful')
            setShowThanks(true)
          }}
        />
        <Action
          pageid={pageid}
          showText={!!labels}
          hint={downHint}
          actionType={ActionType.UNHELPFUL}
          active={vote === 'unhelpful'}
          dissabled={!!vote}
          onClick={() => {
            setVote('unhelpful')
            setShowThanks(!showForm)
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
