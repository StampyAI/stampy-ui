import {useState} from 'react'
import {Link} from '@remix-run/react'
import {SearchInput} from '../SearchInput/Input'
import {Tag as TagType} from '~/server-utils/stampy'
import {tagUrl} from '~/routesMapper'
import styles from './menu.module.css'

interface CategoriesNavProps {
  /**
   * Categories List
   */
  categories: TagType[]
  /**
   * Id of selected category
   */
  activeCategoryId: number
}

export const CategoriesNav = ({categories, activeCategoryId}: CategoriesNavProps) => {
  const [search, onSearch] = useState('')
  return (
    <div className={styles.categoriesGroup + ' bordered col-4-5'}>
      <h4>Categories</h4>
      <div>
        <SearchInput onChange={onSearch} placeholderText="Filter by keyword" />
      </div>
      {categories
        .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
        .map(({tagId, name, questions}) => (
          <Link
            key={tagId}
            to={tagUrl({tagId, name})}
            className={[
              styles.categoryTitle,
              activeCategoryId == tagId ? 'teal-50-background' : '',
            ].join(' ')}
          >
            {name} ({questions.length})
          </Link>
        ))}
    </div>
  )
}
