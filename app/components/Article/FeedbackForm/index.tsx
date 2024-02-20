import React, {ChangeEvent} from 'react'
import Button from '~/components/Button'
import './feedbackForm.css'

export interface FeedbackFormProps {
  /**
   * Article ID
   */
  pageid: string
  /**
   * Class name
   */
  className?: string
  /**
   * onBlur
   */
  onBlur?: () => void
  /**
   * onFocus
   */
  onFocus?: () => void
  /**
   * Has Options
   */
  hasOptions?: boolean
}
const FeedbackForm = ({
  pageid,
  className = 'feedback-form',
  onBlur,
  onFocus,
  hasOptions = true,
}: FeedbackFormProps) => {
  // to be implemented.
  console.log(pageid)
  const [feedbackOptions, setFeedbackOptions] = React.useState([
    {
      text: 'Making things up',
      selected: false,
      option: 'making_things_up',
    },
    {
      text: 'Being mean',
      selected: false,
      option: 'being_mean',
    },
    {
      text: 'Typos',
      selected: false,
      option: 'typos',
    },
  ])
  const [enabledSubmit, setEnabledSubmit] = React.useState(false)
  const selectFeedback = (option: number) => {
    setFeedbackOptions(
      feedbackOptions.map((feedback, index) => {
        if (index === option) {
          return {...feedback, selected: !feedback.selected}
        }
        return {...feedback, selected: false}
      })
    )
    if (onFocus) {
      onFocus()
    }
    setEnabledSubmit(true)
  }
  const handleBlur = React.useCallback(
    (e: ChangeEvent<HTMLElement>) => {
      const currentTarget = e.currentTarget

      // Give browser time to focus the next element
      requestAnimationFrame(() => {
        // Check if the new focused element is a child of the original container
        if (!currentTarget.contains(document.activeElement)) {
          if (onBlur) {
            onBlur()
          }
        }
      })
    },
    [onBlur]
  )

  const handleSubmit = () => {}

  return (
    <div className={className} onBlur={handleBlur} onFocus={onFocus}>
      <div className={'feedback-container bordered'}>
        <span className={'feedback-header'}>What was the problem?</span>
        {hasOptions
          ? feedbackOptions.map((option, index) => (
              <div
                key={index}
                className={['select-option bordered', option.selected ? 'selected' : ''].join(' ')}
                onClick={() => selectFeedback(index)}
              >
                <div>{option.text}</div>
              </div>
            ))
          : null}

        <textarea
          name={'feedback-text'}
          className={'feedback-text bordered'}
          placeholder={'Leave a comment (optional)'}
        ></textarea>
        <Button className="primary full-width" action={handleSubmit} disabled={!enabledSubmit}>
          <p>Submit feedback</p>
        </Button>
      </div>
    </div>
  )
}

export default FeedbackForm
