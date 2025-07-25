import type {LoaderFunction} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadAllQuestions, Question, PageId, QuestionStatus} from '~/server-utils/stampy'

const MAX_LEVELS = 3
export const BASIC = 'Basic'
export const ADVANCED = 'Advanced'

export type Category = typeof BASIC | typeof ADVANCED | undefined

export type TOCItem = {
  title: string
  subtitle?: string
  pageid: PageId
  icon?: string
  hasText: boolean
  children?: TOCItem[]
  category?: Category
  order: number
  ttr: number
}
type LoaderResp = {
  data: {
    toc: TOCItem[]
    visible: TOCItem[]
  }
  timestamp: string
}

const getCategory = (tags: string[]): Category => {
  if (!tags) return undefined
  if (tags.includes(BASIC)) return BASIC
  if (tags.includes(ADVANCED)) return ADVANCED
  return undefined
}

const byOrder = (a: TOCItem, b: TOCItem) => (a.order || Infinity) - (b.order || Infinity)
const formatQuestion =
  (level: number) =>
  ({title, pageid, subtitle, icon, children, text, tags, order, ttr}: Question): TOCItem => ({
    title,
    ttr,
    subtitle: subtitle ? subtitle : undefined,
    pageid,
    icon: icon ? icon : undefined,
    hasText: !!text,
    children:
      level < MAX_LEVELS ? children?.map(formatQuestion(level + 1)).sort(byOrder) : undefined,
    category: getCategory(tags),
    order: order || 0,
  })

const getToc = async (request: any) => {
  try {
    return await loadAllQuestions(request)
  } catch (e) {
    console.error(e)
    throw new Response('Could not fetch table of contents', {status: 500})
  }
}

export const loadToC = async (request: any): Promise<LoaderResp> => {
  const {data, timestamp} = await getToc(request)
  const items = data.reduce((acc, item) => ({...acc, [item.title]: item}), {}) as {
    [k: string]: Question
  }
  const canBeShown = ({status}: Question) =>
    status && [QuestionStatus.LIVE_ON_SITE, QuestionStatus.SUBSECTION].includes(status)

  // Add children to parents
  data
    .filter(canBeShown)
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
    data: {
      toc: data
        .filter(canBeShown)
        .filter(({tags}) => tags?.includes(BASIC) || tags?.includes(ADVANCED))
        .map(formatQuestion(1))
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
      visible: data.filter(canBeShown).map(formatQuestion(1)),
    },
    timestamp,
  }
}
export const loader = async ({request}: Parameters<LoaderFunction>[0]): Promise<LoaderResp> =>
  loadToC(request)

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
