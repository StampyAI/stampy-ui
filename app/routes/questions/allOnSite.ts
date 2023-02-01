import type {LoaderFunction} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadOnSiteAnswers} from '~/server-utils/stampy'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  return await loadOnSiteAnswers(request)
}

export function fetchOnSiteAnswers() {
  const url = `/questions/allOnSite`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<ReturnType<typeof loader>> = await response.json()
    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}
