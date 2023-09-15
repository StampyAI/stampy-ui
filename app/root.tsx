import {Links, LiveReload, Meta, Outlet, Scripts} from '@remix-run/react'
import type {MetaFunction, LinksFunction, LoaderFunction} from '@remix-run/cloudflare'
import styles from '~/root.css'

import {useLoaderData} from '@remix-run/react'
import {questionsOnPage} from '~/hooks/stateModifiers'
import {loadQuestionDetail} from '~/server-utils/stampy'
import {useTheme} from './hooks/theme'
import {useEffect} from 'react'

/*
 * Transform the given text into a meta header format.
 *
 * In practice, this means stripping out any HTML tags and limiting its length
 */
const makeSocialPreviewText = (
  text: string | null | undefined,
  defaultText: string,
  maxLen = 350
) => {
  if (!text || text.length == 0) return defaultText

  let cleaned = text
  // Totally remove any P, A or IFRAME tags, but leave the contents. Any other
  // tags will be ignored for now
  const removals = [/<\/?p.*?>/gi, /<\/?a.*?>/gi, /<\/?iframe.*?>/gi]
  cleaned = removals.reduce((str, regex) => str.replace(regex, ''), cleaned)

  if (cleaned.length > maxLen) cleaned = cleaned.slice(0, maxLen - 3) + '...'
  return cleaned
}

/*
 * Return the question if the url only contains one
 */
const fetchQuestion = async (request: Request) => {
  const url = new URL(request.url)
  const questions = questionsOnPage(url.searchParams.get('state') || '')

  if (questions.length != 1) return null

  const {data} = await loadQuestionDetail(request, questions[0][0])
  return data
}

const TITLE = 'Stampy'
const DESCRIPTION = 'AI Safety FAQ'
const twitterCreator = '@stampyai'
export const meta: MetaFunction<typeof loader> = ({data}) => {
  const title = makeSocialPreviewText(data.question?.title, TITLE, 150)
  const description = makeSocialPreviewText(data.question?.text, DESCRIPTION)
  const url = new URL(data.url)
  const logo = `${url.origin}/${data.minLogo ? 'favicon-min-512.png' : 'favicon-512.png'}`
  return {
    title,
    description,
    'og:url': data.url,
    'og:type': 'article',
    'og:title': title,
    'og:description': description,
    'og:image': logo,
    'og:image:type': 'image/png',
    'og:image:width': '512',
    'og:image:height': '512',
    'twitter:card': 'summary',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': logo,
    'twitter:creator': twitterCreator,
    'twitter:url': data.url,
  }
}
export const links: LinksFunction = () => [{rel: 'stylesheet', href: styles}]

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const isDomainWithFunLogo = request.url.match(/stampy.ai|localhost/) // min logo by default on aisafety.info and 127.0.0.1
  const isFunLogoForcedOff = request.url.match(/minLogo/)
  const isFunLogoForcedOn = request.url.match(/funLogo/)
  const minLogo = isDomainWithFunLogo ? !!isFunLogoForcedOff : !isFunLogoForcedOn

  const embed = !!request.url.match(/embed/)

  const question = await fetchQuestion(request).catch((e) => {
    console.error('\n\nUnexpected error in loader\n', e)
    return null
  })

  return {
    question,
    url: request.url,
    minLogo,
    embed,
  }
}

function Head({minLogo}: {minLogo?: boolean}) {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      {/* don't use color-scheme because supporting transparent iframes https://fvsch.com/transparent-iframes
          is more important than dark reader https://github.com/darkreader/darkreader/issues/1285#issuecomment-761893024
          <meta name="color-scheme" content="light dark" /> 
       */}
      <Meta />
      <Links />
      {minLogo ? (
        <link id="favicon" rel="icon" href="/favicon-min.ico" />
      ) : (
        <link id="favicon" rel="icon" href="/favicon.ico" />
      )}
    </head>
  )
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)

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

type Loader = Awaited<ReturnType<typeof loader>>
export type Context = Pick<Loader, 'minLogo' | 'embed'>

export default function App() {
  const {minLogo, embed} = useLoaderData<Loader>()
  const {savedTheme} = useTheme()
  const context: Context = {minLogo, embed}

  useEffect(() => {
    if (embed) {
      // send new height to the parent page of iframe
      let lastHeight = 0
      const observer = new MutationObserver(() => {
        const height =
          Math.floor(document.querySelector('main')?.getBoundingClientRect().height || 0) + 30

        // avoid slowly increasing height due to rounding errors and 100% height
        if (Math.abs(lastHeight - height) < 3) return

        window.parent.postMessage({type: 'aisafety.info__height', height}, '*')
        lastHeight = height
      })
      observer.observe(document.body, {attributes: true, subtree: true})

      return () => observer.disconnect()
    }
  }, [embed])

  return (
    <html lang="en" className={`${embed ? 'embed' : ''} ${savedTheme ?? ''}`}>
      <Head minLogo={minLogo} />
      <body>
        <Outlet context={context} />
        {/* <ScrollRestoration /> wasn't doing anything useful */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
