import type {LoaderFunctionArgs} from '@remix-run/cloudflare'
import {redirect} from '@remix-run/cloudflare'
import {loadRedirects} from '~/server-utils/stampy'

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  try {
    const {data: redirects} = await loadRedirects(request)
    const to = params['*'] && redirects[params['*'].replace(/^\/+/, '')]
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
