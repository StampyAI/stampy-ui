import {useEffect} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {useOutletContext, useLoaderData} from '@remix-run/react'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadAllQuestions, QuestionState, QuestionStatus} from '~/server-utils/stampy'
import {Header, Footer} from '~/components/layouts'
import {Question} from '~/routes/questions/$question'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import type {Context} from '~/root'

function randomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  try {
    const {data} = await loadAllQuestions(request)
    return {
      ...randomItem(data.filter((q) => q.status == QuestionStatus.LIVE_ON_SITE)),
      questionState: QuestionState.OPEN,
    }
  } catch (e) {
    console.error(e)
  }
}

export default function App() {
  const {minLogo} = useOutletContext<Context>()
  const {initialQuestionsData} = useLoaderData<ReturnType<typeof loader>>()
  const {data: initialQuestions = [], timestamp} = initialQuestionsData ?? {}

  useEffect(() => {
    if (timestamp) {
      reloadInBackgroundIfNeeded('', timestamp)
    }
  }, [timestamp])

  const {toggleQuestion, onLazyLoadQuestion, selectQuestion, glossary} = useQuestionStateInUrl(
    minLogo,
    initialQuestions
  )

  const question = useLoaderData<ReturnType<typeof loader>>()

  return (
    <>
      <Header />
      <main>
        <Question
          questionProps={question}
          onLazyLoadQuestion={onLazyLoadQuestion}
          onToggle={toggleQuestion}
          selectQuestion={selectQuestion}
          glossary={glossary}
        />
      </main>

      <Footer />
    </>
  )
}
