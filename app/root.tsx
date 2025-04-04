import {useEffect, ReactNode} from 'react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  ScrollRestoration,
  Scripts,
  useParams,
  useRouteError,
  useLoaderData,
} from '@remix-run/react'
import type {MetaFunction, LinksFunction, LoaderFunction} from '@remix-run/cloudflare'
import {cssBundleHref} from '@remix-run/css-bundle'
import newStyles from '~/root.css'
import Error from '~/components/Error'
import Page from '~/components/Page'
import {CachedObjectsProvider} from '~/hooks/useCachedObjects'
import {useTheme} from '~/hooks/theme'
import {loadQuestionDetail} from '~/server-utils/stampy'
import GlobalBanners from './components/GlobalBanners'

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

  const [path, pageid] = url.pathname.slice(1).split('/') || []
  if (path === 'questions') {
    const {data} = await loadQuestionDetail(request, pageid)
    return data
  }
  return null
}

const TITLE = 'AISafety.info'
const DESCRIPTION = 'AI safety FAQ'
const twitterCreator = '@stampyai'
export const meta: MetaFunction<typeof loader> = ({data = {} as any}) => {
  const title = makeSocialPreviewText(data.question?.title, TITLE, 150)
  const description = makeSocialPreviewText(data.question?.text, DESCRIPTION)
  const logo = '/favicon-512.png'
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:url', content: data.url},
    {property: 'og:type', content: 'article'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:image', content: logo},
    {property: 'og:image:type', content: 'image/png'},
    {property: 'og:image:width', content: '512'},
    {property: 'og:image:height', content: '512'},
    {property: 'twitter:card', content: 'summary'},
    {property: 'twitter:title', content: title},
    {property: 'twitter:description', content: description},
    {property: 'twitter:image', content: logo},
    {property: 'twitter:creator', content: twitterCreator},
    {property: 'twitter:url', content: data.url},
  ]
}

export const links: LinksFunction = () =>
  [newStyles, cssBundleHref]
    .filter((i) => i)
    .map((styles) => ({rel: 'stylesheet', href: styles as string}))

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const embed = !!request.url.match(/embed/)
  const showSearch = !request.url.match(/onlyInitial/)

  const question = await fetchQuestion(request).catch((e) => {
    console.error('\n\nUnexpected error in loader\n', e)
    return null
  })

  return {
    question,
    url: request.url,
    embed,
    showSearch,
    matomoDomain: MATOMO_DOMAIN,
  }
}

const AnaliticsTag = ({matomoDomain}: {matomoDomain?: string}) => {
  if (!matomoDomain) return null
  return (
    <script
      async
      dangerouslySetInnerHTML={{
        __html: `
                        var _paq = window._paq = window._paq || [];
                        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                        _paq.push(["disableCookies"]);
                        _paq.push(['trackPageView']);
                        _paq.push(['enableLinkTracking']);
                        (function() {
                            var u="https://${matomoDomain}.matomo.cloud/";
                            _paq.push(['setTrackerUrl', u+'matomo.php']);
                            _paq.push(['setSiteId', '3']);
                            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                            g.async=true; g.src='https://cdn.matomo.cloud/${matomoDomain}.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
                        })();`,
      }}
    />
  )
}

function Head() {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
      {/* don't use color-scheme because supporting transparent iframes https://fvsch.com/transparent-iframes
          is more important than dark reader https://github.com/darkreader/darkreader/issues/1285#issuecomment-761893024
          <meta name="color-scheme" content="light dark" />
       */}
      <Meta />
      <Links />
      <link id="favicon" rel="icon" href="/favicon.ico" />
    </head>
  )
}

const BasePage = ({
  children,
  embed,
  savedTheme,
}: {
  children: ReactNode
  embed?: boolean
  savedTheme?: string
}) => (
  <CachedObjectsProvider>
    <html lang="en" className={`${embed ? 'embed' : ''} ${savedTheme ?? ''}`}>
      <Head />
      <body>
        <GlobalBanners />
        {children}
      </body>
    </html>
  </CachedObjectsProvider>
)

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  const params = useParams()
  const embed = !!params.embed

  return (
    <BasePage embed={embed}>
      <Page>
        <Error error={error as any} />
      </Page>
      <Scripts />
    </BasePage>
  )
}

type Loader = Awaited<ReturnType<typeof loader>>
export type Context = Pick<Loader, 'embed' | 'showSearch'>

export default function App() {
  const {embed, showSearch, matomoDomain} = useLoaderData<Loader>()
  const {savedTheme} = useTheme()
  const context: Context = {embed, showSearch}

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
    <BasePage embed={embed} savedTheme={savedTheme}>
      <AnaliticsTag matomoDomain={matomoDomain} />
      <Outlet context={context} />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </BasePage>
  )
}
