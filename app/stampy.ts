// PoC version to load dynamic content, not trying to solve all edge cases
// TODO: use API from Python server that will handle MediaWiki APIs and semantic search queries

import fetch from '~/fetchWithCache'

const reQuestion = /{{[^|]+\|([^}]+)}}/g
const reRedirect = /#REDIRECT \[\[([^\]]+)\]\]/
const reAnswerTitle = /canonicalanswer=([^|}]+)/
const reAnswerText = /answer=([^|}]+)/
const reLinkInternal = /\[\[([^\]]+)\]\]/g
const reLinkExternal = /\[(\S+)\s+([^\]]+)\]/g

const parseWikiToHtml = (wiki: string) =>
  wiki
    .replace(reLinkInternal, '<a href="https://stampy.ai/read/$1">$1</a>')
    .replace(reLinkExternal, '<a href="$1">$2</a>')

const stampyQuery = (title: string) =>
  `https://stampy.ai/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=*&titles=${title}&format=json&formatversion=2`

const getContent = async (title: string): Promise<string> => {
  let content = (
    await (await fetch(stampyQuery(title))).json()
  ).query.pages[0].revisions[0].slots.main.content.replace(/<!--[\w\W]*?-->/g, '')
  const redirect = content.match(reRedirect)?.[1]
  if (redirect) {
    content = await getContent(redirect)
  }
  return content
}

export const getInitialQuestions = async () => {
  const initialContent = await getContent('Initial questions')
  const questionList =
    initialContent.match(reQuestion)?.map((x) => x.replace(reQuestion, '$1')) ?? []
  const qaList = await Promise.all(
    questionList.map(async (question, i) => {
      const questionContent = await getContent(question)
      const answerTitle = questionContent.match(reAnswerTitle)?.[1]
      const answerContent = answerTitle ? await getContent(answerTitle) : ''
      const answerText = answerContent.match(reAnswerText)?.[1]
      const answerHtml = answerText && parseWikiToHtml(answerText)

      return {
        question,
        questionContent,
        answerContent,
        answerHtml,
      }
    })
  )

  return qaList
}
