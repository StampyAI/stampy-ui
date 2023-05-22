import type {ActionArgs} from '@remix-run/cloudflare'

export const action = async ({request}: ActionArgs) => {
  const {query, name, type} = await request.json()
  const url = `${NLP_SEARCH_ENDPOINT}/api/log_query?name=${name}&type=${type}&query=${query}`
  return await fetch(url)
}
