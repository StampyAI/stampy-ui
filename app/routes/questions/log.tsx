import type {ActionFunction} from '@remix-run/cloudflare'

export const action = async ({request}: Parameters<ActionFunction>[0]) => {
    const {query, name, type} = (await request.json()) as any
  const url = `${NLP_SEARCH_ENDPOINT}/api/log_query?name=${name}&type=${type}&query=${query}`
  return await fetch(url)
}
