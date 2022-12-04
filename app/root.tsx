import {Links, LiveReload, Meta, Outlet, Scripts} from '@remix-run/react'
import type {MetaFunction, LinksFunction, LoaderFunction} from '@remix-run/cloudflare'
import styles from '~/stylesheets/root.css'
import layout from '~/stylesheets/layout.css'

import {useLoaderData} from '@remix-run/react'

const title = 'Stampy'
const description = 'AI Safety FAQ'
const ogImage = 'https://github.com/StampyAI/StampyAIAssets/blob/main/banner/stampy-ui-preview.png'
const twitterCreator = '@stampyai'
export const meta: MetaFunction = () => ({
  title,
  description,
  'og:title': title,
  'og:description': description,
  'og:image': ogImage,
  'twitter:image': ogImage,
  'twitter:creator': twitterCreator,
})
export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: styles},
  {rel: 'stylesheet', href: layout},
]

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const isDomainWithLogo = request.url.match(/ui.stampy.ai/)
  const isLogoForcedOff = request.url.match(/minLogo/)
  const isLogoForcedOn = request.url.match(/funLogo/)
  const minLogo = isDomainWithLogo ? !!isLogoForcedOff : !isLogoForcedOn

  return {
    minLogo,
  }
}

export default function App() {
  const {minLogo} = useLoaderData<ReturnType<typeof loader>>()

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
        {minLogo ? (
          <link id="favicon" rel="icon" href="/favicon-min.ico" />
        ) : (
          <link id="favicon" rel="icon" href="/favicon.ico" />
        )}
      </head>
      <body>
        <Outlet context={minLogo} />
        {/* <ScrollRestoration /> wasn't doing anything useful */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
