import {useState, useEffect, ChangeEventHandler} from 'react'

type Question = {
  title: string
  normalized?: string
}

type SearchResult = Question & {
  score: number
}

var tfWorker: Worker

export default function Search() {
  const [isReady, setReady] = useState<boolean>(false)
  const [baselineSearchResults, setBaselineSearchResults] = useState<SearchResult[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleWorker = (event) => {
    // read and print out the incoming data
    const {data} = event

    // 1st time should be init search
    // TODO: doesn't seem to be setting isReady correctly
    if (data.isReady) {
      console.log('setReady to', data.isReady)
      setReady(data.isReady)
    }
    // else results from run search
    if (data.searchResults) {
      console.log('setSearchResults to', data.searchResults)
      setSearchResults(data.searchResults)
    }
  }

  const initWorker = () => {
    // create worker thread
    if (window.Worker) {
      if (typeof tfWorker == 'undefined') {
        tfWorker = new Worker('/tfWorker.js')
      }

      // any other messages is likely from runSearch
      tfWorker.addEventListener('message', handleWorker)
    } else {
      console.log('Sorry! No Web Worker support.')
    }
  }

  useEffect(() => initWorker(), [])

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    console.log('try posting to tfWorker...')
    tfWorker.postMessage(event.currentTarget.value)
  }

  return (
    <div>
      <input
        type="search"
        id="searchbar"
        name="searchbar"
        placeholder="What is your question?"
        onChange={handleChange}
        onFocus={() => setShowResults(true)}
        onBlur={() => setShowResults(false)}
      />
      {showResults && (
        <div className="dropdown">
          <div>
            Tensorflow debugging:
            {searchResults.map((result: SearchResult) => (
              <a key={result.title}>
                ({result.score}) {result.title}
              </a>
            ))}
          </div>
          <div>
            Baseline text search:
            {baselineSearchResults.map((result: SearchResult) => (
              <a key={result.title}>
                ({result.score.toFixed(2)}) {result.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Baseline full-text search matching the query with each question as strings, weighting down:
 *  short words,
 *  wh* questions,
 *  distance,
 *  partial (prefix) match without full match
 *  normalized to ignore a/an/the, punctuation, and case
 */
export const runBaselineSearch = async (
  searchQueryRaw: string,
  {questions}: SearchProps,
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

  const questionsScored: SearchResult[] = questions.map(({title, normalized}) => ({
    title,
    normalized,
    score: scoringFn(normalized),
  }))
  questionsScored.sort(byScore)

  return questionsScored.slice(0, numResults).filter(({score}) => score > 0)
}

/**
 * Ignore unimportant details for similarity comparison
 */
const normalize = (question: string) =>
  question
    .toLowerCase()
    .replace(/[^\w ]|\b(?:an?|the?)\b|(?<=\w{2})s\b/g, '')
    .replace(/\s+|_|&\s*/g, ' ')
    .trim()

/**
 * Sort function for the highest score on top
 */
const byScore = (a: SearchResult, b: SearchResult) => b.score - a.score
