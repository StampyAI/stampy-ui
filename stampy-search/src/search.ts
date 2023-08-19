export type Question = {
  pageid: string
  title: string
}
export type SearchResult = Question & {
  score: number
  model: string
  url?: string
}
type Search = {
  resolve: (value: null | SearchResult[] | PromiseLike<null | SearchResult[]>) => void
  reject: (reason?: any) => void
  query: string
} | null
type SearchConfig = {
  numResults?: number
  getAllQuestions?: () => Question[]
  server?: string
  searchEndpoint?: string
  workerPath?: string
}

type WorkerResultMessage = {
  searchResults: SearchResult[]
  query?: string
}
export type WorkerMessage =
  | WorkerResultMessage
  | {
      searchResults: SearchResult[]
      query?: string
    }

/**
 * Sort function for the highest score on top
 */
const byScore = (a: SearchResult, b: SearchResult) => b.score - a.score

/** Baseline full-text search matching the query with each question as strings, weighting down:
 *  short words,
 *  wh* questions,
 *  distance,
 *  partial (prefix) match without full match
 *  normalized to ignore a/an/the, punctuation, and case
 */
export const baselineSearch = async (
  searchQueryRaw: string,
  questions: Question[],
  numResults = 5
): Promise<SearchResult[]> => {
  if (!searchQueryRaw) {
    return []
  }

  const searchQueryTokens = normalize(searchQueryRaw).split(' ')
  const matchers = searchQueryTokens.map((token) => ({
    weight: token.match(/^(?:\w|\w\w|wh.*|how)$/) ? 0.2 : token.length,
    fullRe: new RegExp(`\\b${token}\\b`),
    prefixRe: new RegExp(`\\b${token}`),
  }))
  const isDefinitionRe = /^what (?:is|are)/
  const totalWeight = matchers.reduce((acc, {weight}) => acc + weight, 0.1) // extra total to avoid division by 0

  const scoringFn = (questionNormalized: string) => {
    let score = isDefinitionRe.exec(questionNormalized) ? 0.1 : 0 // small boost to "What is x?" questions if there are many search results
    let prevPosition = -1
    for (const {weight, fullRe, prefixRe} of matchers) {
      const fullMatch = fullRe.exec(questionNormalized)
      const prefixMatch = prefixRe.exec(questionNormalized)
      const currPosition = fullMatch?.index ?? prefixMatch?.index ?? prevPosition
      const distanceMultiplier =
        questionNormalized.slice(prevPosition, currPosition).split(' ').length === 2 ? 1 : 0.9

      if (fullMatch) {
        score += weight * distanceMultiplier
      } else {
        if (prefixMatch) {
          score += 0.9 * weight * distanceMultiplier
        } else {
          score -= 0.2 * weight
        }
      }
      prevPosition = currPosition
    }

    return score / totalWeight
  }

  return questions
    .map(({pageid, title}) => {
      const normalized = normalize(title)
      return {
        pageid,
        title,
        normalized,
        model: 'plaintext',
        score: scoringFn(normalized),
      }
    })
    .sort(byScore)
    .slice(0, numResults)
    .filter(({score}) => score > 0)
}

/**
 * Ignore unimportant details for similarity comparison
 */
export const normalize = (question: string) =>
  question
    .toLowerCase()
    .replace(/[^\w ]|\b(?:an?|the?)\b/g, '')
    .replace(/(\w{2})s\b/g, '$1') // cannot use lookbehind (?<=...) because not supported on Safari
    .replace(/\s+|_|&\s*/g, ' ')
    .trim()

let currentSearch: Search = null
let worker: Worker
const defaultSearchConfig = {
  getAllQuestions: () => [] as Question[],
  numResults: 5,
  searchEndpoint: '/questions/search',
  workerPath: '/tfWorker.js',
  server: '',
}
let searchConfig = defaultSearchConfig

const resolveSearch = ({searchResults, query}: WorkerResultMessage) => {
  if (currentSearch) {
    currentSearch.resolve(query === currentSearch.query ? searchResults : null)
    currentSearch = null
  }
}

const initialiseWorker = async () => {
  if (worker !== undefined) return

  const workerInstance = await fetch(`${searchConfig.server}${searchConfig.workerPath}`)
    .then((response) => response.text())
    .then((code) => {
      const blob = new Blob([code])
      return new Worker(URL.createObjectURL(blob))
    })

  workerInstance.addEventListener('message', ({data}) => {
    if (data.status == 'ready') {
      worker = workerInstance
    } else if (data.searchResults) {
      resolveSearch(data)
    }
  })
}

export const searchLive = (query: string, resultsNum?: number): Promise<SearchResult[] | null> => {
  // Cancel any previous searches
  resolveSearch({searchResults: []})

  const runSearch = () => {
    const numResults = resultsNum || searchConfig.numResults
    const wordCount = query.split(' ').length

    if (wordCount > 2 && worker) {
      worker.postMessage({query, numResults})
    } else {
      baselineSearch(query, searchConfig.getAllQuestions(), numResults).then((res) =>
        resolveSearch({searchResults: res, query})
      )
    }
  }

  const waitTillSearchReady = () => {
    if (query != currentSearch?.query) {
      return // this search has been superceeded with a newer one, so just give up
    } else if (worker || searchConfig.getAllQuestions().length > 0) {
      runSearch()
    } else {
      setTimeout(waitTillSearchReady, 100)
    }
  }

  return new Promise((resolve, reject) => {
    currentSearch = {resolve, reject, query}
    waitTillSearchReady()
  })
}

export const searchUnpublished = async (
  question: string,
  resultsNum?: number
): Promise<SearchResult[]> => {
  const numResults = resultsNum || searchConfig.numResults
  console.log(await fetch(searchConfig.workerPath))
  const result = await fetch(
    `${searchConfig.server}${searchConfig.searchEndpoint}?question=${encodeURIComponent(
      question
    )}&numResults=${numResults}`
  )

  if (result.status == 200) {
    return await result.json()
  }
  throw new Error(await result.text())
}

export const setupSearch = async (config: SearchConfig) => {
  searchConfig = {
    ...defaultSearchConfig,
    ...config,
  }
  await initialiseWorker()
}
