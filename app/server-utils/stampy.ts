import {withCache} from '~/server-utils/kv-cache'
import {
  cleanUpDoubleBold,
  externalLinksOnNewTab,
  uniqueFootnotes,
  urlToIframe,
  convertToHtmlAndWrapInDetails,
} from '~/server-utils/parsing-utils'

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
  LIVE_ON_SITE = 'Live on site',
  UNKNOWN = 'Unknown',
}
export type GlossaryEntry = {
  term: string
  pageid: PageId
  contents: string
}
export type Glossary = {
  [key: string]: GlossaryEntry
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
  updatedAt?: string
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
type CodaRowCommon = {
  id: string
  type: string
  href: string
  name: string
  index: number
  createdAt: string
  updatedAt: string
  browserLink: string
}

type AnswersRow = CodaRowCommon & {
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
  }
}
type TagsRow = CodaRowCommon & {
  values: {
    'Tag ID': number
    'Internal?': boolean
    'Questions tagged with this': Entity[]
    'Main question': string | Entity | null
  }
}
type GlossaryRow = CodaRowCommon & {
  values: {
    definition: string
    phrase: string
    aliases: string
    'UI ID': string
  }
}
type CodaRow = AnswersRow | TagsRow | GlossaryRow
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
const GLOSSARY_TABLE = 'grid-_pSzs23jmw'

const enc = encodeURIComponent
const quote = (x: string) => encodeURIComponent(`"${x.replace(/"/g, '\\"')}"`)

const sendToCoda = async (
  url: string,
  payload: unknown,
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
  } catch (e: unknown) {
    // forward debug message to HTTP Response
    if (e && typeof e === 'object' && 'message' in e) {
      e.message = `\n>>> Error fetching ${url}:\n${JSON.stringify(json, null, 2)}\n<<< ${e.message}`
    }
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

/*
 * Transform the Coda markdown into HTML
 */
const renderText = (pageid: PageId, markdown: string | null): string | null => {
  if (!markdown) return null

  markdown = extractText(markdown)
  markdown = urlToIframe(markdown)

  let html = convertToHtmlAndWrapInDetails(markdown)
  html = uniqueFootnotes(html, pageid)
  html = cleanUpDoubleBold(html)
  html = externalLinksOnNewTab(html)

  return html
}

// Sometimes string fields are returned as lists. This can happen when there are duplicate entries in Coda
const head = (item: string | string[]) => {
  if (Array.isArray(item)) return item[0]
  return item
}
const extractText = (markdown: string) => head(markdown)?.replace(/^```|```$/g, '')
const extractLink = (markdown: string) => markdown?.replace(/^.*\(|\)/g, '')
const convertToQuestion = ({name, values, updatedAt} = {} as AnswersRow): Question => ({
  title: name,
  pageid: extractText(values['UI ID']),
  text: renderText(extractText(values['UI ID']), values['Rich Text']),
  answerEditLink: extractLink(values['Edit Answer']).replace(/\?.*$/, ''),
  tags: ((values['Tags'] || []) as Entity[]).map((e) => e.name),
  relatedQuestions:
    values['Related Answers'] && values['Related IDs']
      ? values['Related Answers'].map(({name}, i) => ({
          title: name,
          pageid: extractText(values['Related IDs'][i]),
        }))
      : [],
  status: values['Status']?.name as QuestionStatus,
  updatedAt,
})

export const loadQuestionDetail = withCache('questionDetail', async (question: string) => {
  const rows = (await getCodaRows(
    QUESTION_DETAILS_TABLE,
    // ids are now alphanumerical, so not possible to detect id by regex match for \d
    // let's detect ids by length, hopefully no one will make question name so short
    question.length <= 6 ? 'UI ID' : 'Name',
    question
  )) as AnswersRow[]
  return convertToQuestion(rows[0])
})

export const loadInitialQuestions = withCache('initialQuestions', async () => {
  const rows = (await getCodaRows(INITIAL_QUESTIONS_TABLE)) as AnswersRow[]
  const data = rows.map(convertToQuestion)
  return data
})

export const loadGlossary = withCache('loadGlossary', async () => {
  const rows = (await getCodaRows(GLOSSARY_TABLE)) as GlossaryRow[]
  return Object.fromEntries(
    rows
      .map(({values}) => {
        const pageid = extractText(values['UI ID'])
        const phrases = [values.phrase, ...values.aliases.split('\n')]
        const item = {
          pageid,
          contents: renderText(pageid, extractText(values.definition)),
        }
        return phrases
          .map((i) => extractText(i.toLowerCase()))
          .filter(Boolean)
          .map((phrase) => [phrase, {term: phrase, ...item}])
      })
      .flat()
  )
})

export const loadOnSiteAnswers = withCache('onSiteAnswers', async () => {
  const rows = (await getCodaRows(ON_SITE_TABLE)) as AnswersRow[]
  const questions = rows.map(convertToQuestion)
  return {questions, nextPageLink: null}
})

export const loadAllQuestions = withCache('allQuestions', async () => {
  const rows = (await getCodaRows(ALL_ANSWERS_TABLE)) as AnswersRow[]
  return rows.map(convertToQuestion)
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
const toTag = (r: TagsRow, nameToId: Record<string, string>): Tag => ({
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
  const rows = (await getCodaRows(TAGS_TABLE, 'Tag name', tagName)) as TagsRow[]

  const questions = await loadAllQuestions('NEVER_RELOAD')
  const nameToId = Object.fromEntries(
    questions.data
      .filter((q) => q.status == QuestionStatus.LIVE_ON_SITE)
      .map((q) => [q.title, q.pageid])
  )
  return toTag(rows[0], nameToId)
})

export const loadTags = withCache('tags', async (): Promise<Tag[]> => {
  const rows = (await getCodaRows(TAGS_TABLE, 'Internal?', 'false')) as TagsRow[]

  const questions = await loadAllQuestions('NEVER_RELOAD')
  const nameToId = Object.fromEntries(
    questions.data
      .filter((q) => q.status == QuestionStatus.LIVE_ON_SITE)
      .map((q) => [q.title, q.pageid])
  )
  return rows.map((r) => toTag(r, nameToId))
})

export const loadMoreAnswerDetails = withCache(
  'loadMoreAnswerDetails',
  async (
    nextPageLink: string | null
  ): Promise<{questions: Question[]; nextPageLink: string | null}> => {
    const url = nextPageLink || makeCodaRequest({table: ON_SITE_TABLE, limit: 10})
    const result = await fetchRows(url)
    const items = result.items as AnswersRow[]
    return {nextPageLink: result.nextPageLink, questions: items.map(convertToQuestion)}
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

export const incAnswerColumn = async (column: string, pageid: PageId, subtract: boolean) => {
  const table = WRITES_TABLE
  const currentRowUrl = makeCodaRequest({table, queryColumn: 'UI ID', queryValue: pageid})
  const current = await sendToCoda(currentRowUrl, '', 'GET')

  const row = current?.items && current?.items[0]
  if (!row) return 'Nothing found'

  const url = `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows/${enc(row.id)}`
  const incBy = subtract ? -1 : 1
  const payload = {
    row: {
      cells: [{column, value: (row.values.Helpful || 0) + incBy}],
    },
  }
  const result = await sendToCoda(url, payload, 'PUT')
  return result.id ? 'ok' : result
}

export const makeColumnIncrementer = (column: string) => (pageid: PageId, subtract: boolean) =>
  incAnswerColumn(column, pageid, subtract)
