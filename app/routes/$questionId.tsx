import {Await, useLoaderData, useParams} from '@remix-run/react'
import {Suspense} from 'react'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import {loader} from '~/routes/questions.$questionId'
export {loader}
import {ArticlesNav, EmtpyArticlesNav} from '~/components/ArticlesNav/Menu'
import Article from '~/components/Article'
import useToC from '~/hooks/useToC'

export default function RenderArticle() {
  const params = useParams()
  const pageid = params.questionId ?? '😱'
  const {data, tags} = useLoaderData<typeof loader>()
  const {toc, findSection, getPath} = useToC()
  const section = findSection(pageid)
  const path = getPath(pageid)

  return (
    <>
      <Suspense fallback={<Header toc={toc} categories={[]} />}>
        <Await resolve={tags}>{(tags) => <Header toc={toc} categories={tags} />}</Await>
      </Suspense>
      <div className="flex-container">
        {section ? (
          <ArticlesNav current={pageid} article={section} path={path} />
        ) : (
          <EmtpyArticlesNav />
        )}
        <Suspense fallback={<Article text="" title={section?.title ?? 'Loading...'} tags={[]} />}>
          <Await resolve={data}>{Article}</Await>
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
