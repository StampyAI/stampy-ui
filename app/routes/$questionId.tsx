import {Await, useLoaderData, useParams} from '@remix-run/react'
import {Suspense, useEffect, useState} from 'react'
import Page from '~/components/Page'
import {loader} from '~/routes/questions.$questionId'
import {ArticlesNav, EmtpyArticlesNav} from '~/components/ArticlesNav/Menu'
import Article from '~/components/Article'
import {fetchGlossary} from '~/routes/questions.glossary'
import useToC from '~/hooks/useToC'
import type {Question, Glossary} from '~/server-utils/stampy'

export {loader}

const dummyQuestion = (title: string | undefined) =>
  ({
    text: '',
    title: title ?? 'Loading...',
    tags: [],
  }) as any as Question

export default function RenderArticle() {
  const [glossary, setGlossary] = useState<Glossary>({} as Glossary)
  const params = useParams()
  const pageid = params.questionId ?? '😱'
  const {data} = useLoaderData<typeof loader>()
  const {findSection, getPath} = useToC()
  const section = findSection(pageid)
  const path = getPath(pageid)

  useEffect(() => {
    const getGlossary = async () => {
      const {data} = await fetchGlossary()
      setGlossary(data)
    }
    getGlossary()
  }, [setGlossary])

  return (
    <Page>
      <div className="flex-container">
        {section ? (
          <ArticlesNav current={pageid} article={section} path={path} />
        ) : (
          <EmtpyArticlesNav />
        )}
        <Suspense fallback={<Article question={dummyQuestion(section?.title)} />}>
          <Await resolve={data}>{(data) => <Article question={data} glossary={glossary} />}</Await>
        </Suspense>
      </div>
    </Page>
  )
}
