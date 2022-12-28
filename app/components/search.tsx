import {useState, MouseEvent, useMemo, MutableRefObject} from 'react'
import debounce from 'lodash/debounce'
import {MagnifyingGlass} from '~/components/icons-generated'
import AutoHeight from 'react-auto-height'

type Props = {
  canonicallyAnsweredQuestionsRef: MutableRefObject<RawSearchableItem[]>
  openQuestionTitles: string[]
  onSelect: (gdocId: string) => void
}

export type RawSearchableItem = {
  gdocId: string
  title: string
}

type SearchableItem = RawSearchableItem & {
  normalized: string
}

type SearchResult = SearchableItem & {
  score: number
}

const empty: [] = []

export default function Search({
  canonicallyAnsweredQuestionsRef,
  openQuestionTitles,
  onSelect,
}: Props) {
  const [baselineSearchResults, setBaselineSearchResults] = useState<SearchResult[]>(empty)
  const [searchInput, setSearchInput] = useState('')
  const [showResults, setShowResults] = useState(false)

  const canonicallyAnsweredQuestions = canonicallyAnsweredQuestionsRef.current
  const canonicalQuestionsNormalized = useMemo(
    () =>
      canonicallyAnsweredQuestions.map(({gdocId, title}) => ({
        gdocId,
        title,
        normalized: normalize(title),
      })),
    [canonicallyAnsweredQuestions]
  )

  const handleChange = debounce((value: string) => {
    setSearchInput(value)
    // TODO: implement search API BE
    runBaselineSearch(value, canonicalQuestionsNormalized).then(setBaselineSearchResults)
  }, 400)

  const results = baselineSearchResults
  const model = 'plaintext'

  return (
    <div>
      <label className="searchbar">
        <input
          type="search"
          name="searchbar"
          placeholder="Search for more questions here..."
          autoComplete="off"
          onChange={(e) => handleChange(e.currentTarget.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setShowResults(false)} // TODO: figure out accessibility - do not blur on keyboard navigation into the result list
        />
        <MagnifyingGlass />
      </label>
      <AutoHeight>
        <div className={`dropdown ${showResults && searchInput ? '' : 'hidden'}`}>
          <div>
            {showResults &&
              results.map(({gdocId, title, score}) => (
                <ResultItem
                  key={gdocId}
                  {...{
                    gdocId,
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
            href={`https://stampy.ai/wiki/Special:FormStart?form=Q&page_name=${searchInput}`}
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
  gdocId,
  title,
  score,
  model,
  onSelect,
  isAlreadyOpen,
}: {
  gdocId: string
  title: string
  score: number
  model: string
  onSelect: (gdocId: string) => void
  isAlreadyOpen: boolean
}) => {
  const handleSelect = (e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      // don't setShowResults(false) from input onBlur, allowing multiselect
      e.preventDefault()
    }
    onSelect(gdocId)
  }
  const tooltip = `score: ${score.toFixed(2)}, engine: ${model} ${
    isAlreadyOpen ? '(already open)' : ''
  }`

  return (
    <button
      className={`transparent-button result-item ${isAlreadyOpen ? 'already-open' : ''}`}
      key={gdocId}
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
  questions: SearchableItem[],
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

  const questionsScored: SearchResult[] = questions.map(({gdocId, title, normalized}) => ({
    gdocId,
    title,
    normalized,
    score: scoringFn(normalized),
  }))
  questionsScored.sort(byScore)
  console.log(questionsScored)

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
