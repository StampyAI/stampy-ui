import {useState} from 'react'
import type {LoaderFunction, ShouldReloadFunction} from 'remix'
import {useLoaderData, Link} from 'remix'
import type {Questions} from '~/utils/stampy'
import {getIntro, getInitialQuestions} from '~/utils/stampy'
import {useQuestionStateInUrl as useQuestionStateFromUrl, useRerenderOnResize} from '~/utils/hooks'
import Question from '~/components/question'
import logoSvg from '~/assets/stampy-logo.svg'
import logo1x from '~/assets/stampy-logo.png'
import logo2x from '~/assets/stampy-logo-2x.png'
import logo3x from '~/assets/stampy-logo-3x.png'

type LoaderData = {
  intro: string
  initialQuestions: Questions
}

export const loader: LoaderFunction = async ({request}): Promise<LoaderData> => ({
  intro: await getIntro(),
  initialQuestions: await getInitialQuestions(),
})

export const unstable_shouldReload: ShouldReloadFunction = () => false

export default function App() {
  const {intro, initialQuestions} = useLoaderData<LoaderData>()
  const questions = initialQuestions // TODO: load related questions when expanding
  const {isExpanded, toggleQuestion} = useQuestionStateFromUrl(questions)

  useRerenderOnResize() // recalculate AutoHeight

  return (
    <>
      <header>
        <Link to="/" onClick={(e) => toggleQuestion(null, e)}>
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
            Hi, I'm <span className="highlight">Stampy!</span>
          </h1>
          <div dangerouslySetInnerHTML={{__html: intro}} />
        </div>
      </header>
      <main>
        {questions.map(({pageid, title, text}) => (
          <Question
            key={pageid}
            pageid={pageid}
            title={title}
            text={text}
            expanded={isExpanded(pageid)}
            onToggle={() => toggleQuestion(pageid)}
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
