import {LoaderFunction} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadGlossary} from '~/server-utils/stampy'

export const loader: LoaderFunction = async ({request}) => {
  return await loadGlossary(request)
}

export function fetchGlossary() {
  const url = `/questions/glossary`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<ReturnType<typeof loader>> = await response.json()
    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}
