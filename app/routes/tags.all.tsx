import {LoaderFunction} from '@remix-run/cloudflare'
import {loadTags} from '~/server-utils/stampy'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const loader = async ({request, params}: Parameters<LoaderFunction>[0]) => {
  const {data: tags, timestamp} = await loadTags(request)

  const tagId = params['*'] && params['*'].split('/')[0]
  const currentTag = tagId ? tags.find(({tagId: checkedId, name}) => [checkedId.toString(), name].includes(tagId)) : tags[0]

  if (currentTag === undefined) {
    throw new Response(null, {
      status: 404,
      statusText: 'Unable to find requested tag',
    })
  }

  return {data: {tags, currentTag}, timestamp}
}

export const fetchTags = () => {
  const url = `/tags/all`
  return fetch(url).then(async (response) => {
    const json: Awaited<ReturnType<typeof loader>> = await response.json()
    if ('error' in json) console.error(json.error)
    const {data, timestamp} = json

    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}
