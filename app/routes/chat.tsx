import {ShouldRevalidateFunction} from '@remix-run/react'
import Page from '~/components/Page'
import Chatbot from '~/components/Chatbot'

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export default function App() {
  return (
    <Page>
      <div className="page-body">
        <Chatbot
          questions={[
            'Why couldn’t we just turn the AI off?',
            'How would the AI even get out in the world?',
            'Do people seriously worry about existential risk from AI?',
          ]}
        />
      </div>
    </Page>
  )
}
