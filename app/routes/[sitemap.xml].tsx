import {LoaderFunctionArgs} from '@remix-run/cloudflare'
import {loadAllQuestions, QuestionStatus, Question} from '~/server-utils/stampy'
import {questionUrl} from '~/routesMapper'

export const loader = async ({request}: LoaderFunctionArgs) => {
  const origin = new URL(request.url).origin
  const formatQuestion = (question: Question) => `
    <url>
      <loc>${origin}${questionUrl(question)}</loc>
      <lastmod>${question.updatedAt}</lastmod>
      <priority>1.0</priority>
    </url>
    `
  const {data} = await loadAllQuestions(request)

  const urls = data.filter((q) => q.status == QuestionStatus.LIVE_ON_SITE).map(formatQuestion)
  const content = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join(
    '\n'
  )}</urlset>`
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  })
}
