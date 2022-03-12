// PoC version to load dynamic content, not trying to solve all edge cases
// TODO: use API from Python server that will handle MediaWiki APIs and semantic search queries
import {parse} from 'node-html-parser'

export type Questions = {title: string; pageid: number; text: string | null}[]

const reQuestion = /{{[^|]+\|([^}]+)}}/g

const stampyParse = (page: string) => {
  const prop = page.match(/^\d+$/) ? 'pageid' : 'page'
  // TODO: try to use only &section=1 (if we add sections to some template)
  return `https://stampy.ai/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects&${prop}=${page}`
}

const stampyQueryAll = (idsOrTitles: string[] | number[]) => {
  const prop = typeof idsOrTitles[0] === 'number' ? 'pageids' : 'titles'
  const value = idsOrTitles.join('|')
  return `https://stampy.ai/w/api.php?action=query&format=json&formatversion=2&${prop}=${value}`
}

const stampyQueryContent = (title: string) =>
  `https://stampy.ai/w/api.php?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=*&titles=${title}`

const getAnswer = (html: string): string => {
  const root = parse(html)
  return root.querySelector('#canonicalanswer')?.toString() ?? html
}

const getHtml = async (page: string) => {
  const cached = (await STAMPY_KV.get(page)) as string
  let data: {title: string; pageid: number; text: string}
  if (cached) {
    data = JSON.parse(cached)
  } else {
    const {
      parse: {title, pageid, text},
    } = await (await fetch(stampyParse(page))).json()
    data = {
      title,
      pageid,
      text: text.match('canonicalanswer') ? getAnswer(text) : text,
    }
    await STAMPY_KV.put(page, JSON.stringify(data), {expirationTtl: 600 /* 10 minutes */})
  }

  return data
}

const getMetadata = async (
  idsOrTitles: string[] | number[]
): Promise<[{title: string; pageid: number}]> => {
  const {query} = await (await fetch(stampyQueryAll(idsOrTitles))).json()
  return query.pages
}

const getContent = async (title: string): Promise<string> => {
  const data = await (await fetch(stampyQueryContent(title))).json()
  let content = data.query.pages?.[0].revisions?.[0].slots.main.content?.replace(
    /<!--[\w\W]*?-->/g,
    ''
  )
  if (!content) {
    content = JSON.stringify(data)
  }
  return content
}

export const getIntro = async () => (await getHtml('UI intro')).text

export const getQuestionDetail = (question: string) => getHtml(question)

export const getInitialQuestions = async () => {
  // return stale while revalidate
  let {value: cached, metadata} = await STAMPY_KV.getWithMetadata<{timestamp: string}>(
    '__getInitialQuestions'
  )
  let data: Questions
  if (
    cached &&
    metadata?.timestamp &&
    new Date().getTime() - new Date(metadata.timestamp).getTime() > 1000 * 60 * 10
  ) {
    data = JSON.parse(cached)
    // TODO: find a way to revalidate cache lazily AFTER returning from loader (Cloudflare kills unawaited promises)
    if (!data[0].text) {
      data = await getInitialQuestionsUpdateCache()
    }
  } else {
    data = await getInitialQuestionsUpdateCache()
  }
  return data
}

async function getInitialQuestionsUpdateCache() {
  const initialContent = await getContent('Initial questions')
  const questions = initialContent?.match(reQuestion)?.map((x) => x.replace(reQuestion, '$1')) ?? []
  const pageidByTitle = Object.fromEntries(
    (await getMetadata(questions)).map(({title, pageid}) => [title, pageid])
  )

  const data: Questions = []
  for (let title of questions) {
    const pageid = pageidByTitle[title]
    const cached = await STAMPY_KV.get(pageid.toString())
    let text: Questions[0]['text'] = null
    if (cached) {
      const cachedObj = JSON.parse(cached)
      title = cachedObj.title
      text = cachedObj.text
    }
    data.push({
      title,
      pageid,
      text,
    })
  }

  await STAMPY_KV.put('__getInitialQuestions', JSON.stringify(data), {
    metadata: {timestamp: new Date()},
  })

  return data
}
