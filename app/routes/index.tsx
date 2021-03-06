import {useState} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import type {ShouldReloadFunction} from '@remix-run/react'
import {useLoaderData, Link} from '@remix-run/react'
import copy from 'copy-to-clipboard'

import type {Question as QuestionType} from '~/stampy'
import {getInitialQuestions} from '~/stampy'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import useRerenderOnResize from '~/hooks/useRerenderOnResize'
import Search from '~/components/search'
import Question from '~/components/question'
import logoSvg from '~/assets/stampy-logo.svg'

import {Share, Users, Code} from '~/components/icons-generated'

type LoaderData = {
  initialQuestions: QuestionType[]
}

export const loader: LoaderFunction = async ({request}): Promise<LoaderData> => {
  let initialQuestions: QuestionType[] = []
  try {
    initialQuestions = await getInitialQuestions(request)
  } catch (e) {
    console.error(e)
  }
  return {
    initialQuestions,
  }
}

export const unstable_shouldReload: ShouldReloadFunction = () => false

export default function App() {
  const {initialQuestions} = useLoaderData<LoaderData>()
  const {
    questions,
    canonicallyAnsweredQuestion,
    reset,
    toggleQuestion,
    onLazyLoadQuestion,
    selectQuestionByTitle,
  } = useQuestionStateInUrl(initialQuestions)

  useRerenderOnResize() // recalculate AutoHeight

  const [copied, setCopied] = useState(false)
  const shareLink = () => {
    copy(location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const openQuestionTitles = questions
    .filter(({questionState}) => questionState === '_')
    .map(({title}) => title)

  return (
    <>
      <header>
        <div className="logo-intro-group">
          <Link to="/" onClick={(e) => reset(e)}>
            <img className="logo simplified-logo" alt="logo" src={logoSvg} />
          </Link>
          <div className="intro">
            <h1>
              Welcome to <span className="highlight">stampy.ai</span>!
            </h1>
            I can answer questions about{' '}
            <a href="https://en.wikipedia.org/wiki/Existential_risk_from_artificial_general_intelligence">
              artificial general intelligence safety
            </a>
          </div>
        </div>
        <div className="icon-link-group">
          <button
            className={`icon-link transparent-button share ${copied ? 'copied' : ''}`}
            onClick={shareLink}
          >
            <Share />
            Share link
          </button>
          <a href="https://stampy.ai/wiki/Get_involved" className="icon-link">
            <Users />
            Get Involved
          </a>
          <a href="https://github.com/StampyAI/stampy-ui" className="icon-link">
            <Code />
            Help Code
          </a>
        </div>
      </header>
      <main>
        <Search
          canonicalQuestionTitles={canonicallyAnsweredQuestion}
          openQuestionTitles={openQuestionTitles}
          onSelect={selectQuestionByTitle}
        />
        {questions.map((questionProps) => (
          <Question
            key={questionProps.pageid}
            questionProps={questionProps}
            onLazyLoadQuestion={onLazyLoadQuestion}
            onToggle={toggleQuestion}
          />
        ))}
      </main>
      <footer>
        <a href="https://stampy.ai/wiki/Stampy">About</a>
        <a href="https://stampy.ai/wiki/Get_involved">Get Involved</a>
        <a href="https://github.com/StampyAI/stampy-ui">Help Code</a>
        <a href="https://stampy.ai/wiki/Discord_invite">Join Discord</a>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdT--8lx5F2pAZoRPPkDusA7vUTvKTVnNiAb9U5cqnohDhzHA/viewform">
          Feedback
        </a>
        <a href="https://stampy.ai/wiki/Meta:Copyrights">@ 2022 stampy.ai</a>
      </footer>
    </>
  )
}
