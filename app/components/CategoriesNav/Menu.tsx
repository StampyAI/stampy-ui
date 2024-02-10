import {SearchInput} from '../SearchInput/Input'
import {Tag as TagType} from '~/server-utils/stampy'
import './menu.css'

interface CategoriesNavProps {
  /**
   * Articles List
   */
  categories: TagType[]
  /**
   * Selected article
   */
  active: TagType
  /**
   * Callback function to handle click on article
   */
  onClick?: (t: TagType) => void
  /**
   * Callback function to handle change in search input
   */
  onChange?: (search: string) => void
}

export const CategoriesNav = ({categories, active, onChange, onClick}: CategoriesNavProps) => {
  const handleClick = (newTag: TagType) => {
    if (onClick) {
      onClick(newTag)
    }
  }

  return (
    <div className={'categories-group'}>
      <div className={'category-autoLayoutHorizontal'}>
        <div className={'category-nav-title'}>Categories</div>
      </div>
      <SearchInput onChange={onChange} />
      {categories.map((category) => {
        return (
          <div
            key={`category-${category.tagId}`}
            className={[
              'category-autoLayoutHorizontal',
              active?.tagId == category.tagId ? ['active'].join(' ') : '',
            ].join(' ')}
            onClick={() => handleClick(category)}
          >
            <div className={'category-title'}>
              {category.name} ({category.questions.length})
            </div>
          </div>
        )
      })}
    </div>
  )
}
