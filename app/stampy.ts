import {parse} from 'node-html-parser'

export type QuestionState = '_' | '-' | 'r'
export type Question = {
  title: string
  pageid: number
  text: string | null
  answerEditLink: string | null
  relatedQuestions: {title: string; pageid?: number}[]
  questionState?: QuestionState
}
type QueryResults = {
  query: {
    results: {
      [key in string]: {
        printouts: {
          [key in string]: {
            fulltext: string
          }[]
        }
      }
    }
  }
}

const reQuestion = /{{[^|]+\|([^}]+)}}/g
const answerEditLinkBase = 'https://stampy.ai/w/index.php?action=formedit&title='

const stampyParse = (page: string) => {
  const prop = page.match(/^\d+$/) ? 'pageid' : 'page'
  return `https://stampy.ai/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects&${prop}=${page}`
}

const stampyQueryAll = (idsOrTitles: string[] | number[]) => {
  const prop = typeof idsOrTitles[0] === 'number' ? 'pageids' : 'titles'
  const value = idsOrTitles.join('|')
  return `https://stampy.ai/w/api.php?action=query&format=json&formatversion=2&${prop}=${value}`
}

const stampyQueryContent = (title: string) =>
  `https://stampy.ai/w/api.php?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=*&titles=${title}`

const stampyAsk = (query: string) =>
  `https://stampy.ai/w/api.php?action=ask&format=json&formatversion=2&query=${query}`

const getAnswer = (html: string): {answerText: string; answerEditLink: string | undefined} => {
  const root = parse(html)
  const answerEl = root.getElementById('canonicalanswer')
  return {
    answerText: answerEl?.toString() ?? '<p>¯\\_(ツ)_/¯</p>',
    answerEditLink: answerEl?.previousElementSibling
      .querySelector('a')
      ?.getAttribute('href')
      ?.replace('/wiki/', answerEditLinkBase),
  }
}

const normalizeWikiLinks = (html: string): string =>
  html.replace(/href="\/wiki/g, 'href="https://stampy.ai/read')

const getRelatedQuestions = (html: string): {title: string; pageid: number}[] => {
  if (!html.includes('Related_questionsedit')) return []
  const root = parse(html)
  const links = root
    .querySelector('#Related_questionsedit')
    ?.parentNode.nextElementSibling.querySelectorAll('li')
    .map((li) => ({
      title: li.querySelector('a:not(.new)')?.innerText ?? '', // ignore red links with class new
      pageid: Number(li.querySelector('div[style*="display: none"]')?.innerText),
    }))

  return links ?? []
}

const getHtml = async (page: string) => {
  let data: Question & {text: string}
  const url = stampyParse(page)
  let json
  try {
    json = await (await fetch(url)).json()
    const {
      parse: {title, pageid, text},
    } = json
    const {answerText = text, answerEditLink = null} = text.match(/canonicalanswer/)
      ? getAnswer(text)
      : {}
    data = {
      title,
      pageid,
      text: normalizeWikiLinks(answerText),
      answerEditLink,
      relatedQuestions: getRelatedQuestions(text),
    }
  } catch (e: any) {
    e.message = `\n>>> Error fetching ${url}:\n${JSON.stringify(json, null, 2)}\n<<< ${e.message}`
    throw e
  }

  return data
}

const getMetadata = async (
  idsOrTitles: string[] | number[]
): Promise<{title: string; pageid: number}[]> => {
  if (idsOrTitles.length === 0) return []
  const {query} = await (await fetch(stampyQueryAll(idsOrTitles))).json()
  return query.pages
}

const getContent = async (title: string): Promise<string> => {
  const {query} = await (await fetch(stampyQueryContent(title))).json()
  const content = query.pages?.[0].revisions?.[0].slots.main.content?.replace(
    /<!--[\w\W]*?-->/g,
    ''
  )

  return content
}

export const getQuestionDetail = (question: string) => getHtml(question)

export const getInitialQuestions = async () => {
  const initialContent = await getContent('Initial questions')
  const questions = initialContent?.match(reQuestion)?.map((x) => x.replace(reQuestion, '$1')) ?? []
  const pageidByTitle = Object.fromEntries(
    (await getMetadata(questions)).map(({title, pageid}) => [title, pageid])
  )

  const data: Question[] = []
  for (const title of questions) {
    const pageid = pageidByTitle[title]
    data.push({
      title,
      pageid,
      text: null,
      answerEditLink: null,
      relatedQuestions: [],
    })
  }

  return data
}

export async function getAskPrintouts(queryString: `[[${string}]]|?${string}`): Promise<string[]> {
  const {query} = (await (await fetch(stampyAsk(queryString))).json()) as QueryResults
  const {results = {}} = query
  const {printouts = {}} = Object.values(results)[0] ?? {}
  const printoutsList = Object.values(printouts)[0] ?? []
  return printoutsList.map(({fulltext}) => fulltext)
}

export async function getAllCanonicallyAnsweredQuestions(): Promise<string[]> {
  return getAskPrintouts('[[Canonically answered questions]]|?CanonicalQuestions')
}
