import {useState} from 'react'
import {MagnifyingIcon} from '~/assets/Magnifying'
import {XIcon} from '~/assets/X'
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
}
export const SearchInput = ({onChange, expandable}: SearchInputProps) => {
  const [search, setSearch] = useState('')
  const handleSearch = (search: string) => {
    setSearch(search)
    if (onChange) {
      onChange(search)
    }
  }
  return (
    <div className={`search-box ${expandable ? 'expandable' : ''}`}>
      <div className={'search-inputChild'} />
      <label className={'search-content'}>
        <MagnifyingIcon className={'iconsMagnifyingGlass'} />
        <input
          type="search"
          name="searchbar"
          placeholder={'Search articles'}
          className={'search-input'}
          onChange={(e) => {
            handleSearch(e.currentTarget.value)
          }}
          value={search}
        ></input>
        {search === '' ? null : (
          <XIcon
            classname={'x-icon'}
            onClick={() => {
              setSearch('')
              if (onChange) {
                onChange('')
              }
            }}
          />
        )}
      </label>
    </div>
  )
}
