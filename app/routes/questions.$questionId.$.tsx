import {Await, useLoaderData, useParams} from '@remix-run/react'
import {defer, type LoaderFunctionArgs} from '@remix-run/cloudflare'
import {Suspense, useEffect, useState} from 'react'
import Page from '~/components/Page'
import Article from '~/components/Article'
import Error from '~/components/Error'
import {ArticlesNav} from '~/components/ArticlesNav/Menu'
import {fetchGlossary} from '~/routes/questions.glossary'
import {loadQuestionDetail, loadTags} from '~/server-utils/stampy'
import useToC from '~/hooks/useToC'
import type {Question, Glossary} from '~/server-utils/stampy'
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

export default function RenderArticle() {
  const [glossary, setGlossary] = useState<Glossary>({} as Glossary)
  const params = useParams()
  const pageid = params.questionId ?? '😱'
  const {data} = useLoaderData<typeof loader>()
  const {findSection, getArticle, getPath} = useToC()
  const section = findSection(pageid)

  useEffect(() => {
    const getGlossary = async () => {
      const {data} = await fetchGlossary()
      setGlossary(data)
    }
    getGlossary()
  }, [setGlossary])

  return (
    <Page>
      <div className="article-container">
        {section && <ArticlesNav current={pageid} article={section} path={getPath(pageid)} />}
        <Suspense
          key={pageid}
          fallback={<Article question={dummyQuestion(getArticle(pageid)?.title)} />}
        >
          <Await resolve={data}>
            {(resolvedValue) => {
              if (resolvedValue instanceof Response) {
                return <Error error={resolvedValue} />
              } else if (!(resolvedValue as any)?.pageid) {
                return (
                  <Error error={{statusText: 'Could not fetch question', status: 'emptyArticle'}} />
                )
              } else {
                return <Article question={resolvedValue as Question} glossary={glossary} />
              }
            }}
          </Await>
        </Suspense>
      </div>
    </Page>
  )
}
