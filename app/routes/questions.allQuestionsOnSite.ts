import {LoaderFunctionArgs} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadOnSiteAnswers} from '~/server-utils/stampy'

export const loader = async ({request}: LoaderFunctionArgs) => {
  return await loadOnSiteAnswers(request)
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
