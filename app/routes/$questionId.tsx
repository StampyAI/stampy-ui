import {useLoaderData} from '@remix-run/react'
import {Header, Footer} from '~/components/layouts'
import {loader} from '~/routes/questions.$questionId'
export {loader}
import {Tag} from '~/components/Tags/Tag'
import {H2} from '~/components/Typography/H2'
import {Paragraph} from "~/components/Typography/Paragraph";


export default function Article() {
  const {data: {title, text, tags}} = useLoaderData<any>()
    const ttr = (text: string, rate=160) => {
        const time = text.split(" ")
        return Math.round(time.length/rate)
    }

  return (
    <>
      <Header />
      <H2 teal={true}>{title}</H2>
        <Paragraph style={{marginTop:"0px"}}>{ttr(text)} min read</Paragraph>
      <div dangerouslySetInnerHTML={{__html: text}}></div>
        <div style={{display:"flex"}}>
            {tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
            ))}
        </div>
      <Footer />
    </>
  )
}
