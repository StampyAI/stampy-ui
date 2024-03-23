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
import {ArticlesNav} from '~/components/ArticlesNav/Menu'
import {fetchGlossary} from '~/routes/questions.glossary'
import {loadQuestionDetail, loadTags} from '~/server-utils/stampy'
import useToC from '~/hooks/useToC'
import type {Question, Glossary, Tag} from '~/server-utils/stampy'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const LINK_WITHOUT_DETAILS_CLS = 'link-without-details'

const raise500 = (error: Error) => new Response(error.toString(), {status: 500})

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const {questionId} = params
  if (!questionId) {
    throw new Response('Missing question title', {status: 400})
  }

  try {
    const dataPromise = loadQuestionDetail(request, questionId)
      .then(({data}) => data)
      .catch(raise500)
    const tagsPromise = loadTags(request)
      .then(({data}) => data)
      .catch(raise500)
    return defer({data: dataPromise, tags: tagsPromise})
  } catch (error: unknown) {
    const msg = `No question found with ID ${questionId}. Please go to <a href="https://discord.com/invite/Bt8PaRTDQC">Discord</a> and report where you found this link.`
    throw new Response(msg, {status: 404})
  }
}

export function fetchQuestion(pageid: string) {
  const url = `/questions/${encodeURIComponent(pageid)}`
  return fetch(url)
    .then(async (response) => {
      const json: Awaited<ReturnType<typeof loadQuestionDetail>> = await response.json()
      if ('error' in json) console.error(json.error)
      const {data, timestamp} = json

      reloadInBackgroundIfNeeded(url, timestamp)

      return data
    })
    .catch((e) => {
      throw raise500(e)
    })
}

const dummyQuestion = (title: string | undefined) =>
  ({
    text: 'Loading...',
    title: title ?? 'Loading...',
    tags: [],
  }) as any as Question

const updateTags = (question: Question, tags: Tag[]) => {
  const mappedTags = tags.reduce((acc, t) => ({...acc, [t.name]: t}), {})
  return {
    ...question,
    tags: question.tags
      ?.map((name) => mappedTags[name as keyof typeof mappedTags])
      .filter((t?: Tag) => t && !t?.internal)
      .map(({name}) => name),
  }
}

export default function RenderArticle() {
  const location = useLocation()
  const [glossary, setGlossary] = useState<Glossary>({} as Glossary)
  const [showNav, setShowNav] = useState(false) // Used on mobile
  const params = useParams()
  const pageid = params.questionId ?? '😱'
  const {data, tags} = useLoaderData<typeof loader>()
  const {findSection, getArticle, getPath} = useToC()
  const section = findSection(location?.state?.section || pageid)

  useEffect(() => {
    const getGlossary = async () => {
      const {data} = await fetchGlossary()
      setGlossary(data)
    }
    getGlossary()
  }, [setGlossary])

  useEffect(() => {
    setShowNav(false)
  }, [location.key])

  useEffect(() => {
    data.then((val) => {
      const question = val as Question
      if (question.title) document.title = question.title
    })
  }, [data])

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
          <Button
            className="mobile-only article-selector large-reading"
            action={() => setShowNav(true)}
          >
            {getArticle(pageid)?.title}
            <ChevronRight className="dropdown-icon active" />
          </Button>
        )}

        {section && (
          <ArticlesNav
            current={pageid}
            article={section}
            path={getPath(pageid, section?.pageid)}
            className={!showNav ? 'desktop-only bordered' : ''}
          />
        )}

        <Suspense
          key={pageid}
          fallback={
            <Article
              question={dummyQuestion(getArticle(pageid)?.title)}
              className={showNav ? 'desktop-only' : ''}
            />
          }
        >
          <Await resolve={Promise.all([data, tags])}>
            {([resolvedValue, tags]) => {
              if (resolvedValue instanceof Response) {
                return <Error error={resolvedValue} />
              } else if (!(resolvedValue as any)?.pageid) {
                return (
                  <Error error={{statusText: 'Could not fetch question', status: 'emptyArticle'}} />
                )
              } else {
                return (
                  <Article
                    question={updateTags(resolvedValue as Question, tags as Tag[])}
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
