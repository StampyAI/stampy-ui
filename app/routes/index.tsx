import {useEffect, MouseEvent, useRef} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldReloadFunction, useOutletContext, useLoaderData} from '@remix-run/react'
import {loadInitialQuestions, loadGlossary, QuestionState} from '~/server-utils/stampy'
import {TOP} from '~/hooks/stateModifiers'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import useRerenderOnResize from '~/hooks/useRerenderOnResize'
import useDraggable from '~/hooks/useDraggable'
import {getStateEntries} from '~/hooks/stateModifiers'
import Search from '~/components/search'
import {Header, Footer} from '~/components/layouts'
import {Question} from '~/routes/questions/$question'
import {fetchAnswerDetailsOnSite} from '~/routes/questions/answerDetailsOnSite'
import {Discord} from '~/components/icons-generated'
import InfiniteScroll from '~/components/infiniteScroll'
import ErrorBoundary from '~/components/errorHandling'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  try {
    const initialQuestionsData = await loadInitialQuestions(request)
    const glossaryData = await loadGlossary(request)
    return {initialQuestionsData, glossaryData}
  } catch (e) {
    console.error(e)
  }
}

export const unstable_shouldReload: ShouldReloadFunction = () => false

export default function App() {
  const minLogo = useOutletContext<boolean>()
  const {initialQuestionsData, glossaryData} = useLoaderData<ReturnType<typeof loader>>()
  const {data: initialQuestions = [], timestamp} = initialQuestionsData ?? {}
  const {data: glossary = {}} = glossaryData ?? {}

  useEffect(() => {
    if (timestamp) {
      reloadInBackgroundIfNeeded('', timestamp)
    }
  }, [timestamp])

  const {
    questions,
    onSiteAnswersRef,
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

  const showMore = (el: HTMLElement) => {
    const container = el.closest('.react-auto-height') as HTMLElement
    const button = container.getElementsByClassName('see-more')[0]
    button.classList.toggle('visible')
    container.style.removeProperty('height')
  }

  const handleSpecialLinks = (e: MouseEvent) => {
    const el = e.target as HTMLAnchorElement
    if (el.tagName !== 'A' || el.closest('.question-footer')) return

    // The AutoHeight component doesn't notice when a HTML details is opened.
    // Manually removing the height from the style fixes this, but can potentially
    // break something else...
    if (el.classList.contains('see-more')) {
      showMore(el)
      e.preventDefault()
      return
    }
    if (el.parentElement?.classList.contains('footnote-ref')) {
      showMore(el)
      return
    }

    const url = new URL(el.href)
    if (url.hostname === window.location.hostname) {
      e.preventDefault()
      const state = new URLSearchParams(url.search).get('state')
      if (state) selectQuestion(getStateEntries(state)[0][0], '')
    }
  }

  const useInfiniscroll =
    questions.filter((i) => i.questionState != QuestionState.RELATED).length != 1
  const nextPageLinkRef = useRef<null | string>(null)
  const fetchMoreQuestions = async () => {
    if (!useInfiniscroll) return null

    const result = await fetchAnswerDetailsOnSite(nextPageLinkRef.current)
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
                glossary={glossary}
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
        <Footer />
      </InfiniteScroll>
    </>
  )
}
