// PoC version to load dynamic content, not trying to solve all edge cases
// TODO: use API from Python server that will handle MediaWiki APIs and semantic search queries

import fetch from '~/fetchWithCache'

const reQuestion = /{{[^|]+\|([^}]+)}}/g
const reRedirect = /#REDIRECT \[\[([^\]]+)\]\]/

const stampyParse = (page: string) =>
  // TODO: try to use only &section=1 (if we add sections to some template)
  `https://stampy.ai/w/api.php?action=parse&page=${page}&redirects&prop=text&format=json&formatversion=2`

const stampyQuery = (title: string) =>
  `https://stampy.ai/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=*&titles=${title}&format=json&formatversion=2`

const getHtml = async (page: string): Promise<{title: string; pageid: number; text: string}> => {
  const {parse} = await (await fetch(stampyParse(page))).json()
  return parse
}

const getContent = async (title: string): Promise<string> => {
  const json = await (await fetch(stampyQuery(title))).json()
  let content = json.query.pages?.[0].revisions?.[0].slots.main.content?.replace(
    /<!--[\w\W]*?-->/g,
    ''
  )
  const redirect = content?.match(reRedirect)?.[1]
  if (redirect) {
    content = await getContent(redirect)
  }
  if (!content) {
    content = JSON.stringify(json)
  }
  return content
}

export const getIntro = async () => (await getHtml('UI intro')).text

export const getQuestionDetail = (question: string) => getHtml(question)

export const getInitialQuestions = async () => {
  const initialContent = await getContent('Initial questions')
  const [firstQuestion, ...otherQuestions] =
    initialContent?.match(reQuestion)?.map((x) => x.replace(reQuestion, '$1')) ?? []
  const qaList: {
    question: string
    title?: string
    pageid?: number
    text?: string
  }[] = [
    {
      question: firstQuestion,
      ...(await getQuestionDetail(firstQuestion)),
    },
    ...otherQuestions.map((question) => ({question})),
  ]

  return qaList
}
