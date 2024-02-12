import {useState} from 'react'
import {Link} from '@remix-run/react'
import {SearchInput} from '../SearchInput/Input'
import {Tag as TagType} from '~/server-utils/stampy'
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
    <div className={styles.categoriesGroup}>
      <h4>Categories</h4>
      <SearchInput onChange={onSearch} placeholderText="Filter by keyword" />
      {categories
        .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
        .map(({tagId, name, questions}) => (
          <Link
            to={`/tags/${tagId}/${name}`}
            key={tagId}
            className={[
              styles.categoryAutoLayoutHorizontal,
              activeCategoryId == tagId ? styles.active : '',
            ].join(' ')}
          >
            <div className={styles.categoryTitle}>
              {name} ({questions.length})
            </div>
          </Link>
        ))}
    </div>
  )
}
