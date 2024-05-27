import {useEffect, useState} from 'react'
import Button from '~/components/Button'
import useOutsideOnClick from '~/hooks/useOnOutsideClick'
import './feedback.css'

export type FeedbackFormProps = {
  onSubmit?: (msg: string, option?: string) => Promise<any>
  onClose?: () => void
  options?: string[]
}
const FeedbackForm = ({onSubmit, onClose, options}: FeedbackFormProps) => {
  const [selected, setSelected] = useState<string>()
  const [message, setMessage] = useState('')
  const [enabledSubmit, setEnabledSubmit] = useState(!options)
  const [numClicks, setNumClicks] = useState(0)
  const clickCheckerRef = useOutsideOnClick(onClose)

  useEffect(() => {
    // Hide the form after 10 seconds if the user hasn't interacted with it
    const timeoutId = setInterval(() => {
      onClose && onClose()
    }, 10000)

    // Clear the timeout to prevent it from running if the component unmounts
    return () => clearInterval(timeoutId)
  }, [numClicks, onClose])

  const selectFeedback = (option: string) => {
    setSelected(option)
    setEnabledSubmit(true)
  }

  const handleSubmit = async () => {
    onSubmit && (await onSubmit(message, selected))
    onClose && onClose()
  }

  return (
    <div
      ref={clickCheckerRef}
      onClick={() => setNumClicks((current) => current + 1)}
      className="col-5 feedback-form bordered"
    >
      <span className="black small padding-bottom-32">What was the problem?</span>
      {options?.map((option) => (
        <Button
          key={option}
          className={[
            option == selected ? 'secondary-alt selected' : 'secondary',
            'select-option',
          ].join(' ')}
          action={() => selectFeedback(option)}
        >
          {option}
        </Button>
      ))}

      <textarea
        name="feedback-text"
        className={['feedback-text bordered', !options ? 'no-options' : ''].join(' ')}
        placeholder="Leave a comment (optional)"
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button className="primary full-width" action={handleSubmit} disabled={!enabledSubmit}>
        <p>Submit feedback</p>
      </Button>
    </div>
  )
}

export default FeedbackForm
