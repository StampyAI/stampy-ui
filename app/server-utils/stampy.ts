import {withCache} from '~/server-utils/kv-cache'
import {Converter} from 'showdown'

export type QuestionState = '_' | '-' | 'r'
export type RelatedQuestions = {title: string; pageid?: number}[]
export type Question = {
  title: string
  pageid: number
  text: string | null
  answerEditLink: string | null
  relatedQuestions: RelatedQuestions
  questionState?: QuestionState
}
export type NewQuestion = {
  title: string
  relatedQuestions: RelatedQuestions
  source?: string
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

// Use table ide, rather than names, in case of renames
const QUESTION_DETAILS_TABLE = 'grid-sync-1059-File' // Answers
const INITIAL_QUESTIONS_TABLE = 'table-yWog6qRzV4' // Initial questions
const ON_SITE_TABLE = 'table-1Q8_MjxUes' // On-site answers
const ALL_ANSWERS_TABLE = 'table-YvPEyAXl8a' // All answers
const INCOMING_QUESTIONS_TABLE = 'grid-S_6SYj6Tjm' // Incoming questions

const enc = encodeURIComponent
const quote = (x: string) => encodeURIComponent(`"${x.replace(/"/g, '\\"')}"`)

export const fetchJson = async (url: string, params?: Record<string, any>) => {
  let json
  try {
    json = await (await fetch(url, params)).json()
  } catch (e: any) {
    // forward debug message to HTTP Response
    e.message = `\n>>> Error fetching ${url}:\n${JSON.stringify(json, null, 2)}\n<<< ${e.message}`
    throw e
  }
  return json
}

export const fetchJsonList = async (url: string, params?: Record<string, any>) => {
  const json = await fetchJson(url, params)
  if (!json.items || json.items.length === 0) {
    throw Error('Empty response')
  }
  return json
}

/**
   Coda has limits on how many rows can be returned at once (default is 200).
   This function will keep on fetching pages until it has downloaded all items
   that match the given url.
   Any errors will cause the whole chain to abort.
 **/
const paginateCoda = async (url: string): Promise<CodaRow[]> => {
  const json = await fetchJsonList(url, {headers: {Authorization: `Bearer ${CODA_TOKEN}`}})

  if (json.nextPageLink) {
    return json.items.concat(await paginateCoda(json.nextPageLink))
  }
  return json.items
}

const getCodaRows = async (
  table: string,
  queryColumn?: string,
  queryValue?: string
): Promise<CodaRow[]> => {
  const params = `useColumnNames=true&sortBy=natural&valueFormat=rich${
    queryColumn && queryValue ? `&query=${quote(queryColumn)}:${quote(queryValue)}` : ''
  }`
  const url = `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows?${params}`

  return paginateCoda(url)
}

const mdConverter = new Converter()
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
  const rows = await getCodaRows(
    QUESTION_DETAILS_TABLE,
    question.match(/^\d+$/) ? 'UI ID' : 'Name',
    question
  )
  return convertToQuestion(rows[0].name, rows[0].values)
})

export const loadInitialQuestions = withCache('initialQuestions', async () => {
  const rows = await getCodaRows(INITIAL_QUESTIONS_TABLE)
  const data = rows.map(({name, values}) => convertToQuestion(name, values))
  return data
})

export const loadAllCanonicallyAnsweredQuestions = withCache(
  'canonicallyAnsweredQuestions',
  async () => {
    const rows = await getCodaRows(ON_SITE_TABLE)
    const data = rows.map(({name, values}) => ({
      pageid: values['UI ID'],
      title: name,
    }))
    return data
  }
)

export const loadAllQuestions = withCache('allQuestions', async () => {
  const rows = await getCodaRows(ALL_ANSWERS_TABLE)
  return rows.map(({name}) => name)
})

export const insertRows = async (table: string, rows: NewQuestion[]) => {
  const url = `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows`
  const payload = {
    rows: rows.map((row) => ({
      cells: [
        {column: 'Question', value: row.title},
        {column: 'Possible matches', value: row.relatedQuestions.map(({title}) => title)},
        {column: 'Source', value: row.source || 'UI'},
      ],
    })),
  }
  const params = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CODA_INCOMING_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }

  return await fetchJson(url, params)
}

export const addQuestion = async (title: string, relatedQuestions: RelatedQuestions) => {
  return await insertRows(INCOMING_QUESTIONS_TABLE, [{title, relatedQuestions}])
}
