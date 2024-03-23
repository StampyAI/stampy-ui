import {withCache} from '~/server-utils/kv-cache'
import {
  cleanUpDoubleBold,
  allLinksOnNewTab,
  uniqueFootnotes,
  urlToIframe,
  convertToHtmlAndWrapInDetails,
} from '~/server-utils/parsing-utils'
import {
  ALL_ANSWERS_TABLE,
  CODA_DOC_ID,
  GLOSSARY_TABLE,
  INCOMING_QUESTIONS_TABLE,
  INITIAL_QUESTIONS_TABLE,
  ON_SITE_TABLE,
  QUESTION_DETAILS_TABLE,
  TAGS_TABLE,
  WRITES_TABLE,
  BANNERS_TABLE,
  REDIRECTS_TABLE,
  makeCodaRequest,
} from './coda-urls'

export enum QuestionState {
  OPEN = '_',
  COLLAPSED = '-',
  RELATED = 'r',
}
export type RelatedQuestion = {title: string; pageid: string}
export enum QuestionStatus {
  WITHDRAWN = 'Withdrawn',
  SKETCH = 'Bulletpoint sketch',
  TO_DELETE = 'Marked for deletion',
  UNCATEGORIZED = 'Uncategorized',
  NOT_STARTED = 'Not started',
  IN_PROGRESS = 'In progress',
  IN_REVIEW = 'In review',
  LIVE_ON_SITE = 'Live on site',
  SUBSECTION = 'Subsection',
  UNKNOWN = 'Unknown',
}
export type Banner = {
  title: string
  text: string
  icon: Record<string, string>
  textColour: string
  backgroundColour: string
}
export type GlossaryEntry = {
  term: string
  alias: string
  pageid: PageId
  contents: string
  image: string
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
  questions: RelatedQuestion[]
  mainQuestion: string | null
}
export type Question = {
  title: string
  pageid: string
  text: string | null
  answerEditLink: string | null
  relatedQuestions: RelatedQuestion[]
  questionState?: QuestionState
  tags: string[]
  banners: Banner[]
  status?: QuestionStatus
  updatedAt?: string
  alternatePhrasings?: string
  subtitle?: string
  icon?: string
  parents?: string[]
  children?: Question[]
  order?: number
}
export type PageId = Question['pageid']
export type NewQuestion = {
  title: string
  relatedQuestions: RelatedQuestion[]
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

type Redirects = {
  [from: string]: string
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

export type AnswersRow = CodaRowCommon & {
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
    'Doc Last Edited': '' | string
    Tags: '' | Entity[]
    Banners: '' | Entity[]
    'Rich Text': string
    Subtitle?: string
    Icon?: Entity | string | Entity[]
    Parents?: Entity[]
    Order?: number
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
    image: Entity
  }
}
type BannersRow = CodaRowCommon & {
  values: {
    Title: string
    Icon: any[]
    Text: string
    'Background colour': string
    'Text colour': string
  }
}
type RedirectsRow = CodaRowCommon & {
  values: {
    From: string
    To: string
  }
}
type CodaRow = AnswersRow | TagsRow | GlossaryRow | BannersRow | RedirectsRow
export type CodaResponse = {
  items: CodaRow[]
  nextPageLink: string | null
}

const enc = encodeURIComponent
let allTags = {} as Record<string, Tag>
let allBanners = {} as Record<string, Banner>

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
  const json = (await fetchJson(url, params)) as any
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
  markdown = urlToIframe(markdown || '')

  let html = convertToHtmlAndWrapInDetails(markdown)
  html = uniqueFootnotes(html, pageid)
  html = cleanUpDoubleBold(html)
  html = allLinksOnNewTab(html)

  return html
}

// Icons can be returned as strings or objects
const extractIcon = (val?: string | string[] | Entity | Entity[]): string | undefined => {
  if (!val) return val
  const item = head(val)
  if (typeof item === 'string') return extractText(val as string)
  if (item) return (item as Entity).url
  return undefined
}

// Sometimes string fields are returned as lists. This can happen when there are duplicate entries in Coda
const head = (item: any | any[]) => {
  if (Array.isArray(item)) return item[0]
  return item
}
const extractText = (markdown: string | null | undefined) =>
  head(markdown || '')?.replace(/^```|```$/g, '')
const extractLink = (markdown: string) => markdown?.replace(/^.*\(|\)/g, '')
const extractJoined = (values: Entity[], mapper: Record<string, any>) =>
  values
    .map((e) => e.name)
    .map((name) => (mapper && mapper[name]) || {name})
    .filter((i) => i)

const convertToQuestion = ({name, values, updatedAt} = {} as AnswersRow): Question => ({
  title: name,
  pageid: extractText(values['UI ID']),
  text: renderText(extractText(values['UI ID']), values['Rich Text']),
  answerEditLink: extractLink(values['Edit Answer']).replace(/\?.*$/, ''),
  tags: extractJoined(values['Tags'] || [], allTags).map((t) => t.name),
  banners: extractJoined(values['Banners'] || [], allBanners),
  relatedQuestions:
    values['Related Answers'] && values['Related IDs']
      ? values['Related Answers'].map(({name}, i) => ({
          title: name,
          pageid: extractText(values['Related IDs'][i]),
        }))
      : [],
  status: values['Status']?.name as QuestionStatus,
  alternatePhrasings: extractText(values['Alternate Phrasings']),
  subtitle: extractText(values.Subtitle),
  icon: extractIcon(values.Icon),
  parents: !values.Parents ? [] : values.Parents?.map(({name}) => name),
  updatedAt: updatedAt || values['Doc Last Edited'],
  order: values.Order || 0,
})

export const loadQuestionDetail = withCache('questionDetail', async (question: string) => {
  // Make sure all tags are loaded. This shouldn't be needed often, as it's double cached
  if (Object.keys(allTags).length === 0) {
    const {data} = await loadTags('NEVER_RELOAD')
    allTags = Object.fromEntries(data.map((r) => [r.name, r])) as Record<string, Tag>
  }
  if (Object.keys(allBanners).length === 0) {
    const {data} = await loadBanners('NEVER_RELOAD')
    allBanners = data
  }
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
          term: extractText(values.phrase),
          image: values.image?.url,
          contents: renderText(pageid, extractText(values.definition)),
        }
        return phrases
          .map((i) => extractText(i))
          .filter(Boolean)
          .map((phrase) => [phrase.toLowerCase(), {alias: phrase, ...item}])
      })
      .flat()
  )
})

export const loadBanners = withCache('loadBanners', async (): Promise<Record<string, Banner>> => {
  const rows = (await getCodaRows(BANNERS_TABLE)) as BannersRow[]
  return Object.fromEntries(
    rows
      .map(({values}) => ({
        title: extractText(values.Title),
        text: renderText('', values.Text) || '',
        icon: values.Icon[0],
        backgroundColour: extractText(values['Background colour']),
        textColour: extractText(values['Text colour']),
      }))
      .map((item) => [item.title, item])
  )
})

export const loadOnSiteAnswers = withCache('onSiteAnswers', async () => {
  const rows = (await getCodaRows(ON_SITE_TABLE)) as AnswersRow[]
  return rows.map(convertToQuestion)
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

export const addQuestion = async (title: string, relatedQuestions: RelatedQuestion[]) => {
  return await insertRows(INCOMING_QUESTIONS_TABLE, [{title, relatedQuestions}])
}

export const incAnswerColumn = async (column: string, pageid: PageId, subtract: boolean) => {
  const table = WRITES_TABLE
  const currentRowUrl = makeCodaRequest({table, queryColumn: 'UI ID', queryValue: pageid})
  const current = (await sendToCoda(currentRowUrl, '', 'GET')) as any

  const row = current?.items && current?.items[0]
  if (!row) return 'Nothing found'

  const url = `https://coda.io/apis/v1/docs/${CODA_DOC_ID}/tables/${enc(table)}/rows/${enc(row.id)}`
  const incBy = subtract ? -1 : 1
  const payload = {
    row: {
      cells: [{column, value: (row.values[column] || 0) + incBy}],
    },
  }
  const result = (await sendToCoda(url, payload, 'PUT')) as any
  return result.id ? 'ok' : result
}

export const makeColumnIncrementer = (column: string) => (pageid: PageId, subtract: boolean) =>
  incAnswerColumn(column, pageid, subtract)

export const loadRedirects = withCache('redirects', async (): Promise<Redirects> => {
  const rows = (await getCodaRows(REDIRECTS_TABLE)) as RedirectsRow[]
  return rows
    .filter((row) => !!row.values.To && !!row.values.From)
    .reduce(
      (acc, {values}) => ({
        ...acc,
        [extractText(values.From).replace(/^\/+/, '')]: extractText(values.To).replace(/^\/+/, '/'),
      }),
      {}
    )
})
