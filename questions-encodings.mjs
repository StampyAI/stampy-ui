// server side script called by GitHub Actions to periodically generate encodings stampy.ai wiki questions

// npm install node-fetch @tensorflow/tfjs-node @tensorflow-models/universal-sentence-encoder
// node questions-encodings.mjs
import * as tf from '@tensorflow/tfjs-node' // do not remove import, `tf` is needed in following module even if not used in this file
import * as use from '@tensorflow-models/universal-sentence-encoder'
import fetch from 'node-fetch'
import * as fs from 'fs'

// purge wiki cache to ensure getting latest update of questions
// https://www.mediawiki.org/wiki/API:Purge
// POST version of https://stampy.ai/w/api.php?action=purge&titles=Canonically_answered_questions%7CCanonical_answers%7CCanonical_questions
const urlPurge = 'https://stampy.ai/w/api.php'
const params = {
  action: 'purge',
  titles: 'Canonically_answered_questions|Canonical_answers|Canonical_questions',
  format: 'json',
}
const options = {
  method: 'POST',
  body: JSON.stringify(params),
  headers: {'Content-Type': 'application/json'},
}
await fetch(urlPurge, options)

const filepath = 'public/assets/'
const filename = filepath + 'stampy-questions-encodings.json'

let prevNumQs = 0
if (fs.existsSync(filename)) {
  const p = JSON.parse(fs.readFileSync(filename, 'utf8'))
  prevNumQs = p.numQs
  console.log(`${prevNumQs} questions from in previous generated encodings.`)
}

const urlQuery =
  'https://stampy.ai/w/api.php?action=ask&query=[[Canonically%20answered%20questions]]|format%3Dplainlist|%3FCanonicalQuestions&format=json'
const r = await (await fetch(urlQuery)).json()
const response = r.query.results['Canonically answered questions'].printouts.CanonicalQuestions
console.log(`${response.length} questions fetched from the stampy.ai wiki.`)

const questions = response.map(({fulltext}) => fulltext)
const questionsNormalized = questions.map((question) => question.toLowerCase())
const numQs = questions.length

const model = await use.load()
console.log(`Tensorflow's universal sentence encoder model loaded.`)

const encodings = (await model.embed(questionsNormalized)).arraySync()
console.log(`Questions encoded.`)

let data = JSON.stringify({numQs, questions, encodings})

fs.writeFile(filename, data, (err) => {
  if (err) {
    console.error(err)
  }
})

console.log(`Successfully saved all questions and encodings from stampy.ai wiki to ${filename}.`)
