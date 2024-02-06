import {useEffect, MouseEvent} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldRevalidateFunction, useOutletContext, useLoaderData} from '@remix-run/react'
import {loadInitialQuestions, loadTags} from '~/server-utils/stampy'
import {TOP} from '~/hooks/stateModifiers'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import useDraggable from '~/hooks/useDraggable'
import Search from '~/components/search'
import {Header, Footer} from '~/components/layouts'
import {LINK_WITHOUT_DETAILS_CLS, Question} from '~/routes/questions/$question'
import {Discord} from '~/components/icons-generated'
import ErrorBoundary from '~/components/errorHandling'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import type {Context} from '~/root'

const empty: Awaited<ReturnType<typeof loadInitialQuestions>> = {data: [], timestamp: ''}
export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const showInitialFromUrl = !!request.url.match(/showInitial/)
  const onlyInitialFromUrl = !!request.url.match(/onlyInitial/)
  const embedFromUrl = !!request.url.match(/embed/)
  const queryFromUrl = !!request.url.match(/[?&]q=/)
  const fetchInitial = showInitialFromUrl || onlyInitialFromUrl || (!embedFromUrl && !queryFromUrl)
  if (!fetchInitial) return {initialQuestionsData: empty}

  try {
    await loadTags(request)
    const initialQuestionsData = await loadInitialQuestions(request)
    return {initialQuestionsData}
  } catch (e) {
    console.error(e)
    return {initialQuestionsData: empty}
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export default function App() {
  const {minLogo, embed, showSearch} = useOutletContext<Context>()
  const {initialQuestionsData} = useLoaderData<ReturnType<typeof loader>>()
  const {data: initialQuestions = [], timestamp} = initialQuestionsData ?? {}

  useEffect(() => {
    if (timestamp) {
      reloadInBackgroundIfNeeded('', timestamp)
    }
  }, [timestamp])

  const {
    questions,
    onSiteQuestionsRef: onSiteAnswersRef,
    toggleQuestion,
    onLazyLoadQuestion,
    selectQuestion,
    moveQuestion,
    glossary,
    embedWithoutDetails,
    queryFromUrl,
    limitFromUrl,
    removeQueryFromUrl,
  } = useQuestionStateInUrl(minLogo, initialQuestions)

  const openQuestionTitles = questions
    .filter(({questionState}) => questionState === '_')
    .map(({title}) => title)

  const showMore = (el: HTMLElement, toggle = false) => {
    const button = el.closest('.answer')?.querySelector('.see-more')
    if (toggle) {
      button?.classList.toggle('visible')
    } else {
      button?.classList.add('visible')
    }
    // The AutoHeight component doesn't notice when a random <div> changes CSS class,
    // so manually triggering toggle event (as if this was a <details> element).
    document.dispatchEvent(new Event('toggle'))
  }

  const handleSpecialLinks = (e: MouseEvent) => {
    const el = e.target as HTMLAnchorElement
    if (
      el.tagName !== 'A' ||
      el.closest('.question-footer') ||
      el.classList.contains('footnote-backref') ||
      el.classList.contains(LINK_WITHOUT_DETAILS_CLS)
    )
      return

    if (el.classList.contains('see-more')) {
      showMore(el, true)
      e.preventDefault()
      return
    }
    if (el.parentElement?.classList.contains('footnote-ref')) {
      showMore(el)
      return
    }
  }

  const {handleDragOver, handleDragStart, handleDragEnd, DragPlaceholder} =
    useDraggable(moveQuestion)

  return (
    <>
      <Header />
      <main onClick={handleSpecialLinks}>
        {showSearch && (
          <>
            <Search
              onSiteAnswersRef={onSiteAnswersRef}
              openQuestionTitles={openQuestionTitles}
              onSelect={selectQuestion}
              embedWithoutDetails={embedWithoutDetails}
              queryFromUrl={queryFromUrl}
              limitFromUrl={limitFromUrl}
              removeQueryFromUrl={removeQueryFromUrl}
            />

            {/* Add an extra, draggable div here, so that questions can be moved to the top of the list */}
            <div draggable onDragOver={handleDragOver({pageid: TOP})}>
              &nbsp;
            </div>
            <DragPlaceholder pageid={TOP} />
          </>
        )}
        <div className="articles-container">
          {questions.map((question) => (
            <ErrorBoundary title={question.title} key={question.pageid}>
              <Question
                questionProps={question}
                onLazyLoadQuestion={onLazyLoadQuestion}
                onToggle={toggleQuestion}
                selectQuestion={selectQuestion}
                glossary={glossary}
                onDragStart={handleDragStart(question)}
                onDragEnd={handleDragEnd(question)}
                onDragOver={handleDragOver(question)}
                draggable
                embedWithoutDetails={embedWithoutDetails}
              />
              <DragPlaceholder pageid={question.pageid} />
            </ErrorBoundary>
          ))}
        </div>
      </main>
      {!embed && (
        <>
          <a id="discordChatBtn" href="https://discord.com/invite/Bt8PaRTDQC">
            <Discord />
          </a>
          <Footer />
        </>
      )}
    </>
  )
}
