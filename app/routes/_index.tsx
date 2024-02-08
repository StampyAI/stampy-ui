import type {LoaderFunction} from '@remix-run/cloudflare'
import {ShouldRevalidateFunction, useOutletContext, useLoaderData} from '@remix-run/react'
import {loadTags} from '~/server-utils/stampy'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import type {Context} from '~/root'
import {PageHeaderText} from '~/components/PageHeader'
import {ContentBoxMain} from '~/components/ContentBoxMain'
import {ContentBoxSecond} from '~/components/ContentBoxSecond'
import {ContentBoxThird} from '~/components/ContentBoxThird'
import {WidgetStampy} from '~/components/WidgetStampy'
import {PageSubheaderText} from '~/components/PageSubHeader'
import Grid from '~/components/Grid'
import useToC from '~/hooks/useToC'

const empty: Awaited<ReturnType<typeof loadTags>> = {data: [], timestamp: ''}
export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
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
      <div className={'page-body'}>
        <PageHeaderText>
          <p>Educational content</p>
          <p>on all things AI Safety</p>
        </PageHeaderText>

        <ContentBoxMain />

      <ContentBoxSecond
          elements={[
            {title: 'What are the main sources of AI existential risk?', pageid: '8503'},
            {title: 'Do people seriously worry about existential risk from AI?', pageid: '6953'},
            {title: 'Why would an AI do bad things?', pageid: '2400'},
          ]}
        />

      <ContentBoxThird />

      <WidgetStampy />

      <div className={'top-margin-large'} />
        <PageSubheaderText text={'Advanced Content'} />
        <Grid gridBoxes={toc} />

        {!embed && (
          <>
            <div className={'top-margin-large-with-border'} />

            <div className={'top-margin-large'} />
            <Footer />
          </>
        )}
      </div>
    </>
  )
}
