import {Link} from '@remix-run/react'
import Paper from '~/components/icons-generated/Paper'
import './dropdown.css'
import useIsMobile from '~/hooks/isMobile'

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

export const SearchResults = ({
  results,
  onSelect,
}: {
  results: SearchResultsProps[]
  onSelect?: () => void
}) => {
  const isMobile = useIsMobile()
  const noResults = results.length === 0
  if (noResults) {
    return (
      <div className="full-width z-index-2 container-search-results bordered">
        <div className="search-result">No results found</div>
      </div>
    )
  }

  return (
    <div className="container-search-results z-index-2 bordered" onClick={onSelect}>
      {results.map((result, i) => (
        <Link key={i} className="search-result" to={result.url}>
          <Paper />
          <div className="search-result-content">
            <h5 className={['search-result-title', isMobile ? 'xs-bold' : ''].join(' ')}>
              {result.title}
            </h5>
            <div className="search-result-description">{result.description}</div>
            <div className="search-result-source">{result.source}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
