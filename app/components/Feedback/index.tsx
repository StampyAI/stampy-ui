import {useEffect, useState, useRef} from 'react'
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
  labels?: boolean
  options?: string[]
  onSubmit: (message: string, option?: string) => Promise<any>
}
const Feedback = ({pageid, showForm, labels, options, onSubmit}: FeedbackProps) => {
  const [showThanks, setShowThanks] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [upHover, setUpHover] = useState(false)
  const [downHover, setDownHover] = useState(false)
  const [vote, setVote]: any = useState(undefined)

  const thanksRef = useRef<HTMLDivElement | null>(null)

  function sendVote(v: boolean) {
    setVote(v)
    // This is where you would post the vote to the db, except idk how to do that
    // If 'v' is true, then user upvoted
    // if 'v' is false, then user downvoted
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
    <div className="relative flex items-center">
      <div className="flex rounded-md border-[1px] border-[#DFE3E9] w-fit p-[6px]">
        <button
          disabled={vote !== undefined}
          onClick={() => {
            sendVote(true)
            setShowThanks(true)
          }}
          className={
            'p-1 rounded-[4px] relative ' +
            (vote === true ? 'bg-[#EDFAF9]' : vote === undefined ? 'hover:bg-[#F9FAFC]' : '')
          }
          onMouseEnter={() => setUpHover(true)}
          onMouseLeave={() => setUpHover(false)}
        >
          <ThumbUpLarge color={vote === true ? 'var(--colors-teal-600)' : '#788492'} />
          {upHover && (
            <p className="absolute top-[-45px] left-[-80px] bg-[#1B2B3E] text-[14px] text-[#f2f2f2] py-[5px] px-[15px] rounded-[8px] whitespace-nowrap">
              This response was helpful
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
            'p-1 rounded-[4px] ml-[2px] relative ' +
            (vote === false ? 'bg-[#EDFAF9]' : vote === undefined ? 'hover:bg-[#F9FAFC]' : '')
          }
          onMouseEnter={() => setDownHover(true)}
          onMouseLeave={() => setDownHover(false)}
        >
          <ThumbDownLarge color={vote === false ? 'var(--colors-teal-600)' : '#788492'} />
          {downHover && (
            <p className="absolute top-[-45px] left-[-80px] bg-[#1B2B3E] text-[14px] text-[#f2f2f2] py-[5px] px-[15px] rounded-[8px] whitespace-nowrap">
              This response was unhelpful
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
        />
      )}
    </div>
  )
}

export default Feedback
