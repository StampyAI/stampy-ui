
import * as tf from '@tensorflow/tfjs'
import {useState, useRef, useEffect} from 'react'
import {stampyQuestions, stampyEncodings} from '~/components/questions-encodings'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {useLoaderData} from '@remix-run/react'

  
 type LoaderData = {
    allQuestions: string[], 
    allEncodings: number[][]
//    allEncodings: tf.Tensor
  }

  export const loader: LoaderFunction = async ({request}): Promise<LoaderData> => {

    //let allQuestions = stampyQuestions;
    //let allEncodings = tf.tensor(stampyEncodings);
    //return { allQuestions: stampyQuestions, allEncodings: tf.tensor(stampyEncodings) };    
    return await { allQuestions: stampyQuestions, allEncodings: stampyEncodings };    
  }

function Results() {
  return (
    <div id="searchResults" className="dropdown-content">
      <a href="#m1">Match 1</a>
      <a href="#m2">Match 2</a>
      <a href="#m3">Match 3</a>
      <a href="#m4">Match 4</a>
      <a href="#m5">Match 5</a>
    </div>
  )
}

export default function Search() {  

    //const {allQuestions, allEncodings} = useLoaderData<LoaderData>();
    const [searchQ, setSearchQ] = useState('What is your question?');
    const [showResults, setShowResults] = useState(false);
    
    const searchResults = useRef();
    useEffect(() => {
        console.log('searchResults', searchResults);
        if (showResults)
          searchResults.current.classList.add("show");
        else
          searchResults.current.classList.remove("show");          
    }, [showResults]);

    return (
        <div>
            <input type="searchbar" id="searchbar" name="searchbar" 
                className="invisible"
                defaultValue='What is your question?'
                onChange={(e) => console.log("change", e.target.value)} 
                onFocus={(e) => setShowResults(true)}         
                onBlur={(e) => setShowResults(false)}  
                 />
            <div ref={searchResults} id="searchResults" className="dropdown-content" >
                <a href="#m1">Match 1</a>
                <a href="#m2">Match 2</a>
                <a href="#m3">Match 3</a>
                <a href="#m4">Match 4</a>
                <a href="#m5">Match 5</a>
            </div>
        </div>
    )
}