import {useEffect, MouseEvent} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldRevalidateFunction, useOutletContext, useLoaderData} from '@remix-run/react'
import {loadInitialQuestions, loadTags} from '~/server-utils/stampy'
import {TOP} from '~/hooks/stateModifiers'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import useDraggable from '~/hooks/useDraggable'
import Search from '~/components/search'
import {Header, Footer} from '~/components/layouts'
import {LINK_WITHOUT_DETAILS_CLS, Question} from '~/routes/questions.$question'
import {Discord} from '~/components/icons-generated'
import ErrorBoundary from '~/components/errorHandling'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import type {Context} from '~/root'
import {PageHeaderText} from '~/components/PageHeader'
import {ContentBoxMain} from '~/components/ContentBoxMain'
import {ContentBoxSecond} from '~/components/ContentBoxSecond'
import {ContentBoxThird} from '~/components/ContentBoxThird'
import {WidgetStampy} from '~/components/WidgetStampy'
import {PageSubheaderText} from '~/components/PageSubHeader'
import {GridSystem} from '~/components/GridSystem'

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
      <div className={'page-body'}>
        <PageHeaderText
          children={
            <>
              <p>Educational content</p>
              <p>on all things AI Safety</p>
            </>
          }
        />
        <ContentBoxMain />
        <ContentBoxSecond
          Elements={{
            'What are the main sources of AI existential risk?':
              '/what-are-the-main-sources-of-ai-existential-risk',
            'Do people seriously worry about existential risk from AI?':
              '/do-people-seriously-worry-about-existential-risk-from-ai',
            'Why would an AI do bad things?': '/why-would-an-ai-do-bad-things',
          }}
        />
        <ContentBoxThird />
        <WidgetStampy />
        <div className={'top-margin-large'} />
        <PageSubheaderText text={'Advanced Content'} />
        <GridSystem
          GridBoxes={[
            {
              title: 'Technical alignment research categories',
              description: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9769202bfb08a9b87ab3d7e55cff70586447e8f76a8c076fff6f0d4e8902c5da?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              url: 'https://google.com',
            },
            {
              title: 'Governance',
              description: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7b7d22b33dd958b157082b2ca8a77eef6ad552d10764d38f8035285bc1f7be11?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              url: 'https://google.com',
            },
            {
              title: 'Existential risk concepts',
              description: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/11cfe00a2459aad8521abe570fe704c47a982a1d7686ea916cc318010eaa7a32?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              url: 'https://google.com',
            },
            {
              title: 'Predictions on advanced AI',
              description: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/fd10e7106c3d8988b4046afc200b9224122ac8051c52aae1ce0debcf3f04f3cd?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              url: 'https://google.com',
            },
            {
              title: 'Prominent research organizations',
              description: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0de85958d44d9176c2dd4eb584ec22c23e7200150932ebc110a86bdf52f595d9?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              url: 'https://google.com',
            },
          ]}
        />

        {!embed && (
          <>
            <div className={'top-margin-large-with-border'} />

            <div className={'top-margin-large'} />
            <Footer />
          </>
        )}
      </div>
    </>
  )
}
