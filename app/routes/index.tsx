import {useState} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import type {ShouldReloadFunction} from '@remix-run/react'
import {useLoaderData, Link} from '@remix-run/react'
import copy from 'copy-to-clipboard'

import type {Question as QuestionType} from '~/stampy'
import {getIntro, getInitialQuestions} from '~/stampy'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import useRerenderOnResize from '~/hooks/useRerenderOnResize'
import Search from '~/components/search'
import Question from '~/components/question'
import logoSvg from '~/assets/stampy-logo.svg'
import iconShare from '~/assets/icons/share-nodes.svg'
import iconCode from '~/assets/icons/code.svg'
import iconUsers from '~/assets/icons/users.svg'

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

  const [copied, setCopied] = useState(false)
  const shareLink = () => {
    copy(location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <>
      <header>
        <Link to="/" onClick={(e) => reset(e)}>
          <img className="logo simplified-logo" alt="logo" width="150" height="129" src={logoSvg} />
        </Link>
        <div className="intro">
          <h1>
            Hi, I'm <span className="highlight">Stampy!</span>
            <br />
            (in test environment)
          </h1>
          <div dangerouslySetInnerHTML={{__html: intro}} />
        </div>
        <div className="icon-links">
          <button
            className={`transparent-button share ${copied ? 'copied' : ''}`}
            onClick={shareLink}
          >
            <img alt="" src={iconShare} />
            Share link
          </button>
          <a href="https://github.com/Aprillion/stampy-ui">
            <img alt="" src={iconCode} />
            Code
          </a>
          <a href="https://stampy.ai/wiki/Get_involved">
            <img alt="" src={iconUsers} />
            Get involved
          </a>
        </div>
      </header>
      <main>
        <Search />
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
        <a href="https://stampy.ai/wiki/Meta:Contact">Contact</a>
        <a href="https://stampy.ai/wiki/Stampy">About</a>
        <a href="https://github.com/Aprillion/stampy-ui">Code</a>
        <a href="https://stampy.ai/wiki/Get_involved">Get Involved</a>
        <a href="https://stampy.ai/wiki/Discord_invite">Discord</a>
        <a href="https://stampy.ai/wiki/Meta:Copyrights">Copyrights</a>
      </footer>
    </>
  )
}
