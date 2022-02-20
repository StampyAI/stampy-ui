import {Links, LinksFunction, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from 'remix'
import type {MetaFunction} from 'remix'
import ogImage from './assets/stampy-ui-preview.png'
import styles from './root.css'

export const meta: MetaFunction = () => ({
  title: 'Stampy UI',
  description: 'Questions and answers about about AI Alignment',
  'twitter:image': 'summary',
  'og:image': ogImage,
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
