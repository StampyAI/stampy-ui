import {LoaderArgs} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadAllQuestions, Question, PageId} from '~/server-utils/stampy'

const MAX_LEVELS = 3

export type TOCItem = {
  title: string
  subtitle?: string
  pageid: PageId
  icon?: string
  hasText: boolean
  children?: TOCItem[]
}
type LoaderResp = {
  data: TOCItem[]
  timestamp: string
}

const formatQuestion =
  (level: number) =>
  ({title, pageid, subtitle, icon, children, text}: Question): TOCItem => ({
    title,
    subtitle: subtitle ? subtitle : undefined,
    pageid,
    icon: icon ? icon : undefined,
    hasText: !!text,
    children: level < MAX_LEVELS ? children?.map(formatQuestion(level + 1)) : undefined,
  })

export const loader = async ({request}: LoaderArgs): Promise<LoaderResp> => {
  const {data, timestamp} = await loadAllQuestions(request)
  const items = data.reduce((acc, item) => ({...acc, [item.title]: item}), {}) as {
    [k: string]: Question
  }
  data
    .filter(({parents}) => parents && parents.length > 0)
    .forEach((item) => {
      item?.parents?.forEach((name) => {
        const parent = items[name]
        if (!parent.children) {
          parent['children'] = []
        }
        parent.children.push(item)
      })
    })
  return {
    data: data
      .filter(({parents, children}) => parents && parents.length === 0 && children)
      .map(formatQuestion(1)),
    timestamp,
  }
}

export function fetchTOC() {
  const url = `/questions/toc`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<LoaderResp> = await response.json()
    const backgroundPromiseIfReloaded: LoaderResp | Promise<void> = reloadInBackgroundIfNeeded(
      url,
      timestamp
    )

    return {data, backgroundPromiseIfReloaded}
  })
}
