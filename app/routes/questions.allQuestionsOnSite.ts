import {LoaderFunctionArgs} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadOnSiteAnswers} from '~/server-utils/stampy'

export const loader = async ({request}: LoaderFunctionArgs) => {
  try {
    return await loadOnSiteAnswers(request)
  } catch (e) {
    console.error(e)
    throw new Response('Could not fetch all articles', {status: 500})
  }
}
type Data = ReturnType<typeof loader>

export function fetchAllQuestionsOnSite() {
  const url = `/questions/allQuestionsOnSite`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<Data> = await response.json()
    const backgroundPromiseIfReloaded: Data | Promise<void> = reloadInBackgroundIfNeeded(
      url,
      timestamp
    )

    return {data, backgroundPromiseIfReloaded}
  })
}
