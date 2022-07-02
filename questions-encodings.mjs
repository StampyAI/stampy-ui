// server side script called by GitHub Actions to periodically generate encodings stampy.ai wiki questions

// npm install process node-fetch @tensorflow/tfjs-node @tensorflow-models/universal-sentence-encoder
import * as tf from '@tensorflow/tfjs-node'
import * as use from '@tensorflow-models/universal-sentence-encoder'
import fetch from 'node-fetch'
import exit from 'process'
import * as fs from 'fs'

const filepath = 'public/assets/'
const filename = filepath + 'stampy-questions-encodings.json'

let prevNumQs = 0
if (fs.existsSync(filename)) {
  const p = JSON.parse(fs.readFileSync(filename, 'utf8'))
  prevNumQs = p.numQs
  console.log(`${prevNumQs} questions from in previous generated encodings.`)
}

const url =
  'https://stampy.ai/w/api.php?action=ask&query=[[Canonically%20answered%20questions]]|format%3Dplainlist|%3FCanonicalQuestions&format=json'
const r = await (await fetch(url)).json()
const response = r.query.results['Canonically answered questions'].printouts.CanonicalQuestions
console.log(`${response.length} questions fetched from the stampy.ai wiki.`)

const questions = response.map(({fulltext}) => fulltext)
const questionsNormalized = questions.map((question) => question.toLowerCase())
const numQs = questions.length

/*
// may not be safe risks if an existing question is reworded or the numQs added == removed.
if (prevNumQs == numQs) {
  console.log(`Number of canonically answered questions has not changed. No new encodings needed.`)
  // print or return something to let calling script know nothing changed, not to commit?
  process.exit(1)
}
*/

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
