import {useState} from 'react'
import {Link} from '@remix-run/react'
import StampyIcon from '~/components/icons-generated/Stampy'
import SendIcon from '~/components/icons-generated/PlaneSend'
import Button from '~/components/Button'
import './widgit.css'

export const WidgetStampy = () => {
  const [question, setQuestion] = useState('')
  const questions = [
    'Why couldn’t we just turn the AI off?',
    'How would the AI even get out in the world?',
    'Do people seriously worry about existential risk from AI?',
  ]

  const stampyUrl = (question: string) => `https://chat.aisafety.info/?question=${question.trim()}`
  return (
    <div className="centered col-9 padding-bottom-128">
      <div className="col-6 padding-bottom-56">
        <h2 className="teal-500">Questions?</h2>
        <h2>Ask Stampy, our chatbot, any question about AI safety</h2>
      </div>

      <div className="sample-messages-container padding-bottom-24">
        <StampyIcon />
        <div className="sample-messages rounded">
          <div className="padding-bottom-24">Try asking me...</div>
          {questions.map((question, i) => (
            <div key={i} className="padding-bottom-16">
              <Button className="secondary-alt" action={stampyUrl(question)}>
                {question}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="widget-ask">
        <input
          type="text"
          className="full-width bordered secondary"
          placeholder="Ask Stampy a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && question.trim()) {
              window.location = stampyUrl(question) as any
            }
          }}
        />
        <Link to={stampyUrl(question)}>
          <SendIcon />
        </Link>
      </div>
    </div>
  )
}
