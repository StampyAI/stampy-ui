import {useState, useEffect, useRef, MutableRefObject, FocusEvent} from 'react'
import debounce from 'lodash/debounce'
import {Question} from '~/routes/questions/$question'
import {AddQuestion} from '~/routes/questions/add'
import {Action, ActionType} from '~/routes/questions/actions'
import {MagnifyingGlass, Edit} from '~/components/icons-generated'
import AutoHeight from 'react-auto-height'
import Dialog from '~/components/dialog'

type Props = {
  onSiteAnswersRef: MutableRefObject<Question[]>
  openQuestionTitles: string[]
  onSelect: (pageid: string, title: string) => void
}

type Question = {
  pageid: string
  title: string
}

type SearchResult = Question & {
  score: number
  url?: string
}

// type of postMessage() values from tfWorker.js (manually synchronized)
export type WorkerMessage =
  | {
      status: 'ready'
      numQs: number
    }
  | {
      searchResults: {title: string; pageid: string; score: number}[]
      userQuery?: string
    }

const empty: [] = []

export default function Search({onSiteAnswersRef, openQuestionTitles, onSelect}: Props) {
  const [baselineSearchResults, setBaselineSearchResults] = useState<SearchResult[]>(empty)
  const [searchResults, setSearchResults] = useState<SearchResult[]>(empty)
  const [showResults, setShowResults] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchInputRef = useRef('')
  const modelRef = useRef<'tensorflow' | 'plaintext'>('plaintext')
  const tfWorkerRef = useRef<Worker>()
  const tfFinishedLoadingRef = useRef(false)

  useEffect(() => {
    const handleWorker = (event: MessageEvent<WorkerMessage>) => {
      const {data} = event
      console.debug('onmessage from tfWorker:', data)
      if ('status' in data) {
        tfFinishedLoadingRef.current = data.status === 'ready'
        return
      }
      if (data.searchResults) {
        setSearchResults(data.searchResults)
      }
      setLoading(false)
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

  const searchFn = (rawWalue: string) => {
    const value = rawWalue.trim()
    if (value === searchInputRef.current) return

    setLoading(true)
    searchInputRef.current = value

    const wordCount = value.split(' ').length
    const useBaseline = wordCount <= 2 || !tfFinishedLoadingRef.current || !tfWorkerRef.current

    if (useBaseline) {
      modelRef.current = 'plaintext'
      console.debug('plaintext search:', value)
      runBaselineSearch(value, onSiteAnswersRef.current).then((results) => {
        setBaselineSearchResults(results)
        setLoading(false)
      })
    } else {
      modelRef.current = 'tensorflow'
      console.debug('postMessage to tfWorker:', value)
      tfWorkerRef.current?.postMessage(value)
    }
  }

  const handleChange = debounce(searchFn, 100)

  const results = modelRef.current === 'tensorflow' ? searchResults : baselineSearchResults

  const hideSearchResults = () => setShowResults(false)
  const [hideEnabled, setHide] = useState(true)
  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    // If the focus changes from something in the search widget to something outside
    // of it, then hide the results. If it's just jumping around the results, then keep
    // them shown.
    const focusedOnResult = e.relatedTarget?.classList.contains('result-item') || false
    // Safari doesn't provide related target info in the blur event, so this will
    // make sure that it won't hide the search results right away, as that stops
    // the clicked element from fireing (it gets destroyed before the click handler fires)
    if (hideEnabled) setShowResults(focusedOnResult)
  }

  const handleSelect = (pageid: string, title: string) => {
    setHide(true)
    setShowMore(false)
    hideSearchResults()
    onSelect(pageid, title)
  }

  return (
    <>
      <div onFocus={() => setShowResults(true)} onBlur={handleBlur}>
        <label className="searchbar">
          <input
            type="search"
            name="searchbar"
            placeholder="Search for more questions here..."
            autoComplete="off"
            onChange={(e) => handleChange(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchFn(e.currentTarget.value)}
          />
          <MagnifyingGlass />
        </label>
        <div className={`search-loader ${loading ? 'loader' : ''}`}> </div>
        {loading && results.length == 0 && (
          <div className="result-item-box no-questions">Searching for questions...</div>
        )}
        <AutoHeight>
          <div
            className={`dropdown ${
              showResults && searchInputRef.current.length > 0 ? '' : 'hidden'
            }`}
          >
            <div>
              {showResults &&
                results.map(({pageid, title, score}) => (
                  <ResultItem
                    key={pageid}
                    {...{
                      pageid,
                      title,
                      score,
                      model: modelRef.current,
                      onSelect: handleSelect,
                      isAlreadyOpen: openQuestionTitles.includes(title),
                      setHide,
                    }}
                  />
                ))}
              {showResults && results.length === 0 && <i>(no results)</i>}
            </div>
            <button
              className="result-item result-item-box none-of-the-above"
              onClick={() => setShowMore(true)}
              onMouseDown={() => setHide(false)}
              onMouseUp={() => setHide(true)}
            >
              I&apos;m asking something else
            </button>
          </div>
        </AutoHeight>
      </div>
      {showMore && (
        <ShowMoreSuggestions
          onClose={() => {
            setShowMore(false)
            setHide(true)
          }}
          question={searchInputRef.current}
          relatedQuestions={results.map(({title}) => title)}
        />
      )}
    </>
  )
}

const ResultItem = ({
  pageid,
  title,
  score,
  model,
  onSelect,
  isAlreadyOpen,
  setHide,
}: {
  pageid: string
  title: string
  score: number
  model: string
  onSelect: Props['onSelect']
  isAlreadyOpen: boolean
  setHide?: (b: boolean) => void
}) => {
  const tooltip = `score: ${score.toFixed(2)}, engine: ${model} ${
    isAlreadyOpen ? '(already open)' : ''
  }`

  return (
    <button
      className={`transparent-button result-item result-item-box ${
        isAlreadyOpen ? 'already-open' : ''
      }`}
      key={title}
      title={tooltip}
      onClick={() => onSelect(pageid, title)}
      onMouseDown={() => setHide && setHide(false)}
    >
      {title}
    </button>
  )
}

const ShowMoreSuggestions = ({
  question,
  relatedQuestions,
  onClose,
}: {
  question: string
  relatedQuestions: string[]
  onClose: (e: any) => void
}) => {
  const [extraQuestions, setExtraQuestions] = useState<SearchResult[]>(empty)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const getResults = async (question: string) => {
      try {
        const questions = await (
          await fetch(`/questions/search?question=${encodeURIComponent(question)}`)
        ).json()
        setExtraQuestions(questions) // don't set on API errors
      } catch (e) {
        console.error(e)
        setError(e instanceof Error ? e.message : '')
      }
    }
    getResults(question)
  }, [question])

  if (extraQuestions === empty) {
    return (
      <Dialog onClose={onClose}>
        <div className="loader"></div>
        {error && <div className='error'>{error}</div>}
      </Dialog>
    )
  } else if (extraQuestions.length === 0) {
    return (
      <Dialog onClose={onClose}>
        <AddQuestion title={question} relatedQuestions={relatedQuestions} immediately={true} />
      </Dialog>
    )
  }
  return (
    <Dialog onClose={onClose}>
      <div className="dialog-title">
        You searched for &quot;{question}&quot;.
        <br />
        Here are some questions we&apos;re still answering. Are any of these what you&apos;re
        looking for?
      </div>
      {extraQuestions.map((question) => (
        <RequestQuestion key={question.pageid} {...question} />
      ))}
      <AddQuestion title={question} relatedQuestions={relatedQuestions} />
    </Dialog>
  )
}

const RequestQuestion = ({pageid, title, url}: SearchResult) => {
  return (
    <div className="possible-question" key={`extra-question-${pageid}`}>
      <Action className="result-item" pageid={pageid} actionType={ActionType.REQUEST}>
        <button className="transparent-button title" key={title}>
          {title}
        </button>
      </Action>
      <a className="icon-link" href={url} target="_blank" rel="noreferrer" title="edit answer">
        <Edit />
        Edit
      </a>
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
