import {Links, LinksFunction, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from 'remix'
import type {MetaFunction} from 'remix'
import ogImage from './assets/stampy-ui-preview.png'
import styles from './root.css'

const title = 'Stampy UI'
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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
