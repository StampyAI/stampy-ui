import {useState} from 'react'
import {Link} from '@remix-run/react'
import {SearchInput} from '../SearchInput/Input'
import {Tag as TagType} from '~/server-utils/stampy'
import {tagUrl} from '~/routesMapper'
import './menu.css'
import useIsMobile from '~/hooks/isMobile'

interface CategoriesNavProps {
  /**
   * Categories List
   */
  categories: TagType[]
  /**
   * Id of selected category
   */
  activeCategoryId: number
  /**
   * Class name for the component
   */
  className?: string
}

export const CategoriesNav = ({categories, activeCategoryId, className}: CategoriesNavProps) => {
  const [search, onSearch] = useState('')
  const mobile = useIsMobile()
  return (
    <div className={['categoriesGroup bordered col-4-5', className].join(' ')}>
      {mobile ? <h1>Categories</h1> : <h4>Categories</h4>}
      <div>
        <SearchInput onChange={onSearch} placeholderText="Filter by keyword" />
      </div>
      {categories
        .filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
        .map(({tagId, name, questions}) => (
          <Link
            key={tagId}
            to={tagUrl({tagId, name})}
            className={['categoryTitle', activeCategoryId == tagId ? 'selected' : ''].join(' ')}
          >
            {name} ({questions.length})
          </Link>
        ))}
    </div>
  )
}
