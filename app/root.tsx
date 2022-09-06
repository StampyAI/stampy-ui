import {Links, LiveReload, Meta, Outlet, Scripts} from '@remix-run/react'
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
  return (
    <html lang="en">
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
