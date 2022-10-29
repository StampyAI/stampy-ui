import type {LoaderFunction} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadAllCanonicallyAnsweredQuestions} from '~/server-utils/stampy'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  return await loadAllCanonicallyAnsweredQuestions(request)
}

export function fetchAllCanonicallyAnsweredQuestions() {
  const url = `/questions/allCanonicallyAnswered`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<ReturnType<typeof loader>> = await response.json()
    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}
