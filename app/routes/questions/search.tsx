import type {LoaderFunction} from '@remix-run/cloudflare'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const url = new URL(request.url)
  const question = url.searchParams.get('question')

  if (!question) return []

  return await search(question)
}

export function search(question: string) {
  const url = `${NLP_SEARCH_ENDPOINT}/api/search?query=${question}&top=5`
  return fetch(url).then(async (response) => {
    const results = await response.json()
    // Manually filter out questions that are live on site. This will be done via the NLP endpoint at some point
    return results.filter(({status}: {status: string}) => status != 'Live on site')
  })
}
