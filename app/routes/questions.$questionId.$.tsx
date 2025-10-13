import {Suspense, useEffect, useState} from 'react'
import {useLocation, useSearchParams} from 'react-router-dom'
import {Await, useLoaderData, useParams} from '@remix-run/react'
import {defer, redirect, type LoaderFunctionArgs} from '@remix-run/cloudflare'
import Page from '~/components/Page'
import Article from '~/components/Article'
import Button from '~/components/Button'
import Error from '~/components/Error'
import XIcon from '~/components/icons-generated/X'
import ChevronRight from '~/components/icons-generated/ChevronRight'
import {ArticlesNav} from '~/components/ArticlesNav/ArticleNav'
import {
  QuestionStatus,
  loadQuestionDetail,
  loadRedirects,
  cleanRedirectPath,
} from '~/server-utils/stampy'
import useToC from '~/hooks/useToC'
import useGlossary from '~/hooks/useGlossary'
import {useTags} from '~/hooks/useCachedObjects'
import type {Question, Tag} from '~/server-utils/stampy'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {ArticlesNavManualList} from '~/components/ArticlesNav/ArticleNavManualList'

export const LINK_WITHOUT_DETAILS_CLS = 'link-without-details'

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const {data: redirects} = await loadRedirects(request)

  // Check if we need to redirect to a new path
  const path = new URL(request.url).pathname
  const cleanedPath = cleanRedirectPath(path)
  const to = redirects[cleanedPath]
  if (to) {
    return redirect(to)
  }

  // Otherwise, load the question
  const {questionId} = params
  if (!questionId) {
    throw new Response('Missing question title', {status: 400})
  }

  const dataPromise = loadQuestionDetail(request, questionId).catch((error: Error) => {
    console.error(error)
    const msg = `No question found with ID ${questionId}. Please go to <a href="https://discord.com/invite/Bt8PaRTDQC">Discord</a> and report where you found this link.`
    // inside deferred Promise on the client, not executed on server => don't create new Response
    return {error: msg}
  })
  return defer({question: dataPromise})
}

const dummyQuestion = (title: string | undefined) =>
  ({
    text: 'Loading...',
    title: title ?? 'Loading...',
    pageid: '',
    markdown: null,
    answerEditLink: null,
    relatedQuestions: [],
    tags: [],
    banners: [],
    ttr: 0,
  }) as Question

const updateTags = (question: Question, tags?: Tag[]) => {
  const mappedTags = tags?.reduce((acc, t) => ({...acc, [t.name]: t}), {}) || {}
  return {
    ...question,
    tags: question.tags
      ?.map((name) => mappedTags[name as keyof typeof mappedTags])
      .filter((t?: Tag) => t && !t?.internal)
      .map(({name}) => name),
  }
}

const updateBanners = (question: Question, hideBanners?: boolean) =>
  hideBanners ? {...question, banners: []} : question

const updateFields = (question: Question, hideBanners?: boolean, tags?: Tag[]) =>
  updateTags(updateBanners(question, hideBanners), tags)

export default function RenderArticle() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [showNav, setShowNav] = useState(false) // Used on mobile
  const params = useParams()
  const {items: tags} = useTags()
  const glossary = useGlossary()
  const pageid = params.questionId ?? '😱'
  const {question} = useLoaderData<typeof loader>()
  const {toc, findSection, getArticle, getPath} = useToC()
  const section = findSection(location?.state?.section || pageid)
  const hideBannersIfSubsection = section?.children?.some((c) => c.pageid === pageid)
  const manualListOfIds = searchParams.get('list')?.split(',')

  useEffect(() => {
    setShowNav(false)
  }, [location.key])

  useEffect(() => {
    question.then((val) => {
      const {data, timestamp} = val as {data: Question; timestamp: string}
      reloadInBackgroundIfNeeded(location.pathname, timestamp)
      if (data.title) document.title = data.title
    })
  }, [question, location])

  return (
    <Page modal={showNav}>
      <div className={`article-container ${showNav ? 'no-padding' : ''}`}>
        {showNav ? (
          <div className="horizontally-centered">
            <div className="padding-bottom-24" />
            <XIcon
              width="24"
              height="24"
              viewBox="0 0 16 16"
              className="pointer"
              onClick={() => setShowNav(false)}
            />
          </div>
        ) : (
          section && (
            <Button
              className="mobile-only article-selector large-reading black"
              action={() => setShowNav(true)}
            >
              {getArticle(pageid)?.title}
              <ChevronRight className="dropdown-icon active" />
            </Button>
          )
        )}

        {manualListOfIds ? (
          <ArticlesNavManualList
            listOfIds={manualListOfIds}
            current={pageid}
            className={!showNav ? 'desktop-only bordered' : ''}
          />
        ) : (
          <ArticlesNav
            tocLoaded={toc.length > 0}
            article={section}
            path={getPath(pageid, section?.pageid)}
            className={!showNav ? 'desktop-only bordered' : ''}
          />
        )}

        <Suspense
          key={pageid}
          fallback={
            <Article
              question={
                'data' in question
                  ? (question.data as Question)
                  : dummyQuestion(getArticle(pageid)?.title)
              }
              className={showNav ? 'desktop-only' : ''}
            />
          }
        >
          <Await resolve={question}>
            {(resolvedQuestion) => {
              if ('error' in resolvedQuestion) {
                return <div dangerouslySetInnerHTML={{__html: resolvedQuestion.error as string}} />
              } else if (!resolvedQuestion.data.pageid) {
                return (
                  <Error error={{statusText: 'Could not fetch question', status: 'emptyArticle'}} />
                )
              } else if (resolvedQuestion.data.status === QuestionStatus.TO_DELETE) {
                return <Error error={{statusText: 'Deleted article', status: 'deletedArticle'}} />
              } else {
                return (
                  <Article
                    question={updateFields(
                      resolvedQuestion.data as Question,
                      hideBannersIfSubsection,
                      tags
                    )}
                    glossary={glossary}
                    className={showNav ? 'desktop-only' : ''}
                    showNext={!manualListOfIds}
                  />
                )
              }
            }}
          </Await>
        </Suspense>
      </div>
    </Page>
  )
}
