import {useEffect, MouseEvent, useRef} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldReloadFunction, useOutletContext, useLoaderData, Link} from '@remix-run/react'
import {loadInitialQuestions} from '~/server-utils/stampy'
import {TOP} from '~/hooks/stateModifiers'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import useRerenderOnResize from '~/hooks/useRerenderOnResize'
import useDraggable from '~/hooks/useDraggable'
import Search from '~/components/search'
import {Question} from '~/routes/questions/$question'
import {fetchOnSiteAnswers} from '~/routes/questions/allOnSite'
import logoFunSvg from '~/assets/stampy-logo.svg'
import logoMinSvg from '~/assets/stampy-logo-min.svg'
import {Share, Users, Code, Discord} from '~/components/icons-generated'
import CopyLink from '~/components/copyLink'
import InfiniteScroll from '~/components/infiniteScroll'
import ErrorBoundary from '~/components/errorHandling'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  try {
    const initialQuestionsData = await loadInitialQuestions(request)
    return {initialQuestionsData}
  } catch (e) {
    console.error(e)
  }
}

export const unstable_shouldReload: ShouldReloadFunction = () => false

const year = new Date().getFullYear()

const Header = ({reset}: {reset: (e: MouseEvent) => void}) => {
  const minLogo = useOutletContext<boolean>()

  return (
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
  )
}

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
    addQuestions,
    moveQuestion,
  } = useQuestionStateInUrl(minLogo, initialQuestions)

  useRerenderOnResize() // recalculate AutoHeight

  const openQuestionTitles = questions
    .filter(({questionState}) => questionState === '_')
    .map(({title}) => title)

  const handleSpecialLinks = (e: MouseEvent) => {
    const el = e.target as HTMLAnchorElement
    if (el.tagName !== 'A' || el.closest('.question-footer')) return

    // The AutoHeight component doesn't notice when a HTML details is opened.
    // Manually removing the height from the style fixes this, but can potentially
    // break something else...
    if (el.classList.contains('see-more')) {
      el.classList.toggle('visible')
      const container = el.closest('.react-auto-height') as HTMLElement
      container.style.removeProperty('height')

      e.preventDefault()
      return
    }

    const href = el.href.replace(/\?.*$/, '')
    const found = onSiteGDocLinkMapRef.current[href]
    if (found) {
      e.preventDefault()
      selectQuestion(found.pageid, found.title)
    }
  }

  const nextPageLinkRef = useRef<null | string>(null)
  const fetchMoreQuestions = async () => {
    const result = await fetchOnSiteAnswers(nextPageLinkRef.current)
    nextPageLinkRef.current = result.nextPageLink
    if (result.questions) {
      addQuestions(result.questions)
    }
    return result.nextPageLink
  }

  const {handleDragOver, handleDragStart, handleDragEnd, DragPlaceholder} =
    useDraggable(moveQuestion)

  return (
    <>
      <Header reset={reset} />
      <main onClick={handleSpecialLinks}>
        <Search
          onSiteAnswersRef={onSiteAnswersRef}
          openQuestionTitles={openQuestionTitles}
          onSelect={selectQuestion}
        />

        {/* Add an extra, draggable div here, so that questions can be moved to the top of the list */}
        <div draggable onDragOver={handleDragOver({pageid: TOP})}>
          &nbsp;
        </div>
        <DragPlaceholder pageid={TOP} />
        <div className="articles-container">
          {questions.map((question) => (
            <ErrorBoundary title={question.title} key={question.pageid}>
              <Question
                questionProps={question}
                onLazyLoadQuestion={onLazyLoadQuestion}
                onToggle={toggleQuestion}
                selectQuestion={selectQuestion}
                onDragStart={handleDragStart(question)}
                onDragEnd={handleDragEnd(question)}
                onDragOver={handleDragOver(question)}
                draggable
              />
              <DragPlaceholder pageid={question.pageid} />
            </ErrorBoundary>
          ))}
        </div>
      </main>
      <a id="discordChatBtn" href="https://discord.com/invite/Bt8PaRTDQC">
        <Discord />
      </a>

      <InfiniteScroll fetchMore={fetchMoreQuestions}>
        <footer>
          <a href="https://coda.io/d/AI-Safety-Info-Dashboard_dfau7sl2hmG/Copyright_su79L#_luPMa">
            © stampy.ai, 2022 - {year}
          </a>
        </footer>
      </InfiniteScroll>
    </>
  )
}
