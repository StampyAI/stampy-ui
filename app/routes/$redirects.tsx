import type {LoaderFunctionArgs} from '@remix-run/cloudflare'
import {redirect} from '@remix-run/cloudflare'
import {cleanRedirectPath, loadRedirects} from '~/server-utils/stampy'

const defined_redirects: Record<string, string> = {
  about: '/questions/NLZQ/What-is-this-site-about',
  tags: '/categories/',
}

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const path = params['*'] && cleanRedirectPath(params['*'])
  if (path && defined_redirects[path]) return redirect(defined_redirects[path], 301)

  try {
    const {data: redirects} = await loadRedirects(request)
    const to = path && redirects[path]
    if (to) return redirect(to)
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
