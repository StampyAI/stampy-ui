import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldReloadFunction, useOutletContext} from '@remix-run/react'
import {useLoaderData, Link} from '@remix-run/react'
import {loadInitialQuestions} from '~/server-utils/stampy'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import useRerenderOnResize from '~/hooks/useRerenderOnResize'
import Search from '~/components/search'
import {Question} from '~/routes/questions/$question'
import logoFunSvg from '~/assets/stampy-logo.svg'
import logoMinSvg from '~/assets/stampy-logo-min.svg'
import {Share, Users, Code} from '~/components/icons-generated'
import CopyLink from '~/components/copyLink'
import {useEffect, MouseEvent} from 'react'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  let initialQuestionsData
  try {
    initialQuestionsData = await loadInitialQuestions(request)
  } catch (e) {
    console.error(e)
  }
  return {
    initialQuestionsData,
  }
}

export const unstable_shouldReload: ShouldReloadFunction = () => false

export default function App() {
  const minLogo = useOutletContext<boolean>()
  const {initialQuestionsData} = useLoaderData<ReturnType<typeof loader>>()
  const {data: initialQuestions = [], timestamp} = initialQuestionsData ?? {}

  useEffect(() => {
    if (timestamp) {
      reloadInBackgroundIfNeeded('', timestamp)
    }
  }, [timestamp])

  const {
    questions,
    onSiteAnswersRef,
    onSiteGDocLinkMapRef,
    reset,
    toggleQuestion,
    onLazyLoadQuestion,
    selectQuestion,
  } = useQuestionStateInUrl(minLogo, initialQuestions)

  useRerenderOnResize() // recalculate AutoHeight

  const openQuestionTitles = questions
    .filter(({questionState}) => questionState === '_')
    .map(({title}) => title)

  const handleSpecialLinks = (e: MouseEvent) => {
    const el = e.target as HTMLAnchorElement
    if (el.tagName !== 'A') return

    const href = el.href.replace(/\?.*$/, '')
    const found = onSiteGDocLinkMapRef.current[href]
    if (found) {
      e.preventDefault()
      selectQuestion(found.pageid, found.title)
    }
  }

  return (
    <>
      <header className={minLogo ? 'min-logo' : 'fun-logo'}>
        {minLogo ? (
          <div className="logo-intro-group">
            <Link to="/" onClick={(e) => reset(e)}>
              <img className="logo" alt="logo" src={logoMinSvg} />
            </Link>
            <div className="intro">
              Answering questions about
              <h1>AI Safety</h1>
            </div>
          </div>
        ) : (
          <div className="logo-intro-group">
            <Link to="/" onClick={(e) => reset(e)}>
              <img className="logo" alt="logo" src={logoFunSvg} />
            </Link>
            <div className="intro">
              <h1>
                Welcome to <span className="highlight">stampy.ai</span>!
              </h1>
              I can answer questions about artificial general intelligence safety
            </div>
          </div>
        )}
        <div className="icon-link-group">
          <CopyLink>
            <Share />
            Share link
          </CopyLink>
          <a href="https://get_involved.aisafety.info" className="icon-link">
            <Users />
            Get Involved
          </a>
          <a href="https://github.com/StampyAI/stampy-ui" className="icon-link">
            <Code />
            Help Code
          </a>
        </div>
      </header>
      <main onClick={handleSpecialLinks}>
        <Search
          onSiteAnswersRef={onSiteAnswersRef}
          openQuestionTitles={openQuestionTitles}
          onSelect={selectQuestion}
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
        <a href="https://discord.gg/vjFSCDyMCy">Join Discord</a>
        <a href="https://all.aisafety.info/">All answers</a>
        <a href="https://get_involved.aisafety.info">About / Get Involved</a>
        <a href="https://dashboard.aisafety.info">Dashboard</a>
        <a href="https://github.com/StampyAI/stampy-ui">Help Code</a>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdT--8lx5F2pAZoRPPkDusA7vUTvKTVnNiAb9U5cqnohDhzHA/viewform">
          Feedback
        </a>
        <a href="https://coda.io/d/AI-Safety-Info-Dashboard_dfau7sl2hmG/Copyright_su79L#_luPMa">
          @ 2022 stampy.ai
        </a>
      </footer>
    </>
  )
}
