import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldRevalidateFunction, redirect} from '@remix-run/react'
import {QuestionState} from '~/server-utils/stampy'
import {WidgetStampy} from '~/components/Widget/Stampy'
import {ContentBoxMain, ContentBoxSecond, ContentBoxThird} from '~/components/ContentBox'
import useToC from '~/hooks/useToC'
import Grid from '~/components/Grid'
import Page from '~/components/Page'
import {getStateEntries} from '~/hooks/stateModifiers'
import {questionUrl} from '~/routesMapper'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const url = new URL(request.url)
  const stateFromUrl = url.searchParams.get('state')
  if (stateFromUrl) {
    const firstOpenId = getStateEntries(stateFromUrl).filter(
      ([_, state]) => state === QuestionState.OPEN
    )[0]?.[0]
    if (firstOpenId) {
      url.searchParams.delete('state')
      url.pathname = questionUrl({pageid: firstOpenId})
      throw redirect(url.toString())
    }
  }
  return null
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export default function App() {
  const {toc} = useToC()
  return (
    <Page>
      <div className="page-body">
        <h1 className="padding-bottom-80 padding-top-56">Answers on all things AI safety</h1>

        <ContentBoxMain />
        <ContentBoxSecond />
        <ContentBoxThird />

        <WidgetStampy />

        <p className="large-bold grey padding-bottom-32">Advanced content</p>
        <Grid gridBoxes={toc} />
      </div>
    </Page>
  )
}
