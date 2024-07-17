import {useEffect, useState} from 'react'
import {useSearchParams} from '@remix-run/react'
import debounce from 'lodash/debounce'
import {useSearch} from '~/hooks/useSearch'
import {SearchInput} from './SearchInput/Input'
import {SearchResults} from './SearchResults/Dropdown'
import {questionUrl} from '~/routesMapper'
import useOutsideOnClick from '~/hooks/useOnOutsideClick'

type Props = {
  limitFromUrl?: number
  className?: string
}

export default function Search({limitFromUrl, className}: Props) {
  const [searchParams] = useSearchParams()
  const [showResults, setShowResults] = useState(false)
  const [searchPhrase, setSearchPhrase] = useState('')

  const {search, isPendingSearch, results, clear, loadedQuestions} = useSearch(limitFromUrl)
  const clickDetectorRef = useOutsideOnClick(() => setShowResults(false))

  const searchFn = (rawValue: string) => {
    const value = rawValue.trim()
    if (value === searchPhrase) return
    setSearchPhrase(value)

    if (value) {
      search(value)
      logSearch(value)
    } else {
      clear()
    }
  }

  useEffect(() => {
    const query = searchParams.get('q')
    if (loadedQuestions && query) {
      searchFn(query)
      setShowResults(true)
    }
    // Properly adding all dependancies would require transforming `searchFn` into a callback
    // or something, which in turn would cause this `useEffect` to be called a lot more often.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedQuestions, searchParams])

  const handleChange = debounce(searchFn, 100)

  return (
    <div
      className={`relative ${className}`}
      onFocus={() => setShowResults(true)}
      ref={clickDetectorRef}
    >
      <SearchInput expandable onChange={handleChange} />
      <div className={`search-loader ${isPendingSearch ? 'loader' : ''}`}> </div>
      {isPendingSearch && results.length == 0 && (
        <div className="result-item-box no-questions">Searching for questions...</div>
      )}
      {!isPendingSearch && searchPhrase && showResults && (
        <SearchResults
          onSelect={() => setShowResults(false)}
          results={results.map((r) => ({
            title: r.title,
            url: questionUrl(r),
            description: '', // TODO: fetch descriptions 🤔
          }))}
        />
      )}
    </div>
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
