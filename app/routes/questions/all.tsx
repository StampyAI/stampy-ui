import type { LoaderFunction } from '@remix-run/cloudflare'
import { reloadInBackgroundIfNeeded } from '~/server-utils/kv-cache'
import { loadAllQuestions } from '~/server-utils/stampy'

export const loader = async ({ request }: Parameters<LoaderFunction>[0]) => {
    return await loadAllQuestions(request)
}

export function fetchAll() {
    const url = `/questions/all`
    return fetch(url).then(async (response) => {
        const { data, timestamp }: Awaited<ReturnType<typeof loader>> = await response.json()
        reloadInBackgroundIfNeeded(url, timestamp)

        return data
    })
}
