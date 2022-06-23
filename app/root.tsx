import {Links, LiveReload, Meta, Outlet, Scripts, useSearchParams} from '@remix-run/react'
import type {MetaFunction, LinksFunction} from '@remix-run/cloudflare'
import ogImage from '~/assets/stampy-ui-preview.png'
import styles from '~/root.css'

const title = 'Stampy'
const description = 'Questions and answers about about AI Alignment'
export const meta: MetaFunction = () => ({
  title,
  description,
  'og:title': title,
  'og:description': description,
  'og:image': `https://stampy-ui.aprillion.workers.dev${ogImage}`,
  'twitter:image': 'summary_large_image',
  'twitter:creator': '@aprillion0042',
})
export const links: LinksFunction = () => [{rel: 'stylesheet', href: styles}]

export default function App() {
  const [searchParams] = useSearchParams()
  const theme = searchParams.get('theme') ?? undefined

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* https://github.com/darkreader/darkreader/issues/1285#issuecomment-761893024 */}
        <meta name="color-scheme" content="light dark" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        {/* <ScrollRestoration /> wasn't doing anything useful */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
