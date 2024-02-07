import './dropdown.css'

export interface SearchResultsProps {
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

export const SearchResults = ({results}: {results: SearchResultsProps[]}) => {
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
      {results.map((result, i) => {
        return (
          <a key={i} className={'search-result'} href={result.url}>
            <div className={'search-result-image'}>
              {/* TODO: static image, same for all results, not a property of result */}
            </div>
            <div className={'search-result-content'}>
              <div className={'search-result-title'}>{result.title}</div>
              <div className={'search-result-description'}>{result.description}</div>
              <div className={'search-result-source'}>{result.source}</div>
            </div>
          </a>
        )
      })}
    </div>
  )
}
