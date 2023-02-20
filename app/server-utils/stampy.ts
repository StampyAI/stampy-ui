import {withCache} from '~/server-utils/kv-cache'
import MarkdownIt from 'markdown-it'
import MarkdownItFootnote from 'markdown-it-footnote'

export enum QuestionState {
  OPEN = '_',
  COLLAPSED = '-',
  RELATED = 'r',
}
export type RelatedQuestions = {title: string; pageid: string}[]
export enum QuestionStatus {
  WITHDRAWN = 'Withdrawn',
  SKETCH = 'Bulletpoint sketch',
  TO_DELETE = 'Marked for deletion',
  UNCATEGORIZED = 'Uncategorized',
  NOT_STARTED = 'Not started',
  IN_PROGRESS = 'In progress',
  IN_REVIEW = 'In review',
  LIVE = 'Live on site',
  UNKNOWN = 'Unknown',
}
export type Tag = {
  rowId: string
  tagId: number
  name: string
  url: string
  internal: boolean
  questions: RelatedQuestions
  mainQuestion: string | null
}
export type Question = {
  title: string
  pageid: string
  text: string | null
  answerEditLink: string | null
  relatedQuestions: RelatedQuestions
  questionState?: QuestionState
  tags: string[]
  status?: QuestionStatus
}
export type PageId = Question['pageid']
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
    Link: {
      '@context': string
      '@type': string
      url: string
    }
    Status: Entity
    'UI ID': string
    'Alternate Phrasings': string
    'Related Answers': '' | Entity[]
    'Related IDs': '' | string[]
    Tags: '' | Entity[]
    'Rich Text': string

    'Tag ID': number
    'Internal?': boolean
    'Questions tagged with this': Entity[]
    'Main question': string | Entity | null
  }
}
type CodaResponse = {
  items: CodaRow[]
  nextPageLink: string | null
}

const CODA_DOC_ID = 'fau7sl2hmG'

// Use table ide, rather than names, in case of renames
const QUESTION_DETAILS_TABLE = 'grid-sync-1059-File' // Answers
const INITIAL_QUESTIONS_TABLE = 'table-yWog6qRzV4' // Initial questions
const ON_SITE_TABLE = 'table-aOTSHIz_mN' // On-site answers
const ALL_ANSWERS_TABLE = 'table-YvPEyAXl8a' // All answers
const INCOMING_QUESTIONS_TABLE = 'grid-S_6SYj6Tjm' // Incoming questions
const TAGS_TABLE = 'grid-4uOTjz1Rkz'
const WRITES_TABLE = 'table-eEhx2YPsBE'

const enc = encodeURIComponent
const quote = (x: string) => encodeURIComponent(`"${x.replace(/"/g, '\\"')}"`)

const sendToCoda = async (
  url: string,
  payload: any,
  method = 'POST',
  token = `${CODA_WRITES_TOKEN}`
) => {
  const params: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  if (method != 'GET') params.body = JSON.stringify(payload)
  return await fetchJson(url, params)
}

export const fetchJson = async (url: string, params?: RequestInit) => {
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

export const fetchJsonList = async (url: string, params?: RequestInit) => {
  const json = await fetchJson(url, params)
  if (!json.items || json.items.length === 0) {
    throw Error(`Empty response for ${url}`)
  }
  return json
}

/**
   Coda has limits on how many rows can be returned at once (default is 200).
   This function will keep on fetching pages until it has downloaded all items
   that match the given url.
   Any errors will cause the whole chain to abort.
 **/
const fetchRows = async (url: string): Promise<CodaResponse> => {
  const json = await fetchJsonList(url, {headers: {Authorization: `Bearer ${CODA_TOKEN}`}})
  return {nextPageLink: json.nextPageLink, items: json.items}
}
const paginateCoda = async (url: string): Promise<CodaRow[]> => {
  const {nextPageLink, items} = await fetchRows(url)

  if (nextPageLink) {
    return items.concat(await paginateCoda(nextPageLink))
  }
  return items
}

type CodaRequest = {
  table: string
  queryColumn?: string
  queryValue?: string
  limit?: number
}
const makeCodaRequest = ({table, queryColumn, queryValue, limit}: CodaRequest): string => {
  let params = `useColumnNames=true&sortBy=natural&valueFormat=rich${
    queryColumn && queryValue ? `&query=${quote(queryColumn)}:${quote(queryValue)}` : ''
  }`
  if (limit) {
    params = `${params}&limit=${limit}`
  }
  return `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows?${params}`
}

const getCodaRows = async (
  table: string,
  queryColumn?: string,
  queryValue?: string
): Promise<CodaRow[]> => paginateCoda(makeCodaRequest({table, queryColumn, queryValue}))

const md = new MarkdownIt({html: true}).use(MarkdownItFootnote)
/*
 * Transform the Coda markdown into HTML
 */
const renderText = (text: string | null): string | null => {
  if (text === null) return null

  let contents = extractText(text)

  // Recursively wrap any [See more...] segments in HTML Details
  const wrapInDetails = ([chunk, ...rest]: string[]): string => {
    if (!rest || rest.length == 0) return chunk
    return `${chunk}
           <details>
             <summary>See more...</summary>
             ${wrapInDetails(rest)}
           </details>`
  }
  contents = contents.split(/\[[Ss]ee more\W*?\]/).map((i: string) => md.render(i))
  return wrapInDetails(contents)
}

// Sometimes string fields are returned as lists. This can happen when there are duplicate entries in Coda
const head = (item: any) => {
  if (Array.isArray(item)) return item[0]
  return item
}
const extractText = (markdown: string) => head(markdown)?.replace(/^```|```$/g, '')
const extractLink = (markdown: string) => markdown?.replace(/^.*\(|\)/g, '')
const convertToQuestion = (title: string, v: CodaRow['values']): Question => ({
  title,
  pageid: extractText(v['UI ID']),
  text: renderText(v['Rich Text']),
  answerEditLink: extractLink(v['Edit Answer']).replace(/\?.*$/, ''),
  tags: ((v['Tags'] || []) as Entity[]).map((e) => e.name),
  relatedQuestions:
    v['Related Answers'] && v['Related IDs']
      ? v['Related Answers'].map(({name}, i) => ({
          title: name,
          pageid: extractText(v['Related IDs'][i]),
        }))
      : [],
  status: v['Status']?.name as QuestionStatus,
})

export const loadQuestionDetail = withCache('questionDetail', async (question: string) => {
  const rows = await getCodaRows(
    QUESTION_DETAILS_TABLE,
    // ids are now alphanumerical, so not possible to detect id by regex match for \d
    // let's detect ids by length, hopefully no one will make question name so short
    question.length <= 6 ? 'UI ID' : 'Name',
    question
  )
  return convertToQuestion(rows[0].name, rows[0].values)
})

export const loadInitialQuestions = withCache('initialQuestions', async () => {
  const rows = await getCodaRows(INITIAL_QUESTIONS_TABLE)
  const data = rows.map(({name, values}) => convertToQuestion(name, values))
  return data
})

export const loadOnSiteAnswers = withCache('onSiteAnswers', async () => {
  const rows = await getCodaRows(ON_SITE_TABLE)
  const questions = rows.map(({name, values}) => convertToQuestion(name, values))
  return {questions, nextPageLink: null}
})

export const loadAllQuestions = withCache('allQuestions', async () => {
  const rows = await getCodaRows(ALL_ANSWERS_TABLE)
  return rows.map((r) => convertToQuestion(r.name, r.values))
})

const extractMainQuestion = (question: string | Entity | null): string | null => {
  switch (typeof question) {
    case 'string':
      return extractText(question)
    case 'object':
      return question?.name || null
    default:
      return question
  }
}
const toTag = (r: CodaRow, nameToId: Record<string, string>): Tag => ({
  rowId: r.id,
  tagId: r.values['Tag ID'],
  name: r.name,
  url: r.browserLink,
  internal: r.values['Internal?'],
  questions: r.values['Questions tagged with this']
    .map(({name}) => ({title: name, pageid: nameToId[name]}))
    .filter((q) => q.pageid),
  mainQuestion: extractMainQuestion(r.values['Main question']),
})

export const loadTag = withCache('tag', async (tagName: string): Promise<Tag> => {
  const rows = await getCodaRows(TAGS_TABLE, 'Tag name', tagName)

  const questions = await loadAllQuestions()
  const nameToId = Object.fromEntries(
    questions.data.filter((q) => q.status == QuestionStatus.LIVE).map((q) => [q.title, q.pageid])
  )
  return toTag(rows[0], nameToId)
})

export const loadMoreQuestions = withCache(
  'loadMoreQuestions',
  async (
    nextPageLink: string | null
  ): Promise<{questions: Question[]; nextPageLink: string | null}> => {
    const url = nextPageLink || makeCodaRequest({table: ON_SITE_TABLE, limit: 10})
    const result = await fetchRows(url)
    const questions = result.items.map(({name, values}) => convertToQuestion(name, values))
    return {nextPageLink: result.nextPageLink, questions}
  }
)

export const insertRows = async (table: string, rows: NewQuestion[]) => {
  const url = `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows`
  const payload = {
    rows: rows.map((row) => ({
      cells: [
        {column: 'Question', value: row.title},
        {column: 'Possible Duplicates', value: row.relatedQuestions.map(({title}) => title)},
        {column: 'Source', value: row.source || 'UI'},
      ],
    })),
  }
  return await sendToCoda(url, payload, 'POST', `${CODA_INCOMING_TOKEN}`)
}

export const addQuestion = async (title: string, relatedQuestions: RelatedQuestions) => {
  return await insertRows(INCOMING_QUESTIONS_TABLE, [{title, relatedQuestions}])
}

export const likeQuestion = async (pageid: PageId, incBy: number) => {
  const table = WRITES_TABLE
  const currentRowUrl = makeCodaRequest({table, queryColumn: 'UI ID', queryValue: pageid})
  const current = await sendToCoda(currentRowUrl, '', 'GET')

  const row = current?.items && current?.items[0]
  if (!row) return 'Nothing found'

  const url = `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows/${enc(row.id)}`
  const payload = {
    row: {
      cells: [{column: 'Helpful', value: (row.values.Helpful || 0) + incBy}],
    },
  }
  const result = await sendToCoda(url, payload, 'PUT')
  return result.id ? 'ok' : result
}
