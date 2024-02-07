import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldRevalidateFunction, useLoaderData} from '@remix-run/react'
import {loadTags} from '~/server-utils/stampy'
import {loadToC} from '~/routes/questions.toc'
import NavBar from '~/components/Nav'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  try {
    console.log('getting all')
    const [{data: tags}, {data: toc}] = await Promise.all([loadTags(request), loadToC(request)])
    console.log('got it ')
    return {tags: tags.slice(0, 10), toc}
  } catch (e) {
    console.error(e)
    return {tags: [], toc: []}
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export default function App() {
  const {tags, toc} = useLoaderData<ReturnType<typeof loader>>()

  return (
    <>
      <NavBar toc={toc} categories={tags} />
      <main></main>
    </>
  )
}
