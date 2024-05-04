import type {ActionFunctionArgs} from '@remix-run/cloudflare'
import type {Citation} from '~/hooks/useChat'

const formatCitation = (citation: Citation) => {
  const items = (['title', 'date', 'url', 'source', 'text'] as (keyof Citation)[])
    .map(
      (key) =>
        `\t\t<div>\n\t\t\t<span>${key}</span>\n\t\t\t<span>${citation[key]}</span>\n\t\t</div>`
    )
    .join('\n')
  return `\t<div>\n${items}\n\t</div>`
}
const formatAnswer = (question?: string, answer?: string, citations?: Citation[]) => {
  const formattedCitations = citations?.map(formatCitation).join('\n')
  return `<html>
              <h1 class="question">${question || '<no question>'}</h1>
              <article>
                 <div class="answer">${answer}</div>
                 <div class="citations">${formattedCitations}</div>
              </article>
           </html>`
}

export const action = async ({request}: ActionFunctionArgs) => {
  const {question, answer, citations, type, message, option, pageid} = (await request.json()) as any

  try {
    // Convert the large string content to a Blob
    const fileBlob = new Blob([formatAnswer(question, answer, citations)], {type: 'text/plain'})

    // Prepare the form data
    const formData = new FormData()
    formData.append('file', fileBlob, 'question_and_response.html')

    const info = [
      ['Type', type],
      ['Pageid', pageid && `[${pageid}](https://aisafety.info/questions/${pageid}/${question})`],
      ['Selected option', option],
      ['Feedback', message],
    ]
      .filter(([_, val]) => val && val.trim())
      .map(([item, val]) => `* ${item} - ${val}`)
      .join('\n')
    formData.append('payload_json', JSON.stringify({content: `Chat feedback:\n${info}`}))

    const DISCORD_LOGGING_URL = `https://discord.com/api/webhooks/${DISCORD_LOGGING_CHANNEL_ID}/${DISCORD_LOGGING_TOKEN}`
    const response = await fetch(`${DISCORD_LOGGING_URL}`, {method: 'POST', body: formData})
    if (!response.ok) {
      throw new Error(`Failed to post message: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error('Failed to post message:', error)
  }
  return null
}
