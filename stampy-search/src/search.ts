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
  onResolveCallback: (query: string, res: SearchResult[] | null) => void | null
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
export enum SearchType {
    LiveOnSite,
    Unpublished
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

// let currentSearch: Search = null
// let worker: Worker
const defaultSearchConfig = {
  getAllQuestions: () => [] as Question[],
  onResolveCallback: null,
  numResults: 5,
  searchEndpoint: '/questions/search',
  workerPath: '/tfWorker.js',
  server: '',
}

export class Searcher {
  currentSearch: Search
  worker: Worker
  searchConfig = defaultSearchConfig

  constructor(config: SearchConfig) {
    this.searchConfig = {
      ...defaultSearchConfig,
      ...config,
    }
    this.initialiseWorker().then(console.log)
  }

  initialiseWorker = async () => {
    if (this.worker !== undefined) return

    const workerInstance = await fetch(`${this.searchConfig.server}${this.searchConfig.workerPath}`)
      .then((response) => response.text())
      .then((code) => {
        const blob = new Blob([code])
        return new Worker(URL.createObjectURL(blob))
      })

    workerInstance.addEventListener('message', ({data}) => {
      if (data.status == 'ready') {
        this.worker = workerInstance
      } else if (data.searchResults) {
        this.resolveSearch(data)
      }
    })
  }

  resolveSearch = ({searchResults, query}: WorkerResultMessage) => {
    if (this.currentSearch) {
      this.currentSearch.resolve(query === this.currentSearch.query ? searchResults : null)
      this.currentSearch = null
      if (this.searchConfig.onResolveCallback) {
        this.searchConfig.onResolveCallback(query, searchResults)
      }
    }
  }

  rejectSearch = (query: string, reason: string) => {
    if (this.currentSearch && this.currentSearch.query == query) {
      this.currentSearch.reject(reason)
      this.currentSearch = null
    }
  }

  runLiveSearch = (query: string, resultsNum?: number) => {
    if (query != this.currentSearch?.query) {
      return // this search has been superceeded with a newer one, so just give up
    } else if (this.worker || this.searchConfig.getAllQuestions().length > 0) {
      const numResults = resultsNum || this.searchConfig.numResults
      const wordCount = query.split(' ').length

      if (wordCount > 2 && this.worker) {
        this.worker.postMessage({query, numResults})
      } else {
        baselineSearch(query, this.searchConfig.getAllQuestions(), numResults).then((res) =>
          this.resolveSearch({searchResults: res, query})
        )
      }
    } else {
      setTimeout(() => this.runLiveSearch(query, resultsNum), 100)
    }
  }

  runUnpublishedSearch = (query: string, resultsNum?: number) => {
    const numResults = resultsNum || this.searchConfig.numResults
    const url = `${this.searchConfig.server}${this.searchConfig.searchEndpoint}`
    const params = `?question=${encodeURIComponent(query)}&numResults=${numResults}`

    return fetch(url + params)
      .then(async (result) => {
        if (result.status == 200) {
          this.resolveSearch({searchResults: await result.json(), query})
        } else {
          this.rejectSearch(query, await result.text())
        }
      })
      .catch((err) => this.rejectSearch(query, err))
  }

  searchLive = (query: string, resultsNum?: number): Promise<SearchResult[] | null> => {
    return this.search(SearchType.LiveOnSite, query, resultsNum)
  }

  searchUnpublished = (query: string, resultsNum?: number): Promise<SearchResult[]> => {
    return this.search(SearchType.Unpublished, query, resultsNum)
  }

  search = (type_: SearchType, query: string, numResults?: number): Promise<SearchResult[]> => {
    // Cancel any previous searches
    this.resolveSearch({searchResults: []})

    const runSearch = type_ == SearchType.LiveOnSite ? this.runLiveSearch : this.runUnpublishedSearch

    return new Promise((resolve, reject) => {
      this.currentSearch = {resolve, reject, query}
      runSearch(query, numResults)
    })
  }
}
