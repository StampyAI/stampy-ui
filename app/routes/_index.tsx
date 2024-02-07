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
import {GridSystem} from '~/components/Grid/GridSystem'
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
        <GridSystem
          gridBoxes={[
            {
              title: 'Technical alignment research categories',
              subtitle: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9769202bfb08a9b87ab3d7e55cff70586447e8f76a8c076fff6f0d4e8902c5da?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              pageid: '123',
              hasText: true,
            },
            {
              title: 'Governance',
              subtitle: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7b7d22b33dd958b157082b2ca8a77eef6ad552d10764d38f8035285bc1f7be11?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              pageid: '123',
              hasText: true,
            },
            {
              title: 'Existential risk concepts',
              subtitle: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/11cfe00a2459aad8521abe570fe704c47a982a1d7686ea916cc318010eaa7a32?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              pageid: '123',
              hasText: true,
            },
            {
              title: 'Predictions on advanced AI',
              subtitle: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/fd10e7106c3d8988b4046afc200b9224122ac8051c52aae1ce0debcf3f04f3cd?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              pageid: '123',
              hasText: true,
            },
            {
              title: 'Prominent research organizations',
              subtitle: 'Lorem ipsum dolor sit amet consectetur',
              icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0de85958d44d9176c2dd4eb584ec22c23e7200150932ebc110a86bdf52f595d9?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
              pageid: '123',
              hasText: true,
            },
          ]}
        />

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
