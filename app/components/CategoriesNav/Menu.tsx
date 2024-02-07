import {useState} from 'react'
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
  active: number
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
  const [selected, setSelected] = useState(active || 0)

  const handleClick = (index: number) => {
    setSelected(index)
    if (onClick) {
      onClick(index)
    }
  }

  return (
    <div className={'categories-group'}>
      <div className={'category-autoLayoutHorizontal'}>
        <div className={'category-nav-title'}>Categories</div>
      </div>
      <SearchInput onChange={onChange} style={{margin: '16px 24px'}} />
      {categories.map((category) => {
        return (
          <div
            key={`category-${category.tagId}`}
            className={[
              'category-autoLayoutHorizontal',
              selected == category.tagId ? ['active'].join(' ') : '',
            ].join(' ')}
            onClick={() => handleClick(category.tagId)}
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
