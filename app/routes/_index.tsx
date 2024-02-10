import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldRevalidateFunction, useOutletContext, useLoaderData, redirect} from '@remix-run/react'
import {QuestionState, loadTags} from '~/server-utils/stampy'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import type {Context} from '~/root'
import {PageHeaderText} from '~/components/PageHeader'
import {WidgetStampy} from '~/components/WidgetStampy'
import {PageSubheaderText} from '~/components/PageSubHeader'
import {ContentBoxMain, ContentBoxSecond, ContentBoxThird} from '~/components/ContentBox'
import Grid from '~/components/Grid'
import useToC from '~/hooks/useToC'
import {getStateEntries} from '~/hooks/stateModifiers'

const empty: Awaited<ReturnType<typeof loadTags>> = {data: [], timestamp: ''}
export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const url = new URL(request.url)
  const stateFromUrl = url.searchParams.get('state')
  if (stateFromUrl) {
    const firstOpenId = getStateEntries(stateFromUrl).filter(
      ([_, state]) => state === QuestionState.OPEN
    )[0]?.[0]
    if (firstOpenId) {
      url.searchParams.delete('state')
      url.pathname = `/${firstOpenId}`
      throw redirect(url.toString())
    }
  }
  try {
    const tags = await loadTags(request)
    return {tags}
  } catch (e) {
    console.error(e)
    return {tags: empty}
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export default function App() {
  const {tags} = useLoaderData<ReturnType<typeof loader>>()
  const {embed} = useOutletContext<Context>()
  const {toc} = useToC()

  return (
    <>
      <Header toc={toc} categories={tags.data} />
      <div className="page-body">
        <PageHeaderText>
          <p>Educational content</p>
          <p>on all things AI Safety</p>
        </PageHeaderText>

        <ContentBoxMain />
        <ContentBoxSecond />
        <ContentBoxThird />

        <WidgetStampy />

        <div className="top-margin-large" />
        <PageSubheaderText text="Advanced Content" />
        <Grid gridBoxes={toc} />
      </div>

      {!embed && <Footer />}
    </>
  )
}
