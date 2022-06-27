import {useState, useEffect, ChangeEventHandler} from 'react'

type Question = {
  title: string
  normalized: string
}

type SearchResult = Question & {
  score: number
}

type SearchProps = {
  isReady: boolean
  questions: Question[]
  encodings?: any
  langModel?: any
}

export default function Search() {
  const [searchProps, setSearchProps] = useState<SearchProps>({
    questions: [],
    isReady: false,
  })
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    initSearch().then((props) => {
      console.debug(props)
      setSearchProps(props)
    })
  }, [])

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    setSearchResults(await runBaselineSearch(event.currentTarget.value, searchProps))
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
        <div id="searchResults" className="dropdown-content">
          {searchResults.map((result: SearchResult) => (
            <a key={result.title}>
              ({result.score}) {result.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

const initSearch = async (): Promise<SearchProps> => {
  const questionsRaw = (await (await fetch('/questions/allCanonical')).json()) as string[]
  const questions = questionsRaw.map((title) => ({
    title,
    normalized: normalize(title),
  }))
  return {
    isReady: true,
    questions,
  }
}

/** Baseline full-text search matching the query with each question as strings, weighting down:
 *  short words,
 *  wh* questions,
 *  distance,
 *  partial (prefix) match without full match
 *  normalized to ignore a/an/the, punctuation, and case
 */
const runBaselineSearch = async (
  searchQueryRaw: string,
  {isReady, questions, encodings, langModel}: SearchProps,
  numResults = 10
): Promise<SearchResult[]> => {
  if (!isReady || !searchQueryRaw) {
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

    return Math.round((score / totalWeight) * 100)
  }

  const questionsScored: SearchResult[] = questions.map(({title, normalized}) => ({
    title,
    normalized,
    score: scoringFn(normalized),
  }))
  questionsScored.sort(byScore)

  return questionsScored.slice(0, numResults).filter(({score}) => score > 0)
}

/** ignore unimportant details for similarity comparison */
const normalize = (question: string) =>
  question
    .toLowerCase()
    .replace(/[^\w ]|\b(?:an?|the?)\b|(?<=\w{2})s\b/g, '')
    .replace(/\s+|_|&\s*/g, ' ')
    .trim()

/** sort function for the highest score on top */
const byScore = (a: SearchResult, b: SearchResult) => b.score - a.score
