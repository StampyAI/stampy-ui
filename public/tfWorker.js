// to import tfjs into worker from a cdn
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs')
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder')

// optimization removes model validation, NaN checks, and other correctness checks
// in favor of performance
tf.enableProdMode()

var isReady = false
var langModel = undefined
var questions = []
var encodings = undefined

// initialize search properties
use.load().then(function (model) {
  langModel = model
  fetch('/assets/stampy-questions-encodings.json')
    .then((response) => response.json())
    .then((data) => {
      questions = data.questions
      encodings = tf.tensor2d(data.encodings)
      // successfully loaded model & downloaded encodings
      isReady = true
      self.postMessage({isReady})
    })
})

// listening for semantic search
self.onmessage = (e) => {
  searchResults = runSemanticSearch(e.data)
}

const runSemanticSearch = (searchQueryRaw) => {
  numResults = 5

  if (!isReady || !searchQueryRaw) {
    return []
  }

  const searchQuery = searchQueryRaw.toLowerCase().trim().replace(/\s+/g, ' ')

  let encoding = []
  // encodings is 2D tensor of 512-dims embeddings for each sentence
  langModel.embed(searchQuery).then((encoding) => {
    // numerator of cosine similar is dot prod since vectors normalized
    const scores = tf.matMul(encoding, encodings, false, true).dataSync()

    // tensorflow requires explicit memory management to avoid memory leaks
    encoding.dispose()

    const questionsScored = questions.map((title, index) => ({
      title,
      score: scores[index].toFixed(2),
    }))
    questionsScored.sort(byScore)
    searchResults = questionsScored.slice(0, numResults)

    self.postMessage({isReady, searchResults})
  })
}

const byScore = (a, b) => b.score - a.score
