import {useState, useEffect, ChangeEventHandler} from 'react'
import {tensor2d, matMul, Tensor2D} from '@tensorflow/tfjs'
import {load, UniversalSentenceEncoder} from '@tensorflow-models/universal-sentence-encoder'
import debounce from 'lodash/debounce'

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
  encodings: Tensor2D | []
  langModelPromise: Promise<UniversalSentenceEncoder>
}

export default function Search() {
  const [searchProps, setSearchProps] = useState<SearchProps>({
    questions: [],
    isReady: false,
    encodings: [],
    langModelPromise: load(), // load universal sentence encoder model
  })
  const [baselineSearchResults, setBaselineSearchResults] = useState<SearchResult[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    initSearch().then((props) => {
      console.debug(props)
      setSearchProps((current) => ({...current, ...props}))
    })
  }, [])

  const handleChange = debounce((value: string) => {
    console.debug('searching for:', value)
    runBaselineSearch(value, searchProps).then(setBaselineSearchResults)

    runSemanticSearch(value, searchProps).then((r) => r && setSearchResults(r))
  }, 300)

  return (
    <div>
      <input
        type="search"
        id="searchbar"
        name="searchbar"
        placeholder="What is your question?"
        onChange={(e) => {
          previousAbort.abort()
          handleChange(e.currentTarget.value)
        }}
        onFocus={() => setShowResults(true)}
        onBlur={() => setShowResults(false)}
      />
      {showResults && (
        <div className="dropdown">
          <div>
            Tensorflow debugging:
            {searchResults.map((result: SearchResult) => (
              <a key={result.title}>
                ({result.score.toFixed(2)}) {result.title}
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

const initSearch = async () => {
  const data = (await (await fetch('/assets/stampy-questions-encodings.json')).json()) as {
    questions: string[]
    encodings: number[]
  }
  const questions = data.questions.map((q) => ({title: q, normalized: normalize(q)}))
  const encodings = tensor2d(data.encodings)
  console.debug('question', questions.slice(0, 5))
  console.debug('encodings', encodings.slice(0, 5))

  return {
    isReady: true,
    questions,
    encodings,
  }
}

/**
 * Embed question, search for closest stampy question match among embedded list
 */
let previousAbort = new AbortController()
const runSemanticSearch = async (
  searchQueryRaw: string,
  searchProps: SearchProps,
  numResults = 5
): Promise<SearchResult[] | null> => {
  const currentAbort = new AbortController()
  previousAbort = currentAbort // global reference of the new mutable object

  const {isReady, questions, encodings, langModelPromise} = searchProps
  if (!isReady || !searchQueryRaw) {
    return []
  }

  const searchQuery = searchQueryRaw.toLowerCase().trim().replace(/\s+/g, ' ')
  console.debug('embed: ' + searchQuery)

  // encodings is 2D tensor of 512-dims embeddings for each sentence
  const langModel = await langModelPromise
  if (currentAbort.signal.aborted) {
    console.debug('aborted after langModel:', searchQuery)
    return null
  }

  const encoding: Tensor2D = await langModel.embed(searchQuery)
  if (currentAbort.signal.aborted) {
    console.debug('aborted after encoding:', searchQuery)
    return null
  }
  console.debug('encoding', encoding)

  // numerator of cosine similar is dot prod since vectors normalized
  const scores = await matMul(encoding, encodings, false, true).data()
  if (currentAbort.signal.aborted) {
    console.debug('aborted after scores:', searchQuery)
    return null
  }
  console.debug('scores', scores.slice(0, 5))

  const questionsScored: SearchResult[] = questions.map((question, index) => ({
    ...question,
    score: scores[index],
  }))
  questionsScored.sort(byScore)

  // tensorflow requires explicit memory management to avoid memory leaks
  encoding.dispose()
  console.debug('questionsScored', questionsScored.slice(0, numResults))

  return questionsScored.slice(0, numResults)
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

/**
 * Create sentence embeddings for all canonical questions (with answers) from stampy wiki
 */
const encodeQuestions = async (langModel: UniversalSentenceEncoder) => {
  console.log('encodeQuestions')

  const questions = (await (await fetch('/questions/allCanonical')).json()) as string[]
  const questionsLower = questions.map((title) => title.toLowerCase())

  // encoding all questions in 1 shot without batching
  // if run out of memory, encode sentences in mini_batches
  const encodings = await langModel.embed(questionsLower)
  encodings.print(true /* verbose */)

  return {
    isReady: true,
    questions,
    encodings,
    langModel,
  }
}
