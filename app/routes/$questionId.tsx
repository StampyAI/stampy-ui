import {useLoaderData} from '@remix-run/react'
import {Header, Footer} from '~/components/layouts'
import {loader} from '~/routes/questions.$questionId'
export {loader}
import {Tag} from '~/components/Tags/Tag'
import {H2} from '~/components/Typography/H2'
import {Paragraph} from '~/components/Typography/Paragraph'
import {ArticlesNav} from '~/components/ArticlesNav/Menu'
import useToC from '~/hooks/useToC'

const Bla = ({title, tags, text}: {title: string; text: string; tags: any[]}) => {
  const ttr = (text: string, rate = 160) => {
    const time = text.split(' ')
    return Math.round(time.length / rate)
  }

  return (
    <div style={{paddingLeft: '40px'}}>
      <H2 teal={true}>{title}</H2>
      <Paragraph style={{marginTop: '0px'}}>{ttr(text)} min read</Paragraph>
      <div dangerouslySetInnerHTML={{__html: text}}></div>
      <div style={{display: 'flex'}}>
        {tags.map((tag: string) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </div>
  )
}

export default function Article() {
  const {
    data: {title, text, tags, pageid},
  } = useLoaderData<any>()
  const {findSection, getPath} = useToC()
  const section = findSection(pageid)
  const path = getPath(pageid)

  return (
    <>
      <Header />
      <div className="flex-container">
        {section && <ArticlesNav current={pageid} article={section} path={path} />}
        <Bla text={text} title={title} tags={tags} />
      </div>
      <Footer />
    </>
  )
}
