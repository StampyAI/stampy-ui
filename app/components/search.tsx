import {useState, useEffect, useRef} from 'react'
import debounce from 'lodash/debounce'
import {useSearch} from '~/hooks/useSearch'
import {Question} from '~/server-utils/stampy'
import {SearchInput} from './SearchInput/Input'
import {fetchAllQuestionsOnSite} from '~/routes/questions.allQuestionsOnSite'
import {SearchResults} from './SearchResults/Dropdown'

type Props = {
  queryFromUrl?: string
  limitFromUrl?: number
  removeQueryFromUrl?: () => void
}

const empty: [] = []

export default function Search({queryFromUrl, limitFromUrl, removeQueryFromUrl}: Props) {
  const [showResults, setShowResults] = useState(!!queryFromUrl)
  const searchInputRef = useRef('')

  const onSiteAnswersRef = useRef<Question[]>(empty)
  useEffect(() => {
    // not needed for initial screen => lazy load on client
    fetchAllQuestionsOnSite().then(({data, backgroundPromiseIfReloaded}) => {
      onSiteAnswersRef.current = data
      backgroundPromiseIfReloaded.then((x) => {
        if (x) onSiteAnswersRef.current = x.data
      })
    })
  }, [])

  const {search, isPendingSearch, results} = useSearch(onSiteAnswersRef, limitFromUrl)

  const searchFn = (rawValue: string) => {
    const value = rawValue.trim()
    if (value === searchInputRef.current) return

    searchInputRef.current = value

    search(value)
    logSearch(value)
  }

  // run search if queryFromUrl is provided initially or if it pops from browser history after it was removed,
  // update url if searchInput changes,
  // and use current version of functions without affecting deps
  const searchInput = searchInputRef.current
  const searchFnRef = useRef(searchFn)
  searchFnRef.current = searchFn
  const removeQueryFromUrlRef = useRef(removeQueryFromUrl)
  removeQueryFromUrlRef.current = removeQueryFromUrl
  const queryFromUrlWasRemoved = useRef(false)
  useEffect(() => {
    if (queryFromUrl) {
      if (!searchInput || queryFromUrlWasRemoved.current) {
        searchFnRef.current(queryFromUrl)
        queryFromUrlWasRemoved.current = false
        const inputEl = document.querySelector('input[name="searchbar"]') as HTMLInputElement
        inputEl.value = queryFromUrl
      } else if (queryFromUrl !== searchInput) {
        removeQueryFromUrlRef.current?.()
        queryFromUrlWasRemoved.current = true
      }
    }
  }, [queryFromUrl, searchInput])

  const handleChange = debounce(searchFn, 100)

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 100)
  }

  return (
    <>
      <div onFocus={() => setShowResults(true)} onBlur={handleBlur}>
        <SearchInput expandable onChange={handleChange} />
        <div className={`search-loader ${isPendingSearch ? 'loader' : ''}`}> </div>
        {isPendingSearch && results.length == 0 && (
          <div className="result-item-box no-questions">Searching for questions...</div>
        )}
        {searchInput && showResults && (
          <SearchResults
            results={results.map((r) => ({
              title: r.title,
              url: `/${r.pageid}`,
              description: '', // TODO: fetch descriptions 🤔
            }))}
          />
        )}
      </div>
    </>
  )
}
/**
 * Handle flushing searched phrases to the NLP logger endpoint
 */
let prevSearch = ''
let lastTimestamp = 0

const logSearch = (value: string) => {
  setTimeout(shouldFlushSearch(value, prevSearch), 4000)
  lastTimestamp = Date.now()
  prevSearch = value
}

const shouldFlushSearch = (value: string, prevSearch: string) => () => {
  const substring = prevSearch.startsWith(value) || value.startsWith(prevSearch)
  const timeDiff = Math.abs(Date.now() - lastTimestamp)
  const logValue = (value: string) =>
    fetch(`/questions/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'search',
        query: value,
        type: location?.hostname,
      }),
    })

  // The searched value is totally different from the previous one - assume that they
  // are searching for something new, and log the previous search value
  if (prevSearch !== '' && !substring) {
    logValue(prevSearch)
    // The user has stopped typing for more than 4s - they either type very slowly,
    // have gotten distracted, or have found what they were looking for, so might as well log it
  } else if (value !== '' && timeDiff > 4000) {
    logValue(value)
  }
}
