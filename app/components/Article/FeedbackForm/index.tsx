import React from 'react'
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
}
const FeedbackForm = ({pageid, className = 'feedback-form'}: FeedbackFormProps) => {
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
  const selectFeedback = (option:number) => {
    setFeedbackOptions(
      feedbackOptions.map((feedback, index) => {
        if (index === option) {
          return {...feedback, selected: !feedback.selected}
        }
        return {...feedback, selected: false}
      })
    )
    setEnabledSubmit(true)
  }

  return (
    <div className={className}>
      <div className={'feedback-container'}>
        <span className={'feedback-header'}>What was the problem?</span>
        {feedbackOptions.map((option, index) => (
          <div
            key={index}
            className={['select-option', option.selected ? 'selected' : ''].join(' ')}
            onClick={() => selectFeedback(index)}
          >
            <div className={'small'}>{option.text}</div>
          </div>
        ))}
        <textarea
          name={'feedback-text'}
          className={'feedback-text'}
          placeholder={'Leave a comment (optional)'}
        ></textarea>
        <div className={['submit-feedback', enabledSubmit ? 'enabled' : ''].join(' ')}>
          <div className={'small3'}>Submit feedback</div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm
