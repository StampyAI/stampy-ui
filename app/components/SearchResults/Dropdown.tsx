import {FunctionComponent, ReactElement} from 'react'
import './dropdown.css'

export interface SearchResultsProps {
  /**
   * Result image
   */
  image: ReactElement
  /**
   * Result title
   */
  title: string
  /**
   * Result description
   */
  description: string
  /**
   * Result tags
   */
  source?: string
  /**
   * Result URL
   */
  url: string
}

export const SearchResults: FunctionComponent = ({results}: SearchResultsProps[]) => {
  const HandleClick = (url: string) => {
    window.location.href = url
  }

  const noResults = results.length === 0
  if (noResults) {
    return (
      <div className={'container-search-results'}>
        <div className={'search-result'}>No results found</div>
      </div>
    )
  }

  return (
    <div className={'container-search-results'}>
      {results.map((result) => {
        return (
          <div className={'search-result'} onClick={() => HandleClick(result.url)}>
            <div className={'search-result-image'}>{result.image}</div>
            <div className={'search-result-content'}>
              <div className={'search-result-title'}>{result.title}</div>
              <div className={'search-result-description'}>{result.description}</div>
              <div className={'search-result-source'}>{result.source}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
