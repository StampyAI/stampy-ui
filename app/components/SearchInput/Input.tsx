import {useState} from 'react'
import MagnifyingIcon from '~/components/icons-generated/Magnifying'
import XIcon from '~/components/icons-generated/X'
import './input.css'

interface SearchInputProps {
  /**
   * Callback function to be called when the search input changes
   */
  onChange?: (search: string) => void
  /**
   * Custom styles
   */
  expandable?: boolean
  /**
   * Custom placeholder
   */
  placeholderText?: string
}
export const SearchInput = ({onChange, expandable, placeholderText}: SearchInputProps) => {
  const [search, setSearch] = useState('')

  const handleSearch = (search: string) => {
    setSearch(search)
    if (onChange) {
      onChange(search)
    }
  }

  const clear = () => handleSearch('')

  return (
    <div className={`search-box bordered ${expandable ? 'expandable' : ''}`}>
      <div className="search-content">
        <MagnifyingIcon className="iconsMagnifyingGlass" />
        <input
          name="searchbar"
          placeholder={placeholderText ?? 'Search articles'}
          className="search-input black"
          onKeyDown={(e) => {
            if (e.key === 'Escape') clear()
          }}
          onChange={(e) => {
            handleSearch(e.currentTarget.value)
          }}
          value={search}
        />
        {search !== '' && <XIcon className="x-icon" onClick={clear} />}
      </div>
    </div>
  )
}
