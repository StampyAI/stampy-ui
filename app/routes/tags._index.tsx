import type {LoaderFunction} from '@remix-run/cloudflare'
import {redirect} from '@remix-run/cloudflare'
import {loadTags} from '~/server-utils/stampy'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  const tags = await loadTags(request)
  const {data = []} = tags ?? {}
  const defaultTag = data[0]
  throw redirect(`${defaultTag.name}`)
}
