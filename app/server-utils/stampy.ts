import {parse} from 'node-html-parser'
import {RawSearchableItem} from '~/components/search'
import {withCache} from '~/server-utils/kv-cache'

export type QuestionState = '_' | '-' | 'r'
export type Question = {
  gdocId: string
  shortId: number
  question: string
  answer?: string
  editLink?: string
  relatedQuestions: {shortId: number; gdocId: string; title: string}[]
  questionState?: QuestionState
}

export const loadQuestionDetail = withCache(
  'questionDetail',
  async (gdocId: string): Promise<Question> => {
    const url = `https://docs.google.com/feeds/download/documents/export/Export?exportFormat=html&id=${gdocId}`
    const editLink = `https://docs.google.com/document/d/${gdocId}`
    let data: Question

    try {
      const response = await fetch(url)
      const filename = response.headers
        .get('content-disposition')
        ?.replace(/^.*filename\*=UTF-8''|\.html$/g, '')
      const question = decodeURIComponent(filename ?? '¯\\_(ツ)_/¯')
      const html = await response.text()
      const root = parse(html)
      const style = (root.querySelector('style')?.outerHTML ?? '')
        .replace(/(?<=\})\w+\{[^}]+\}/g, '')
        .replace(/\b(?:color|background|font-family|font-size).+?;/g, '')
      const body = root.querySelector('body')?.innerHTML ?? ''
      const answer = `<div>${style}${body}</div>`

      data = {
        gdocId,
        shortId: 666,
        question,
        answer,
        editLink,
        relatedQuestions: [],
      }
    } catch (e: any) {
      e.message = `\n>>> Error fetching ${url}:\n<<< ${e.message}`
      throw e
    }

    return data
  }
)

export const loadInitialQuestions = withCache(
  'initialQuestions',
  async (): Promise<Question[]> => [
    {
      gdocId: '10g6U9SL0CBy__wCBTib7_WhB3S3aaFt7Fx1vVgCzg2I',
      shortId: 666,
      question: 'What even is a question?',
      relatedQuestions: [],
    },
  ]
)

export const loadAllCanonicallyAnsweredQuestions = withCache(
  'canonicallyAnsweredQuestions',
  async (): Promise<RawSearchableItem[]> => [
    {
      title: 'there is no search yet',
      gdocId: '1Ack1CQXV4EPtpp3-oKnCzmxKh8eQ91x-zkgN7PH4UsM',
    },
  ]
)
