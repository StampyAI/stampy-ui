import {withCache} from '~/server-utils/kv-cache'
import {Converter} from 'showdown'

export type QuestionState = '_' | '-' | 'r'
export type Question = {
  title: string
  pageid: number
  text: string | null
  answerEditLink: string | null
  relatedQuestions: {title: string; pageid?: number}[]
  questionState?: QuestionState
}
type Entity = {
  '@context': string
  '@type': string
  additionalType: string
  name: string
  url: string
  tableId: string
  rowId: string
  tableUrl: string
}
type CodaRow = {
  id: string
  type: string
  href: string
  name: string
  index: number
  createdAt: string
  updatedAt: string
  browserLink: string
  values: {
    'Edit Answer': string
    'Initial order': number
    Link: {
      '@context': string
      '@type': string
      url: string
    }
    'UI ID': number
    'Alternate phrasings': string
    'Related answers': '' | Entity[]
    'Related IDs': '' | number[]
    Tags: '' | Entity[]
    'All Phrasings': string
    Name: string
    'Rich Text': string
  }
}

const CODA_DOC_ID = 'fau7sl2hmG'

const enc = encodeURIComponent
const quote = (x: string) => encodeURIComponent(`"${x.replace(/"/g, '\\"')}"`)
const getCodaRows = async (
  table: string,
  queryColumn?: string,
  queryValue?: string
): Promise<CodaRow[]> => {
  const params = `useColumnNames=true&sortBy=natural&valueFormat=rich${
    queryColumn && queryValue ? `&query=${quote(queryColumn)}:${quote(queryValue)}` : ''
  }`
  const url = `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows?${params}`

  let json
  try {
    json = await (await fetch(url, {headers: {Authorization: `Bearer ${CODA_TOKEN}`}})).json()

    if (!json.items || json.items.length === 0) {
      throw Error('Empty response')
    }
  } catch (e: any) {
    // forward debug message to HTTP Response
    e.message = `\n>>> Error fetching ${url}:\n${JSON.stringify(json, null, 2)}\n<<< ${e.message}`
    throw e
  }

  return json.items
}

const mdConverter = new Converter()
const extractText = (markdown: string) => markdown?.replace(/```/g, '')
const extractLink = (markdown: string) => markdown?.replace(/^.*\(|\)/g, '')
const convertToQuestion = (title: string, v: CodaRow['values']): Question => ({
  title,
  pageid: v['UI ID'],
  text: mdConverter.makeHtml(v['Rich Text']),
  answerEditLink: extractLink(v['Edit Answer']),
  relatedQuestions: v['Related answers']
    ? v['Related answers'].map(({name}, i) => ({
        title: name,
        pageid: v['Related IDs'] ? v['Related IDs'][i] : undefined,
      }))
    : [],
})

export const loadQuestionDetail = withCache('questionDetail', async (question: string) => {
  const rows = await getCodaRows('Answers', question.match(/^\d+$/) ? 'UI ID' : 'Name', question)
  return convertToQuestion(rows[0].name, rows[0].values)
})

export const loadInitialQuestions = withCache('initialQuestions', async () => {
  const rows = await getCodaRows('Initial questions')
  const data = rows.map(({name, values}) => convertToQuestion(name, values))
  return data
})

export const loadAllCanonicallyAnsweredQuestions = withCache('canonicallyAnsweredQuestions', async () => {
  const rows = await getCodaRows('All on-site answers')
  const data = rows.map(({name}) => name)
  return data
})
