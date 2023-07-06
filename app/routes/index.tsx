import {useEffect, useState, useCallback, MouseEvent, useRef} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {
  ShouldRevalidateFunction,
  useOutletContext,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react'
import {loadInitialQuestions, QuestionState} from '~/server-utils/stampy'
import {TOP} from '~/hooks/stateModifiers'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
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
    return {initialQuestionsData}
  } catch (e) {
    console.error(e)
  }
}

enum LoadMoreType {
  disabled = 'disabled',
  infini = 'infini',
  button = 'button',
  buttonInfini = 'buttonInfini',
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false

const Bottom = ({
  isSingleQuestion,
  fetchMore,
}: {
  isSingleQuestion: boolean
  fetchMore: () => Promise<any>
}) => {
  const [remixSearchParams] = useSearchParams()
  const urlLoadType = useCallback(() => {
    const more = remixSearchParams.get('more')
    if (more) return LoadMoreType[remixSearchParams.get('more') as keyof typeof LoadMoreType]
  }, [remixSearchParams])

  const [loadMore, setLoadMore] = useState(
    urlLoadType() || (isSingleQuestion ? LoadMoreType.disabled : LoadMoreType.buttonInfini)
  )

  useEffect(() => {
    const more = urlLoadType()
    if (more) {
      setLoadMore(more)
    }
  }, [setLoadMore, urlLoadType])

  const buttonHandler = () => {
    fetchMore()
    if (loadMore == LoadMoreType.buttonInfini) {
      setLoadMore(LoadMoreType.infini)
    }
  }

  switch (loadMore) {
    case LoadMoreType.infini:
      return (
        <InfiniteScroll fetchMore={fetchMore}>
          <Footer />
        </InfiniteScroll>
      )
    case LoadMoreType.button:
    case LoadMoreType.buttonInfini:
      return (
        <>
          <div>
            <br />
            <button className="result-item-box" onClick={buttonHandler}>
              Show me even more more questions about AI Safety...
            </button>
          </div>
          <Footer />
        </>
      )
    case LoadMoreType.disabled:
    default:
      return <Footer />
  }
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
    onSiteQuestionsRef: onSiteAnswersRef,
    reset,
    toggleQuestion,
    onLazyLoadQuestion,
    selectQuestion,
    addQuestions,
    moveQuestion,
    glossary,
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
    dispatchEvent(new Event('toggle'))
  }

  const handleSpecialLinks = (e: MouseEvent) => {
    const el = e.target as HTMLAnchorElement
    if (
      el.tagName !== 'A' ||
      el.closest('.question-footer') ||
      el.classList.contains('footnote-backref')
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

    const url = new URL(el.href)
    if (url.hostname === window.location.hostname) {
      e.preventDefault()
      const state = new URLSearchParams(url.search).get('state')
      if (state) selectQuestion(getStateEntries(state)[0][0], '')
    }
  }

  const nextPageLinkRef = useRef<null | string>(null)
  const fetchMoreQuestions = async () => {
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

      <Bottom
        fetchMore={fetchMoreQuestions}
        isSingleQuestion={
          questions.filter((i) => i.questionState != QuestionState.RELATED).length == 1
        }
      />
    </>
  )
}
