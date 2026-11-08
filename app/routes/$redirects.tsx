import type {LoaderFunctionArgs} from '@remix-run/cloudflare'
import {redirect} from '@remix-run/cloudflare'
import {cleanRedirectPath, loadRedirects} from '~/server-utils/stampy'
import {permanentRedirect, withRequestQuery} from '~/routesMapper'

const defined_redirects: Record<string, string> = {
  about: '/questions/NLZQ/What-is-this-site-about',
  tags: '/categories',
}

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const path = params['*'] && cleanRedirectPath(params['*'])
  if (path && defined_redirects[path])
    return permanentRedirect(withRequestQuery(request, defined_redirects[path]))

  try {
    const {data: redirects} = await loadRedirects(request)
    const to = path && redirects[path]
    // the Coda redirects table stays a 302, in case it gets used for links that change
    if (to) return redirect(withRequestQuery(request, to).toString())
  } catch (e) {
    console.error(e)
  }
  throw new Response(null, {
    status: 404,
    statusText: 'Not Found',
  })
}

const RenderUI = () => {
  // This should never be called, but is required for Remix to treat it as an UI route
  return null
}
export default RenderUI
