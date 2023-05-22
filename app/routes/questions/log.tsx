import type {ActionArgs} from '@remix-run/cloudflare'

export const action = async ({request}: ActionArgs) => {
  const {query, name} = await request.json()
  return await fetch(
    `https://stampy-nlp-t6p37v2uia-uw.a.run.app/api/log_query?name=${name}&type=UI&query=${query}`
  )
}
