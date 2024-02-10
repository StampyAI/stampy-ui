import {SearchInput} from '../SearchInput/Input'
import {Tag as TagType} from '~/server-utils/stampy'
import './menu.css'

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
   * Callback function to handle click on category
   */
  onClick?: (t: TagType) => void
  /**
   * Callback function to handle change in search input
   */
  onChange?: (search: string) => void
}

export const CategoriesNav = ({
  categories,
  activeCategoryId,
  onChange,
  onClick,
}: CategoriesNavProps) => {
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
              activeCategoryId == category.tagId ? ['active'].join(' ') : '',
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
