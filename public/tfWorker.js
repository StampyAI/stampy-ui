importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs')
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder')

// optimization removes model validation, NaN checks, and other correctness checks in favor of performance
tf.enableProdMode()

let isReady = false
let langModel = undefined
let questions = []
let encodings = undefined

// initialize search properties
use.load().then(function (model) {
  langModel = model
  fetch('/assets/stampy-questions-encodings.json')
    .then((response) => response.json())
    .then((data) => {
      questions = data.questions
      pageids = data.pageids
      encodings = tf.tensor2d(data.encodings)
      // successfully loaded model & downloaded encodings
      isReady = true
      self.postMessage('ready')
      // warm up model for faster response later
      runSemanticSearch("What is AGI Safety?", 1)
    })
})

// listening for semantic search
self.onmessage = (e) => {
  runSemanticSearch(e.data)
}

const maxAttempts = 10
const runSemanticSearch = (searchQueryRaw, attempt = 1) => {
  numResults = 5

  if (!searchQueryRaw || attempt >= maxAttempts) {
    self.postMessage({searchResults: []})
    return
  }

  if (!isReady) {
    setTimeout(() => {
      runSemanticSearch(searchQueryRaw, attempt + 1)
    }, 1000)
    return
  }

  const searchQuery = searchQueryRaw.toLowerCase().trim().replace(/\s+/g, ' ')

  // encodings is 2D tensor of 512-dims embeddings for each sentence
  langModel.embed(searchQuery).then((encoding) => {
    // numerator of cosine similar is dot prod since vectors normalized
    const scores = tf.matMul(encoding, encodings, false, true).dataSync()

    // tensorflow requires explicit memory management to avoid memory leaks
    encoding.dispose()

    const questionsScored = questions.map((title, index) => ({
      title,
      pageid: pageids[index],
      score: scores[index],
    }))
    questionsScored.sort(byScore)
    const searchResults = questionsScored.slice(0, numResults)
    const numQs = questions.length

    self.postMessage({searchResults, numQs})
  })
}

const byScore = (a, b) => b.score - a.score
