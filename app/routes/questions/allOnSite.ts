import type {LoaderFunction} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadOnSiteAnswers, loadMoreQuestions} from '~/server-utils/stampy'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const searchParams = new URL(request.url).searchParams
  const nextPage = searchParams.get('nextPage')
  if (nextPage !== null) {
    return await loadMoreQuestions(request, nextPage || null)
  }
  return await loadOnSiteAnswers(request)
}

export function fetchOnSiteAnswers(nextPage: string | undefined) {
  let url = `/questions/allOnSite`
  if (nextPage !== undefined) {
    url = `${url}?nextPage=${nextPage || ''}`
  }
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<ReturnType<typeof loader>> = await response.json()
    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}
