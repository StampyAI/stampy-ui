import {useEffect} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldRevalidateFunction, redirect} from '@remix-run/react'
import {QuestionState} from '~/server-utils/stampy'
import {ContentBoxMain, ContentBoxSecond, ContentBoxThird} from '~/components/ContentBox'
import useToC from '~/hooks/useToC'
import Grid from '~/components/Grid'
import Page from '~/components/Page'
import {WidgetStampy} from '~/components/Chatbot'
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
  const {advanced} = useToC()

  useEffect(() => {
    document.title = 'AISafety.info'
  }, [])

  return (
    <Page>
      <div className="page-body">
        <h1 className="padding-top-56">Smarter-than-human AI may come soon</h1>
        <h2 className="padding-bottom-80">And could lead to human extinction</h2>

        <ContentBoxMain />
        <ContentBoxSecond />
        <ContentBoxThird />

        <div className="desktop-only padding-bottom-56" />
        <WidgetStampy className="desktop-only" />

        <h3 className="grey large-bold padding-bottom-32">Advanced sections</h3>
        <Grid gridBoxes={advanced} />
      </div>
    </Page>
  )
}
