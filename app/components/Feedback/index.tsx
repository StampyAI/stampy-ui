import {useEffect, useState, useRef} from 'react'
import {Action, ActionType} from '~/routes/questions.actions'
import './feedback.css'
import FeedbackForm from './Form'
import type {Citation} from '~/hooks/useChat'
import {ThumbDownLarge, ThumbUpLarge} from '../icons-generated'

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
  voteLabels?: undefined | [string, string]
  options?: string[]
  className?: string
  formClassName?: string
  onSubmit: (message: string, option?: string) => Promise<any>
}
const Feedback = ({
  pageid,
  showForm,
  voteLabels,
  options,
  onSubmit,
  className,
  formClassName,
}: FeedbackProps) => {
  const [showThanks, setShowThanks] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [vote, setVote]: any = useState(undefined)

  const thanksRef = useRef<HTMLDivElement | null>(null)

  async function sendVote(v: boolean) {
    setVote(v)

    // Someone please check if this is posting correctly and in turn delete this comment
    const searchParams = new URLSearchParams({
      pageid,
      actionTaken: vote,
      action: ActionType.HELPFUL,
    })
    const response = await fetch('/questions/actions', {method: 'POST', body: searchParams})

    if (response.ok !== true) {
      // handle error
    }
  }

  useEffect(() => {
    if (showThanks && thanksRef.current) {
      thanksRef.current.style.opacity = '1'
      setTimeout(() => {
        if (thanksRef.current) thanksRef.current.style.opacity = '0'
      }, 6000)
    }
  }, [showThanks])

  return (
    <div className={'relative flex items-center ' + (className || '')}>
      <div className="flex rounded-md border-[1px] border-[#DFE3E9] w-fit p-[6px]">
        <button
          disabled={vote !== undefined}
          onClick={() => {
            sendVote(true)
            setShowThanks(true)
          }}
          className={
            'p-1 rounded-[4px] relative vote-button ' +
            (vote === true ? 'bg-[#EDFAF9]' : vote === undefined ? 'hover:bg-[#F9FAFC]' : '')
          }
        >
          <ThumbUpLarge className={vote === true ? 'thumb-active' : 'thumb'} />
          {vote === undefined && voteLabels && (
            <p className="tool-tip absolute top-[-45px] left-[-80px] bg-[#1B2B3E] text-[14px] text-[#f2f2f2] py-[5px] px-[15px] rounded-[8px] whitespace-nowrap pointer-events-none">
              {voteLabels[0]}
            </p>
          )}
        </button>
        <button
          disabled={vote !== undefined}
          onClick={() => {
            sendVote(false)
            setShowFeedbackForm(!!showForm)
          }}
          className={
            'p-1 rounded-[4px] ml-[2px] relative vote-button ' +
            (vote === false ? 'bg-[#EDFAF9]' : vote === undefined ? 'hover:bg-[#F9FAFC]' : '')
          }
        >
          <ThumbDownLarge className={vote === false ? 'thumb-active' : 'thumb'} />
          {vote === undefined && voteLabels && (
            <p className="tool-tip absolute top-[-45px] left-[-80px] bg-[#1B2B3E] text-[14px] text-[#f2f2f2] py-[5px] px-[15px] rounded-[8px] whitespace-nowrap pointer-events-none">
              {voteLabels[1]}
            </p>
          )}
        </button>
      </div>
      <div ref={thanksRef} className="ml-2 opacity-0 thanks pointer-events-none">
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
