import {useState, useEffect} from 'react'
//import {initSearch, runSearch} from '~/stampy'
//cannot import tensorflow multiple times registers backend/runtime
//import * as tf from '@tensorflow/tfjs'
//import * as use from '@tensorflow-models/universal-sentence-encoder';

export type SearchProps = {
  langModel: UniversalSentenceEncoder
  allQuestions: string[]
  allEncodings: tf.Tensor2D
}

export type SearchResult = {
  title: string
  score: number
}

export default function Search() {  
  const [searchProps, setSearchProps] = useState({})
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    initSearch().then(props => {
      //console.log('after initSearch')
      setSearchProps(props)
    })
    .catch (err => console.log("ERR:", err.message))
  }, []);

  const handleChange = (e) => {
    //console.log('handleChange', e.target.value);
    runSearch(e.target.value, searchProps).then(results => {
      setSearchResults(results)
    })
    .catch (err => console.log("ERR:", err.message))
  }

  return (
    <>
      <script src='https://cdn.jsdelivr.net/npm/@tensorflow/tfjs' type='text/javascript'></script>
      <script src='https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder' type='text/javascript'></script>
    <div>
      <input type='searchbar' id='searchbar' name='searchbar'
        defaultValue='What is your question?'
        onChange={handleChange} 
        onFocus={(e) => setShowResults(true)}         
        onBlur={(e) => setShowResults(false)}  
      />
      <div id='searchResults' className={showResults ? 'dropdown-content show' : 'dropdown-content'} >
      {searchResults.map((result: SearchResult) => (
        <a key={result.title}>({result.score}) {result.title}</a>
      ))}
      </div>
    </div>
    </>
  )
}

/**
 * Load universal sentence encoder model and cached questions + embeddings
 * @returns SearchProp with { model, allQuestions, allEncodings }
 * TODO: error checking?
 */
 export const initSearch = async () => {
  //console.log('initSearch')

  // load universal sentence encoder model
  const langModel = await use.load();
  //console.log('use.model loaded')

  const cachedEncodings = '/assets/stampy-questions-encodings.json'
  const data = await (await fetch(cachedEncodings)).json()
  //console.log('data', data)

  const allQuestions: string[] = data['questions']
  const allEncodings: tf.Tensor2D = tf.tensor2d(data['encodings'])
  //const allEncodings = tf.tensor2d(data['encodings'])

  const returnObj: SearchProps = { langModel, allQuestions, allEncodings }
  return returnObj
}

/**
 * Embed question, search for closest stampy question match among embedded list
 * @oaram searchQuery - user entered query string
 * @param searchProps - includes model, question list, and encodings
 * @param numResults - returns top k matches, default = 5
 * @returns list of matching question titles & scores {title:string, score:number}[]
 * TODO: error checking?
 */
 export const runSearch = async (searchQuery: string, props: SearchProps, numResults=5) =>  {
  // can't search until all encodings for questions exist
  if (!props.allEncodings) return;
 
  //console.log('runSearch', searchQuery)
  //console.log('props', props)
  //stampyAnimation.goToAndPlay(1, true);
 
  const question = searchQuery.toLowerCase().trim().replace(/\s+/g,' ')
  //console.log('embed: ' + question)

  // encodings is 2D tensor of 512-dims embeddings for each sentence
  let questionEncoding = await props.langModel.embed(question)
  //console.log('questionEncoding',questionEncoding)

  let searchResults: SearchResult[] = []
  // tensorflow requires explicit memory management to avoid memory leaks
  tf.tidy(() => {
    // numerator of cosine similar is dot prod since vectors normalized
    let scores = tf.matMul(questionEncoding, props.allEncodings, false, true).dataSync()
    //console.log('scores',scores)

    // wrapper with scores and index to track better, ideally would like to use tf.nn.top_k
    // TODO: find a more efficient way to search for best
    let scoresList: [number,number][] = []
    for (let i=0; i<scores.length; i++)
      scoresList[i] = [i,scores[i]]
    //let scoresList: [number,number][] = scores.map((score: number, index: number) => { return [score,index] }
    const topScores: [number,number][] = scoresList.sort((a: [number,number], b: [number,number]) => { return b[1] - a[1] })
    //console.log('topScores',topScores)

    // print top specified number of results by score
    for (let i = 0; i < numResults; i++)
    {
      //console.log(topScores[i][1].toFixed(2), props.allQuestions[topScores[i][0]])
      searchResults.push({'title': props.allQuestions[topScores[i][0]], 'score': topScores[i][1].toFixed(2)})
    }
  });
  questionEncoding.dispose()
  //console.log('searchResults',searchResults)

  return searchResults
}