
import {useState, useRef, useEffect} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {useLoaderData} from '@remix-run/react'

import * as tf from '@tensorflow/tfjs'
import * as use from '@tensorflow-models/universal-sentence-encoder';
//require('@tensorflow/tfjs');
//const use = require('@tensorflow-models/universal-sentence-encoder');

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

  //    onChange={(e) => console.log("change", e.target.value)} 
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