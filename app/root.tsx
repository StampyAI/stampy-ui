import {Links, LiveReload, Meta, Outlet, Scripts} from '@remix-run/react'
import type {MetaFunction, LinksFunction, LoaderFunction} from '@remix-run/cloudflare'
import styles from '~/root.css'

import {useLoaderData} from '@remix-run/react'
import {getStateEntries} from '~/hooks/stateModifiers'
import {loadQuestionDetail} from '~/server-utils/stampy'

/*
 * Transform the given text into a meta header format.
 *
 * In practice, this means stripping out any HTML tags and limiting its length
 */
const metafyText = (text: string | null, defaultText: string) => {
  if (!text || text.length == 0) return defaultText

  let cleaned = text
  // Totally remove any P, A or IFRAME tags, but leave the contents. Any other
  // tags will be ignored for now
  const removals = [/<\/?p.*?>/gi, /<\/?a.*?>/gi, /<\/?iframe.*?>/gi]
  cleaned = removals.reduce((str, regex) => str.replace(regex, ''), cleaned)

  // This first random website I found claims that the description limit is 155,
  // so keep it to that: https://www.contentkingapp.com/academy/meta-description/
  if (cleaned.length > 155) cleaned = cleaned.slice(0, 152) + '...'
  return cleaned
}

/*
 * Return the question if the url only contains one
 */
const fetchQuestion = async (request: Request) => {
  const url = new URL(request.url)
  const questions = getStateEntries(url.searchParams.get('state') || '')

  if (questions.length != 1) return null

  const {data} = await loadQuestionDetail(request, questions[0][0])
  return data
}

const TITLE = 'Stampy'
const DESCRIPTION = 'AI Safety FAQ'
const ogImage = 'https://github.com/StampyAI/StampyAIAssets/blob/main/banner/stampy-ui-preview.png'
const twitterCreator = '@stampyai'
export const meta: MetaFunction = ({data}) => {
  const title = metafyText(data?.question?.title, TITLE)
  const description = metafyText(data?.question?.text, DESCRIPTION)
  return {
    title,
    description,
    'og:title': title,
    'og:description': description,
    'og:image': ogImage,
    'twitter:image': ogImage,
    'twitter:creator': twitterCreator,
  }
}
export const links: LinksFunction = () => [{rel: 'stylesheet', href: styles}]

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const isDomainWithLogo = request.url.match(/ui.stampy.ai/)
  const isLogoForcedOff = request.url.match(/minLogo/)
  const isLogoForcedOn = request.url.match(/funLogo/)
  const minLogo = isDomainWithLogo ? !!isLogoForcedOff : !isLogoForcedOn

  return {
    question: await fetchQuestion(request),
    minLogo,
  }
}

function Head({minLogo}: {minLogo?: boolean}) {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      {/* https://github.com/darkreader/darkreader/issues/1285#issuecomment-761893024 */}
      <meta name="color-scheme" content="light dark" />
      <Meta />
      <Links />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3110255,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
        }}
      />
      {minLogo ? (
        <link id="favicon" rel="icon" href="/favicon-min.ico" />
      ) : (
        <link id="favicon" rel="icon" href="/favicon.ico" />
      )}
    </head>
  )
}

export function ErrorBoundary() {
  return (
    <html>
      <Head />
      <body>
        <h2>Oops! Something went wrong!</h2>
        <div>
          Please report this error to <a href="https://discord.gg/5ZFqAKBX">the Stampy Discord</a>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const {minLogo} = useLoaderData<ReturnType<typeof loader>>()

  return (
    <html lang="en">
      <Head minLogo={minLogo} />
      <body>
        <Outlet context={minLogo} />
        {/* <ScrollRestoration /> wasn't doing anything useful */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
