// server side script called by GitHub Actions to periodically generate encodings stampy.ai wiki questions

// npm install node-fetch @tensorflow/tfjs-node @tensorflow-models/universal-sentence-encoder
import * as tf from '@tensorflow/tfjs-node'
import * as use from '@tensorflow-models/universal-sentence-encoder'
import fetch from 'node-fetch'
import * as fs from 'fs'

//const filepath = '~/public/assets/'
const filename = 'stampy-questions-encodings.json'

const url =
  'https://stampy.ai/w/api.php?action=ask&query=[[Canonically%20answered%20questions]]|format%3Dplainlist|%3FCanonicalQuestions&format=json'
const r = await (await fetch(url)).json()
const response = r.query.results['Canonically answered questions'].printouts.CanonicalQuestions
console.log(`Fetched ${response.length} questions from the stampy.ai wiki.`)

const questions = response.map(({fulltext}) => fulltext)
const questionsNormalized = questions.map((question) => question.toLowerCase())

const model = await use.load()
console.log(`Tensorflow's universal sentence encoder model loaded.`)

const encodings = (await model.embed(questionsNormalized)).arraySync()
console.log(`Questions encoded.`)

let data = JSON.stringify({questions, encodings})

fs.writeFile(filename, data, (err) => {
  if (err) {
    console.error(err)
  }
})

console.log(`Successfully saved all questions and encodings from stampy.ai wiki to ${filename}.`)
