import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadGlossary} from '~/server-utils/stampy'

export const loader = async () => {
  return await loadGlossary()
}

export function fetchGlossary() {
  const url = `/questions/glossary`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<ReturnType<typeof loader>> = await response.json()
    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}
