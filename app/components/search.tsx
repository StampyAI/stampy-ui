import {useState, useEffect, useRef, MouseEvent, useMemo, MutableRefObject} from 'react'
import debounce from 'lodash/debounce'
import {Question} from '~/routes/questions/$question'
import {MagnifyingGlass} from '~/components/icons-generated'
import AutoHeight from 'react-auto-height'

type Props = {
  canonicallyAnsweredQuestionsRef: MutableRefObject<{pageid: number; title: string}[]>
  openQuestionTitles: string[]
  onSelect: (pageid: number, title: string) => void
}

type Question = {
  pageid: number
  title: string
}

type SearchResult = Question & {
  score: number
}

type WorkerMessage =
  | 'ready'
  | {
      searchResults: {title: string; pageid: number; score: number}[]
      numQs: number
    }

const empty: [] = []

export default function Search({
  canonicallyAnsweredQuestionsRef,
  openQuestionTitles,
  onSelect,
}: Props) {
  const [baselineSearchResults, setBaselineSearchResults] = useState<SearchResult[]>(empty)
  const [searchResults, setSearchResults] = useState<SearchResult[]>(empty)
  const [showResults, setShowResults] = useState(false)
  const searchInputRef = useRef('')
  const tfWorkerRef = useRef<Worker>()
  const tfFinishedLoadingRef = useRef(false)

  useEffect(() => {
    const handleWorker = (event: MessageEvent<WorkerMessage>) => {
      const {data} = event
      console.debug('onmessage from tfWorker:', data)
      if (data === 'ready') {
        tfFinishedLoadingRef.current = true
        return
      }
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

  const searchFn = (value: string) => {
    if (value === searchInputRef.current) return

    searchInputRef.current = value
    if (!tfFinishedLoadingRef.current) {
      console.debug('plaintext search:', value)
      runBaselineSearch(value, canonicallyAnsweredQuestionsRef.current).then(
        setBaselineSearchResults
      )
    }

    if (tfWorkerRef.current) {
      console.debug('postMessage to tfWorker:', value)
      tfWorkerRef.current.postMessage(value)
    }
  }

  const handleChange = debounce(searchFn, 500)

  const results = tfFinishedLoadingRef.current ? searchResults : baselineSearchResults
  const model = tfFinishedLoadingRef.current ? 'tensorflow' : 'plaintext'

  return (
    <div>
      <label className="searchbar">
        <input
          type="search"
          name="searchbar"
          placeholder="Search for more questions here..."
          autoComplete="off"
          onChange={(e) => handleChange(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchFn(e.currentTarget.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setShowResults(false)} // TODO: figure out accessibility - do not blur on keyboard navigation into the result list
        />
        <MagnifyingGlass />
      </label>
      <AutoHeight>
        <div className={`dropdown ${showResults && results.length > 0 ? '' : 'hidden'}`}>
          <div>
            {!tfFinishedLoadingRef.current && (
              <i>Showing plain text search results while tensorflow is loading:</i>
            )}
            {showResults &&
              results.map(({pageid, title, score}) => (
                <ResultItem
                  key={pageid}
                  {...{
                    pageid,
                    title,
                    score,
                    model,
                    onSelect,
                    isAlreadyOpen: openQuestionTitles.includes(title),
                  }}
                />
              ))}
          </div>
          <a
            href={`https://stampy.ai/wiki/Special:FormStart?form=Q&page_name=${searchInputRef.current}`}
            target="_blank"
            rel="noreferrer"
            className="result-item none-of-the-above"
            title="Request a new question"
            onMouseDown={(e) => e.preventDefault()} // prevent onBlur handler before click on the link happens
          >
            ＋ None of these: Request an answer to my exact question above
          </a>
        </div>
      </AutoHeight>
    </div>
  )
}

const ResultItem = ({
  pageid,
  title,
  score,
  model,
  onSelect,
  isAlreadyOpen,
}: {
  pageid: number
  title: string
  score: number
  model: string
  onSelect: Props['onSelect']
  isAlreadyOpen: boolean
}) => {
  const handleSelect = (e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      // don't setShowResults(false) from input onBlur, allowing multiselect
      e.preventDefault()
    }
    onSelect(pageid, title)
  }
  const tooltip = `score: ${score.toFixed(2)}, engine: ${model} ${
    isAlreadyOpen ? '(already open)' : ''
  }`

  return (
    <button
      className={`transparent-button result-item ${isAlreadyOpen ? 'already-open' : ''}`}
      key={title}
      title={tooltip}
      onMouseDown={handleSelect}
      // onKeyDown={handleSelect} TODO: #13 figure out accessibility of not blurring on keyboard navigation
    >
      {title}
    </button>
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

  const questionsScored: SearchResult[] = questions.map(({pageid, title}) => {
    const normalized = normalize(title)
    return {
      pageid,
      title,
      normalized,
      score: scoringFn(normalized),
    }
  })
  questionsScored.sort(byScore)

  return questionsScored.slice(0, numResults).filter(({score}) => score > 0)
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

/**
 * Sort function for the highest score on top
 */
const byScore = (a: SearchResult, b: SearchResult) => b.score - a.score
