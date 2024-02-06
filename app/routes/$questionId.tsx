import {useLoaderData} from '@remix-run/react'
import {Header, Footer} from '~/components/layouts'
import {loader} from '~/routes/questions.$questionId'
export {loader}

export default function Article() {
  const {
    data: {title, text},
  } = useLoaderData<any>()
  return (
    <>
      <Header />
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{__html: text}}></div>
      <Footer />
    </>
  )
}
