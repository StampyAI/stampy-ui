import {useState, useEffect} from 'react'
//import {encodeQuest} from '~/stampy'
//cannot import tensorflow multiple times registers backend/runtime
//import * as tf from '@tensorflow/tfjs'
//import * as use from '@tensorflow-models/universal-sentence-encoder';

type SearchProps = {
  langModel: UniversalSentenceEncoder
  allQuestions: string[]
  allEncodings: tf.Tensor2D
  isReady: boolean
}

type SearchResult = {
  title: string
  score: number
}

export default function Search() {  
  const [searchProps, setSearchProps] = useState({
    langModel: undefined, allQuestions: [], allEncoding: undefined, isReady: false
  })
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    initSearch().then((props) => {
      //console.log('after initSearch')
      setSearchProps(props)
    })
    .catch (err => console.log("ERR:", err.message))
  }, []);

  const handleChange = ((event) => {
    const searchQuery = event.target.value;
    console.log('handleChange', searchQuery);

    if (searchQuery.match(/^###$/)) {
      // hack to test encodeQuestions by typing '###' in searchbar
      encodeQuestions(searchProps.langModel).then((props) => {
          //console.log('after encodeQuestions')
          setSearchProps(props)
      })
      .catch (err => console.log("ERR:", err.message))
    }
    else if (searchQuery.match(/^@@@$/)) {
      // hack to test downloadEncodings by typing '@@@' in searchbar
      downloadEncodings(searchProps).then((props) => {
          //console.log('after encodeQuestions')
          setSearchProps(props)
      })
      .catch (err => console.log("ERR:", err.message))
    }
    else {
      runSearch(searchQuery, searchProps).then(results => {
        setSearchResults(results)
      })
      .catch (err => console.log("ERR:", err.message))  
    }
  })

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
 * @returns SearchProps - with { model, allQuestions, allEncodings }
 * TODO: error checking?
 */
 const initSearch = async () => {
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

  const returnObj: SearchProps = {
    langModel, allQuestions, allEncodings, isReady: true
  }
  return returnObj
}

/**
 * Embed question, search for closest stampy question match among embedded list
 * @oaram searchQuery - user entered query string
 * @param searchProps - includes model, question list, and encodings
 * @param numResults - returns top number of matching results, default = 5
 * @returns list of matching question titles & scores {title:string, score:number}[]
 * TODO: error checking?
 */
const runSearch = async (searchQuery: string, props: SearchProps, numResults=5) =>  {
  // can't search until all encodings for questions exist
  if (!props.isReady) return;
 
  //console.log('runSearch', searchQuery)
  //console.log('props', props)
  //stampyAnimation.goToAndPlay(1, true);
 
  const question = searchQuery.toLowerCase().trim().replace(/\s+/g,' ')
  //console.log('embed: ' + question)

  // encodings is 2D tensor of 512-dims embeddings for each sentence
  const questionEncoding: tf.Tensor2D = await props.langModel.embed(question)
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
    for (let i = 0; i < scores.length; i++)
      scoresList[i] = [i,scores[i]]
    //let scoresList: [number,number][] = scores.map((score: number, index: number) => { return [score,index] }
    const topScores: [number,number][] = scoresList.sort((a: [number,number], b: [number,number]) => { return b[1] - a[1] })
    //console.log('topScores',topScores)

    // print top specified number of results by score
    for (let i = 0; i < numResults; i++)
    {
      //console.log(topScores[i][1].toFixed(2), props.allQuestions[topScores[i][0]])
      searchResults[i] = {
        title: props.allQuestions[topScores[i][0]], 
        score: topScores[i][1].toFixed(2)}
    }
  });
  questionEncoding.dispose()
  //console.log('searchResults',searchResults)

  return searchResults
}

/**
 * Create sentence embeddings for all canonical questions (with answers) from stampy wiki
 * @oaram model - initialized universal sentence encoder
 * @returns SearchProp with { model, allQuestions, allEncodings }
 * TODO: error checking?
*/
const encodeQuestions = async (langModel: UniversalSentenceEncoder) => {
  console.log('encodeQuestions');

  // allQuestions must already downloaded from wiki or other source
  // const stampyQueryCanonical = `https://stampy.ai/w/api.php?action=ask&query=[[Canonical%20questions]]|format%3Dplainlist|%3FCanonicalQuestions&format=json`
  // const stampyQueryCanonical = `https://stampy.ai/w/api.php?action=ask&query=[[Canonically%20answered%20questions]]|format%3Dplainlist|%3FCanonicalQuestions&format=json`
  // TODO: double check headers to bypass CORS policy issue, for now reading from cached values?
  const stampyQueryCanonical = `https://www.cheng2.com/share/stampy-canonical-qs.txt`
  // console.log('stampyQueryCanonical', stampyQueryCanonical)

  const data = await (await fetch(stampyQueryCanonical)).json()
  // TODO: index into 0th key instead of by name?
  // const response = data.query.results?.[0].printouts.CanonicalQuestions;
  const response = data.query.results['Canonical questions'].printouts.CanonicalQuestions;

  // reinitialize encodings & question lists
  let allEncodings = undefined
  const allQuestions = response.map((elem) => elem['fulltext'])

  // encoding questions in lowercase
  const formattedQuestions = allQuestions.map((elem) => elem.toLowerCase())
  // console.log(allQuestions)

  // encoding all questions in 1 shot without batching
  // if run out of memory, encode sentences in mini_batches
  // console.log('encoding 0..end')  
  allEncodings = await langModel.embed(formattedQuestions)
  allEncodings.print(true /* verbose */);

  const returnObj: SearchProps = {
    langModel, allQuestions, allEncodings, isReady: true
  }
  return returnObj
 }

/**
 * Generic file download to browser filesystem.
 * @oaram data 
 * @param fileName
 * @returns void
*/
const downloadFile = (data: any, fileName: string) =>  {
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", data);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();  
}

/**
 * Save allQuestions and allEncodings which can be later cached
 * @oaram SearchProps - needed to extract questions + encodings
 * TODO: really should save to server instead
*/
const downloadEncodings = async (props: SearchProps) =>  {
  console.log('downloadEncodings');
  let exportObj = JSON.stringify({ questions: props.allQuestions, encodings: props.allEncodings.arraySync() });
  let fileName = "stampy-questions-encodings.json";
  let data = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);

  // console.log(data);
  downloadFile(data, fileName);
}