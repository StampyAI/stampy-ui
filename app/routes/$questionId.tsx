import {Await, useLoaderData, useParams} from '@remix-run/react'
import {Suspense} from 'react'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import {loader} from '~/routes/questions.$questionId'
export {loader}
import {Tag} from '~/components/Tags/Tag'
import {H2} from '~/components/Typography/H2'
import {Paragraph} from '~/components/Typography/Paragraph'
import {ArticlesNav, EmtpyArticlesNav} from '~/components/ArticlesNav/Menu'
import useToC from '~/hooks/useToC'

const Bla = ({title, tags, text}: {title: string; text: string; tags?: string[]}) => {
  const ttr = (text: string, rate = 160) => {
    const time = text.split(' ')
    return Math.ceil(time.length / rate) // ceil to avoid "0 min read"
  }

  return (
    <div style={{paddingLeft: '40px'}}>
      <H2 teal={true}>{title}</H2>
      {text && <Paragraph style={{marginTop: '0px'}}>{ttr(text)} min read</Paragraph>}
      <div dangerouslySetInnerHTML={{__html: text}}></div>
      <div style={{display: 'flex'}}>{tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
    </div>
  )
}

export default function Article() {
  const params = useParams()
  const pageid = params.questionId ?? '😱'
  const {data} = useLoaderData<typeof loader>()
  const {toc, findSection, getPath} = useToC()
  const section = findSection(pageid)
  const path = getPath(pageid)

  return (
    <>
      <Header toc={toc} categories={[]} />
      <div className="flex-container">
        {section ? (
          <ArticlesNav current={pageid} article={section} path={path} />
        ) : (
          <EmtpyArticlesNav />
        )}
        <Suspense fallback={<Bla text="" title={section?.title ?? 'Loading...'} tags={[]} />}>
          <Await resolve={data}>
            {({text, title, tags}) => <Bla text={text ?? ''} title={title} tags={tags} />}
          </Await>
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
