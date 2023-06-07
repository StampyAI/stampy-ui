import {useState, useEffect, MutableRefObject} from 'react'
import * as tf from '@tensorflow/tfjs'
import {load} from '@tensorflow-models/universal-sentence-encoder'
import {Tensor2D, TensorLike} from '@tensorflow/tfjs'

// optimization removes model validation, NaN checks, and other correctness checks in favor of performance
tf.enableProdMode()

const ENCODINGS_URL = 'https://storage.googleapis.com/stampy-nlp-resources/stampy-encodings.json'

export type Question = {
  pageid: string
  title: string
}
export type SearchResult = Question & {
  score: number
  model: string
  url?: string
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
export const makeBaselineSearcher =
  (questions: MutableRefObject<Question[]>, numResults = 5) =>
  async (searchQueryRaw: string): Promise<SearchResult[]> => {
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

    return questions.current
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

/**
 * Construct a semantic search function, that will search over the provided questions
 */
const semanticSearcher = async (questions: Question[], encodings: Tensor2D, numResults: number) => {
  const model = await load()

  return async (userQuery: string): Promise<SearchResult[]> => {
    const searchQuery = userQuery.toLowerCase().trim().replace(/\s+/g, ' ')

    // encodings is 2D tensor of 512-dims embeddings for each sentence
    const encoding = await model.embed(searchQuery)
    // numerator of cosine similar is dot prod since vectors normalized
    const scores = tf.matMul(encoding as unknown as TensorLike, encodings, false, true).dataSync()

    // tensorflow requires explicit memory management to avoid memory leaks
    encoding.dispose()

    const seen = new Set()
    return questions
      .map((question, index) => ({
        score: scores[index],
        model: 'tensorflow',
        ...question,
      }))
      .sort(byScore)
      .filter(({pageid}) => !seen.has(pageid) && seen.add(pageid))
      .slice(0, numResults)
  }
}
/**
 * Configure the search engine.
 *
 * This will download the embeddings for semantic search, but until that is set up, will
 * use baseline search over the list of questions already loaded on the site.
 * Searches containing only one or two words will also use the baseline search
 */
export const useSearch = (onSiteQuestions: MutableRefObject<Question[]>, numResults = 5) => {
  const baselineSearch = makeBaselineSearcher(onSiteQuestions, numResults)
  const [searchFn, setSearchFn] = useState(() => baselineSearch)

  useEffect(() => {
    const loadModel = async () => {
      // initialize search properties
      const {questions, pageids, encodings} = await fetch(ENCODINGS_URL).then((response) =>
        response.json()
      )

      const searcher = await semanticSearcher(
        pageids.map((pageid: string, i: number) => ({pageid, title: questions[i]})),
        tf.tensor2d(encodings),
        numResults
      )
      // warm up model for faster response later
      await searcher('What is AGI Safety?')
      setSearchFn(() => searcher)
    }
    loadModel()
  }, [numResults, onSiteQuestions])

  const search = async (value: string) => {
    const wordCount = value.split(' ').length
    if (wordCount <= 2) {
      return baselineSearch(value)
    } else {
      return searchFn(value)
    }
  }

  return {
    search,
  }
}
