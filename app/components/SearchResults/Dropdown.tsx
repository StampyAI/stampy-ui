import {Link} from '@remix-run/react'
import Paper from '~/components/icons-generated/Paper'
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
      <div className="container-search-results">
        <div className="search-result">No results found</div>
      </div>
    )
  }

  return (
    <div className="container-search-results">
      {results.map((result, i) => (
        <Link key={i} className="search-result" to={result.url}>
          <Paper />
          <div className="search-result-content">
            <div className="search-result-title">{result.title}</div>
            <div className="search-result-description">{result.description}</div>
            <div className="search-result-source">{result.source}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
