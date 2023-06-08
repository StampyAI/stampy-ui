import {useState, useEffect, useRef, MutableRefObject} from 'react'

export type Question = {
  pageid: string
  title: string
}
export type SearchResult = Question & {
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
  const totalWeight = matchers.reduce((acc, {weight}) => acc + weight, 0.1) // extra total to only approach 100%

  const scoringFn = (questionNormalized: string) => {
    let score = 0
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
const normalize = (question: string) =>
  question
    .toLowerCase()
    .replace(/[^\w ]|\b(?:an?|the?)\b/g, '')
    .replace(/(\w{2})s\b/g, '$1') // cannot use lookbehind (?<=...) because not supported on Safari
    .replace(/\s+|_|&\s*/g, ' ')
    .trim()

const updateQueue = (item: string) => (queue: string[]) => {
  if (item == queue[queue.length - 1]) {
    // the lastest search is the same a this one - ignore all other searches
    // as this is what was desired
    return []
  }
  const pos = queue.indexOf(item)
  if (pos < 0) {
    // If the item isn't in the queue, then do nothing - it was cleared by previous results
    return queue
  }
  // Remove the first occurance of the item, i.e. the oldest search. It's possible for there
  // to be multiple such values, but they weren't the most recent searches, so who cares. They
  // might as well be left in though, for bookkeeping reasons
  queue.splice(pos, 1)
  return queue
}

/**
 * Configure the search engine.
 *
 * This will download the embeddings for semantic search, but until that is set up, will
 * use baseline search over the list of questions already loaded on the site.
 * Searches containing only one or two words will also use the baseline search
 */
export const useSearch = (onSiteQuestions: MutableRefObject<Question[]>, numResults = 5) => {
  const resultsProcessor = useRef((data: any): void => {
    data // This is here just to get typescript to stop complaining...
  })
  const tfWorkerRef = useRef<Worker>()
  const [queue, setQueue] = useState([] as string[])
  const [results, setResults] = useState([] as SearchResult[])

  useEffect(() => {
    const makeWorker = async () => {
      const worker = new Worker('/tfWorker.js')
      worker.addEventListener('message', ({data}) => {
        if (data.status == 'ready') {
          tfWorkerRef.current = worker
        } else if (data.searchResults) {
          resultsProcessor.current(data)
        }
      })
    }
    makeWorker()
  }, [resultsProcessor, tfWorkerRef])

  resultsProcessor.current = ({searchResults, userQuery}) => {
    if (!searchResults) return

    if (queue[queue.length - 1] == userQuery) {
      setResults(searchResults)
    }
    setQueue(updateQueue(userQuery))
  }

  // Each search query gets added to the queue of searched items - the idea
  // is that only the last item is important - all other searches can be ignored.
  const search = (userQuery: string) => {
    const wordCount = userQuery.split(' ').length
    if (wordCount > 2 && tfWorkerRef.current) {
      tfWorkerRef.current.postMessage(userQuery)
    } else {
      baselineSearch(userQuery, onSiteQuestions.current, numResults).then((searchResults) =>
        resultsProcessor.current({searchResults, userQuery})
      )
    }
    setQueue([...queue, userQuery])
  }

  return {
    search,
    results,
    arePendingSearches: queue?.length > 0,
  }
}
