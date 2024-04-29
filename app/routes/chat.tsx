import {ShouldRevalidateFunction, useSearchParams} from '@remix-run/react'
import Page from '~/components/Page'
import Chatbot from '~/components/Chatbot'

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export default function App() {
  const [params] = useSearchParams()
  const question = params.get('question') || undefined

  return (
    <Page noFooter>
      <div className="page-body">
        <Chatbot
          question={question}
          questions={[
            'What is AI Safety?',
            'How would the AI even get out in the world?',
            'Do people seriously worry about existential risk from AI?',
          ]}
        />
      </div>
    </Page>
  )
}
