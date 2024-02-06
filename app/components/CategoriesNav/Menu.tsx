import React, {FunctionComponent} from 'react'
import './menu.css'
import {act} from 'react-dom/test-utils'
import {SearchInput} from '~/components/SearchInput/Input'
interface Question {
  title: string
  pageId: string
}
interface Category {
  name: string
  rowId: string
  tagId: number
  url: string
  internal: boolean
  questions: Question[]
}
interface CategoriesNavProps {
  /**
   * Articles List
   */
  categories: Category[]
  /**
   * Selected article
   */
  active: number
  /**
   * Callback function to handle click on article
   */
  onClick?: () => void
  /**
   * Callback function to handle change in search input
   */
  onChange?: () => void
}

export const CategoriesNav = ({categories, active, onclick, onChange}: CategoriesNavProps) => {
  const [selected, setSelected] = React.useState(active || 0)

  const handleClick = (index) => {
    setSelected(index)
    if (onclick) {
      onclick(index)
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
