import {useState, useEffect, useRef, MouseEvent} from 'react'
import Question from '~/components/question'

type Props = {
  onSelect: (title: string) => void
}

type Question = {
  title: string
  normalized: string
}

type SearchResult = Question & {
  score: number
}

export default function Search({onSelect}: Props) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [baselineSearchResults, setBaselineSearchResults] = useState<SearchResult[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const tfWorkerRef = useRef<Worker>()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/questions/allCanonical')
      .then((r) => r.json())
      .then((data: string[]) => {
        const newQuestions = data.map((title) => ({title, normalized: normalize(title)}))
        setQuestions(newQuestions)

        const value = inputRef.current?.value
        if (value) {
          setTimeout(() => handleChange(value, newQuestions), 1000)
        }
      })

    const handleWorker = (event: MessageEvent) => {
      const {data} = event
      console.debug('onmessage from tfWorker:', data)
      if (data.searchResults) {
        setSearchResults(data.searchResults)
      }
    }
    const initWorker = () => {
      if (self.Worker && !tfWorkerRef.current) {
        tfWorkerRef.current = new Worker('/tfWorker.js')
        tfWorkerRef.current.addEventListener('message', handleWorker)
      } else {
        console.log('Sorry! No Web Worker support.')
      }
    }
    initWorker()
  }, [])

  const handleChange = (value: string, currentQuestions: Question[]) => {
    runBaselineSearch(value, currentQuestions).then(setBaselineSearchResults)

    console.debug('postMessag to tfWorker:', value)
    tfWorkerRef.current?.postMessage(value)
  }

  const renderResultItem = ({title, score}: SearchResult) => {
    const handleSelect = (e: MouseEvent) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        // don't setShowResults(false) from input onBlur, allowing multiselect
        e.preventDefault()
      }
      onSelect(title)
    }

    return (
      <button
        className="transparent-button"
        key={title}
        onMouseDown={handleSelect}
        // onKeyDown={handleSelect} TODO: figure out accessibility of not blurring on keyboard navigation
      >
        ({score.toFixed(2)}) {title}
      </button>
    )
  }

  return (
    <div>
      <input
        type="search"
        id="searchbar"
        name="searchbar"
        ref={inputRef}
        placeholder="What is your question?"
        onChange={(e) => handleChange(e.currentTarget.value, questions)}
        onFocus={() => setShowResults(true)}
        onBlur={() => setShowResults(false)} // TODO: figure out accessibility of not blurring on keyboard navigation
      />
      <div className={`dropdown ${showResults ? '' : 'hidden'}`}>
        <div>
          Tensorflow debugging:
          {searchResults.length > 0 ? (
            searchResults.map(renderResultItem)
          ) : (
            <div className="empty">(no results)</div>
          )}
        </div>
        <div>
          Baseline text search:
          {baselineSearchResults.length > 0 ? (
            baselineSearchResults.map(renderResultItem)
          ) : (
            <div className="empty">(no results)</div>
          )}
        </div>
      </div>
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