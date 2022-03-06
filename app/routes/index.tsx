import {useState, useEffect} from 'react'
import {LoaderFunction, useLoaderData} from 'remix'
import AutoHeight from 'react-auto-height'
import {getIntro, getInitialQuestions} from '~/stampy'
import logo1x from '~/assets/stampy-logo.png'
import logo2x from '~/assets/stampy-logo-2x.png'
import logo3x from '~/assets/stampy-logo-3x.png'

type LoaderData = {
  intro: Awaited<ReturnType<typeof getIntro>>
  initialQuestions: Awaited<ReturnType<typeof getInitialQuestions>>
}

export const loader: LoaderFunction = async () => ({
  intro: await getIntro(),
  initialQuestions: await getInitialQuestions(),
})

export default function App() {
  const {intro, initialQuestions} = useLoaderData<LoaderData>()
  const [questions, setQuestions] = useState(initialQuestions)
  useEffect(() => {
    const load = async (question: string) => {
      fetch(`/questions/${encodeURIComponent(question)}`)
        .then((response) => response.json())
        .then((json) => {
          setQuestions((currentQuestions) =>
            currentQuestions.map((q) =>
              q.question === question
                ? {
                    question,
                    ...json,
                  }
                : q
            )
          )
        })
    }
    for (const {question, pageid} of initialQuestions) {
      if (!pageid) setTimeout(() => load(question))
    }
  }, [])

  useRerenderOnResize() // to recalculate AutoHeight

  return (
    <>
      <header>
        <img
          alt="logo"
          width="201"
          height="200"
          src={logo1x}
          srcSet={`${logo2x} 2x, ${logo3x} 3x`}
        />
        <div>
          <h1>Hi, I'm Stampy!</h1>
          <div dangerouslySetInnerHTML={{__html: intro}} />
        </div>
      </header>
      <main>
        {questions.map((props, i) => (
          <Question key={props.question} {...props} defaultExpanded={i === 0} />
        ))}
      </main>
      <footer>
        <span>© 2022 Peter Hozák</span>
        <a href="https://github.com/Aprillion/stampy-ui">GitHub</a>
      </footer>
    </>
  )
}

function Question({
  question,
  title = question,
  text = 'Loading...',
  defaultExpanded,
}: LoaderData['initialQuestions'][0] & {defaultExpanded?: boolean}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <article>
      <h2 className={expanded ? 'expanded' : ''} onClick={() => setExpanded(!expanded)}>
        {title}
      </h2>
      <AutoHeight>
        {expanded && <div className="answer" dangerouslySetInnerHTML={{__html: text}} />}
      </AutoHeight>
    </article>
  )
}

function useRerenderOnResize() {
  const [, set] = useState<{}>()

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const forceRerender = (e: unknown) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        set({})
      }, 100)
    }
    addEventListener('orientationchange', forceRerender)
    addEventListener('resize', forceRerender)

    return () => {
      removeEventListener('orientationchange', forceRerender)
      removeEventListener('resize', forceRerender)
    }
  }, [])
}
