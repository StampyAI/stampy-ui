import {Await, useLoaderData, useParams} from '@remix-run/react'
import {Suspense, useEffect, useState} from 'react'
import Page from '~/components/Page'
import {loader} from '~/routes/questions.$questionId'
import {ArticlesNav} from '~/components/ArticlesNav/Menu'
import Article from '~/components/Article'
import Error from '~/components/Error'
import {fetchGlossary} from '~/routes/questions.glossary'
import useToC from '~/hooks/useToC'
import type {Question, Glossary} from '~/server-utils/stampy'

export {loader}

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
      <div className="flex-container flex-double article-wrapper">
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
