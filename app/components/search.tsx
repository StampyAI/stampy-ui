import {useState, useEffect, ChangeEventHandler} from 'react'
// cannot import tensorflow multiple times registers backend/runtime
//import * as tf from '@tensorflow/tfjs'
//import * as use from '@tensorflow-models/universal-sentence-encoder'

type Question = {
  title: string
  normalized?: string
}

type SearchResult = Question & {
  score: number
}

type SearchProps = {
  isReady: boolean
  questions: Question[] | string[]
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
    setSearchResults(await runSemanticSearch(event.currentTarget.value, searchProps))
    //setSearchResults(await runBaselineSearch(event.currentTarget.value, searchProps))
  }

  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs" type="text/javascript"></script>
      <script
        src="https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder"
        type="text/javascript"
      ></script>
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
    </>
  )
}

const initSearch = async (): Promise<SearchProps> => {
  // load universal sentence encoder model
  const langModel = await use.load()
  console.debug('use.model loaded')

  const data = await (await fetch('/assets/stampy-questions-encodings.json')).json()
  const questions: string[] = data['questions']
  const encodings: tf.Tensor2D = tf.tensor2d(data['encodings'])
  console.debug('question', questions.slice(0, 5))
  console.debug('encodings', encodings.slice(0, 5))

  return {
    isReady: true,
    questions,
    encodings,
    langModel,
  }
}

/**
 * Embed question, search for closest stampy question match among embedded list
 */
const runSemanticSearch = async (
  searchQueryRaw: string,
  {isReady, questions, encodings, langModel}: SearchProps,
  numResults = 5
): Promise<SearchResult[]> => {
  if (!isReady || !searchQueryRaw) {
    return []
  }
  const question = searchQueryRaw.toLowerCase().trim().replace(/\s+/g, ' ')
  console.debug('embed: ' + question)

  // encodings is 2D tensor of 512-dims embeddings for each sentence
  const encoding: tf.Tensor2D = await langModel.embed(question)
  console.debug('encoding', encoding)

  // numerator of cosine similar is dot prod since vectors normalized
  const scores = tf.matMul(encoding, encodings, false, true).dataSync()
  console.debug('scores', scores.slice(0, 5))

  /* TODO: figure out why this doesn't work?
  const questionsScored: SearchResult[] = scores.map((score, index) => ({
    title: questions[index],
    score: score.toFixed(2)
  }))
  */
  let questionsScored: SearchResult[] = []
  for (let i = 0; i < scores.length; i++)
    questionsScored[i] = {title: questions[i], score: scores[i].toFixed(2)}
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
