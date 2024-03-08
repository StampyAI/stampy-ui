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
  const [selected, setSelected] = React.useState<string>()
  const options = [
    {
      text: 'Making things up',
      option: 'making_things_up',
    },
    {
      text: 'Being mean',
      option: 'being_mean',
    },
    {
      text: 'Typos',
      option: 'typos',
    },
  ]
  const [enabledSubmit, setEnabledSubmit] = React.useState(false)
  const selectFeedback = (option: string) => {
    setSelected(option)

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
    <div key={pageid} className={className} onBlur={handleBlur} onFocus={onFocus}>
      <div className={'col-5 feedback-container bordered'}>
        <span className={'black small'}>What was the problem?</span>
        {hasOptions
          ? options.map((option, index) => (
              <Button
                key={index}
                className={[
                  option.text == selected ? 'secondary-alt selected' : 'secondary',
                  'select-option',
                ].join(' ')}
                action={() => selectFeedback(option.text)}
              >
                <div>{option.text}</div>
              </Button>
            ))
          : null}

        <textarea
          name={'feedback-text'}
          className={['feedback-text bordered', !hasOptions ? 'no-options' : ''].join(' ')}
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
