import {useState, useEffect, useRef} from 'react'
import {Question} from '~/server-utils/stampy'
import useOnSiteQuestions from './useOnSiteQuestions'

const NUM_RESULTS = 8

export type SearchResult = {
  pageid: string
  title: string
  score: number
  model: string
  url?: string
}

export type WorkerMessage =
  | {
      status: 'ready'
      numQs: number
    }
  | {
      searchResults: SearchResult[]
      userQuery?: string
    }

const waitForCondition = async (conditionFn: () => boolean, interval = 100, timeout = 5000) => {
  const startTime = Date.now()

  async function loop() {
    // If the condition is met, resolve.
    if (conditionFn()) return true

    // If the timeout has elapsed, reject.
    if (Date.now() - startTime > timeout) throw new Error('Timeout waiting for condition')

    // Wait for the specified interval, then try again.
    await new Promise((resolve) => setTimeout(resolve, interval))
    return loop()
  }
  return loop()
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
  minSimilarity = 0,
  numResults = NUM_RESULTS
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
    .map(({pageid, title, alternatePhrasings = ''}) => {
      const normalized = normalize(`${title}\n${alternatePhrasings}`)
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
    .filter(({score}) => score >= minSimilarity)
}

/**
 * Ignore unimportant details for similarity comparison
 */
const normalize = (question: string) =>
  question
    .toLowerCase()
    .replace(/\n/g, ' ')
    .replace(/[^\w ]|\b(?:an?|the?)\b/g, '')
    .replace(/ies\b/g, 'y')
    .replace(/(\w{2})s\b/g, '$1') // cannot use lookbehind (?<=...) because not supported on Safari
    .replace(/\s+|_|&\s*/g, ' ')
    .trim()

/**
 * Configure the search engine.
 *
 * This will download the embeddings for semantic search, but until that is set up, will
 * use baseline search over the list of questions already loaded on the site.
 * Searches containing only one or two words will also use the baseline search
 */
export const useSearch = (numResults = NUM_RESULTS) => {
  const tfWorkerRef = useRef<Worker>()
  const runningQueryRef = useRef<string>() // detect current query in search function from previous render => ref
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>() // cancel previous timeout => ref
  const isPendingSearch = useRef(false)
  const resultsRef = useRef<SearchResult[]>([])
  const resultsForRef = useRef<string>()
  const [results, setResults] = useState([] as SearchResult[])

  const {items} = useOnSiteQuestions()

  useEffect(() => {
    const makeWorker = async () => {
      const worker = new Worker('/tfWorker.js')
      worker.addEventListener('message', ({data}) => {
        if (data.status == 'ready') {
          tfWorkerRef.current = worker
        } else if (data.userQuery == runningQueryRef.current) {
          runningQueryRef.current = undefined
          if (data.searchResults) {
            resultsRef.current = data.searchResults
            resultsForRef.current = data.userQuery
            setResults(data.searchResults)
          }
          isPendingSearch.current = false
        }
      })
    }
    makeWorker()
  }, [])

  const searchLater = (userQuery: string, minSimilarity?: number) => {
    if (typeof window === 'undefined') return

    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      search(userQuery, minSimilarity)
    }, 100)
  }

  const search = (userQuery: string, minSimilarity?: number) => {
    isPendingSearch.current = true
    const wordCount = userQuery.trim().split(' ').length
    if (wordCount > 2 && tfWorkerRef.current) {
      if (runningQueryRef.current || !tfWorkerRef.current) {
        searchLater(userQuery, minSimilarity)
        return
      }
      runningQueryRef.current = userQuery
      tfWorkerRef.current.postMessage({userQuery, numResults, minSimilarity})
    } else {
      if (!items || items?.length == 0) {
        searchLater(userQuery, minSimilarity)
        return
      }
      runningQueryRef.current = userQuery
      baselineSearch(userQuery, items, minSimilarity, numResults).then((searchResults) => {
        runningQueryRef.current = undefined
        resultsRef.current = searchResults
        resultsForRef.current = userQuery
        isPendingSearch.current = false
        setResults(searchResults)
      })
    }
  }

  const waitForResults = async (interval?: number, timeout?: number) => {
    try {
      await waitForCondition(() => !isPendingSearch.current, interval, timeout)
    } catch (e) {
      console.info('Timeout')
    }
    return resultsRef.current
  }

  const clear = () => {
    runningQueryRef.current = undefined
    isPendingSearch.current = false
    resultsForRef.current = undefined
    resultsRef.current = []
    setResults([])
  }

  return {
    loadedQuestions: !!items,
    loadedEmbeddings: !!runningQueryRef.current,
    search,
    clear,
    results,
    resultsForRef,
    isPendingSearch: isPendingSearch.current,
    waitForResults,
  }
}
