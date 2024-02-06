import {wrapCORS} from '../server-utils/responses'
import {LoaderFunctionArgs} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadGlossary} from '~/server-utils/stampy'

export const loader = wrapCORS(async ({request}: LoaderFunctionArgs) => {
  return await loadGlossary(request)
})
type Data = ReturnType<typeof loadGlossary>

export function fetchGlossary() {
  const url = `/questions/glossary`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<Data> = await response.json()
    const backgroundPromiseIfReloaded: Data | Promise<void> = reloadInBackgroundIfNeeded(
      url,
      timestamp
    )

    return {data, backgroundPromiseIfReloaded}
  })
}
