import {useState} from 'react'
import {Link} from '@remix-run/react'
import {SearchInput} from '../SearchInput/Input'
import {Tag as TagType} from '~/server-utils/stampy'
import {tagUrl} from '~/routesMapper'
import './categoriesnav.css'

interface CategoriesPageProps {
  /**
   * Categories List
   */
  categories: TagType[]
}

export const CategoriesPage = ({categories}: CategoriesPageProps) => {
  const [search, onSearch] = useState('')
  return (
    <div className={'categoriesPage col-12'}>
      <h1>Categories</h1>
      <div>
        <SearchInput onChange={onSearch} placeholderText="Filter by keyword" />
      </div>
      <div className={'categories-results'}>
        {categories
          .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
          .map(({tagId, name, questions}) => (
            <Link key={tagId} to={tagUrl({tagId, name})} className={'categoryTitle'}>
              {name} ({questions.length})
            </Link>
          ))}
      </div>
    </div>
  )
}
