import {Suspense, useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {Await, useLoaderData, useParams} from '@remix-run/react'
import {defer, type LoaderFunctionArgs} from '@remix-run/cloudflare'
import Page from '~/components/Page'
import Article from '~/components/Article'
import Button from '~/components/Button'
import Error from '~/components/Error'
import XIcon from '~/components/icons-generated/X'
import ChevronRight from '~/components/icons-generated/ChevronRight'
import {ArticlesNav} from '~/components/ArticlesNav/ArticleNav'
import {QuestionStatus, loadQuestionDetail} from '~/server-utils/stampy'
import useToC from '~/hooks/useToC'
import useGlossary from '~/hooks/useGlossary'
import useOnSiteQuestions from '~/hooks/useOnSiteQuestions'
import {useTags} from '~/hooks/useCachedObjects'
import type {Question, Tag} from '~/server-utils/stampy'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const LINK_WITHOUT_DETAILS_CLS = 'link-without-details'

const raise500 = (error: Error) => new Response(error.toString(), {status: 500})

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const {questionId} = params
  if (!questionId) {
    throw new Response('Missing question title', {status: 400})
  }

  try {
    const dataPromise = loadQuestionDetail(request, questionId).catch(raise500)
    return defer({question: dataPromise})
  } catch (error: unknown) {
    console.log(error)
    const msg = `No question found with ID ${questionId}. Please go to <a href="https://discord.com/invite/Bt8PaRTDQC">Discord</a> and report where you found this link.`
    throw new Response(msg, {status: 404})
  }
}

const dummyQuestion = (title: string | undefined) =>
  ({
    text: 'Loading...',
    title: title ?? 'Loading...',
    tags: [],
  }) as any as Question

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

const updateRelated = (question: Question, allQuestions?: Question[]) => {
  const live =
    allQuestions
      ?.filter(({status}) => status === QuestionStatus.LIVE_ON_SITE)
      .map(({pageid}) => pageid) || []
  return {
    ...question,
    relatedQuestions: question.relatedQuestions.filter(({pageid}) => live.includes(pageid)),
  }
}

const updateBanners = (question: Question, hideBanners?: boolean) =>
  hideBanners ? {...question, banners: []} : question

const updateFields = (
  question: Question,
  hideBanners?: boolean,
  tags?: Tag[],
  allQuestions?: Question[]
) => updateTags(updateRelated(updateBanners(question, hideBanners), allQuestions), tags)

export default function RenderArticle() {
  const location = useLocation()
  const [showNav, setShowNav] = useState(false) // Used on mobile
  const params = useParams()
  const {items: onSiteQuestions} = useOnSiteQuestions()
  const {items: tags} = useTags()
  const glossary = useGlossary()
  const pageid = params.questionId ?? '😱'
  const {question} = useLoaderData<typeof loader>()
  const {toc, findSection, getArticle, getPath} = useToC()
  const section = findSection(location?.state?.section || pageid)
  const hideBannersIfSubsection = section?.children?.some((c) => c.pageid === pageid)

  useEffect(() => {
    setShowNav(false)
  }, [location.key])

  useEffect(() => {
    question.then((val) => {
      const {data: question, timestamp} = val as {data: Question; timestamp: string}
      reloadInBackgroundIfNeeded(location.pathname, timestamp)
      if (question.title) document.title = question.title
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

        <ArticlesNav
          tocLoaded={toc.length > 0}
          current={pageid}
          article={section}
          path={getPath(pageid, section?.pageid)}
          className={!showNav ? 'desktop-only bordered' : ''}
        />

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
              if (resolvedQuestion instanceof Response || !('data' in resolvedQuestion)) {
                return <Error error={resolvedQuestion} />
              } else if (!resolvedQuestion.data.pageid) {
                return (
                  <Error error={{statusText: 'Could not fetch question', status: 'emptyArticle'}} />
                )
              } else {
                return (
                  <Article
                    question={updateFields(
                      resolvedQuestion.data as Question,
                      hideBannersIfSubsection,
                      tags,
                      onSiteQuestions
                    )}
                    glossary={glossary}
                    className={showNav ? 'desktop-only' : ''}
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
