import type {LoaderFunction, ShouldReloadFunction} from 'remix'
import {useLoaderData, Link} from 'remix'
import type {Question as QuestionType} from '~/stampy'
import {getIntro, getInitialQuestions} from '~/stampy'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import useRerenderOnResize from '~/hooks/useRerenderOnResize'
import Question from '~/components/question'
import logoSvg from '~/assets/stampy-logo.svg'
import logo1x from '~/assets/stampy-logo.png'
import logo2x from '~/assets/stampy-logo-2x.png'
import logo3x from '~/assets/stampy-logo-3x.png'

type LoaderData = {
  intro: string
  initialQuestions: QuestionType[]
}

export const loader: LoaderFunction = async ({request}): Promise<LoaderData> => {
  return {
    intro: await getIntro(),
    initialQuestions: await getInitialQuestions(request),
  }
}

export const unstable_shouldReload: ShouldReloadFunction = () => false

export default function App() {
  const {intro, initialQuestions} = useLoaderData<LoaderData>()
  const {questions, reset, toggleQuestion, onLazyLoadQuestion} =
    useQuestionStateInUrl(initialQuestions)

  useRerenderOnResize() // recalculate AutoHeight

  return (
    <>
      <header>
        <Link to="/" onClick={(e) => reset(e)}>
          <img className="logo simplified-logo" alt="logo" width="150" height="129" src={logoSvg} />
          <img
            className="logo dark-logo"
            alt="logo"
            width="201"
            height="200"
            src={logo1x}
            srcSet={`${logo2x} 2x, ${logo3x} 3x`}
          />
        </Link>
        <div>
          <h1>
            Hi, I'm <span className="highlight">Stampy!</span> (in test environment)
          </h1>
          <div dangerouslySetInnerHTML={{__html: intro}} />
        </div>
      </header>
      <main>
        {questions.map((questionProps) => (
          <Question
            key={questionProps.pageid}
            {...questionProps}
            onLazyLoadQuestion={onLazyLoadQuestion}
            onToggle={() => toggleQuestion(questionProps)}
          />
        ))}
      </main>
      <footer>
        <span>© 2022 Peter Hozák</span>
        <a href="https://github.com/Aprillion/stampy-ui">GitHub</a>
      </footer>
    </>
  )
}
