import React from 'react'
import './input.css'
import {MagnifyingIcon} from '../../assets/Magnifying.tsx'
import {XIcon} from '../../assets/X'

interface SearchInputProps {
  /**
   * Callback function to be called when the search input changes
   */
  onChange?: (search: string) => void
  /**
   * Custom styles
   */
  style?: React.CSSProperties
}
export const SearchInput = ({onChange, style}) => {
  const [search, setSearch] = React.useState('')
  const handleSearch = (search) => {
    setSearch(search)
    if (onChange) {
      onChange(search)
    }
  }
  return (
    <div className={'search-box'} style={style}>
      <div className={'search-inputChild'} />
      <div className={'search-content'}>
        <MagnifyingIcon classnamme={'iconsMagnifyingGlass'} />
        <input
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
      </div>
    </div>
  )
}
