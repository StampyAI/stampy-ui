import React from 'react'
import './menu.css'
interface Article {
  title: string
  id: number
  dropdown?: null | Article[]
  isHeader?: boolean
}
interface ArticlesNavProps {
  /**
   * Articles List
   */
  articles: Article[]
  /**
   * Selected article
   */
  active: 0
  /**
   * Callback function to handle click on article
   */
  onClick?: () => void
}

export const ArticlesNav = ({articles, active}: ArticlesNavProps) => {
  const [selected, setSelected] = React.useState(active || 0)
  // function to open dropdown on click of article
  const [dropdowns, setDropdowns] = React.useState([])
  const handleDropdown = (index) => {
    const newDropdowns = [...dropdowns]
    if (newDropdowns.includes(index)) {
      const indexToRemove = newDropdowns.indexOf(index)
      newDropdowns.splice(indexToRemove, 1)
    } else {
      newDropdowns.push(index)
    }
    setDropdowns(newDropdowns)
  }
  const handleClick = (index) => {
    setSelected(index)
    if (onclick) {
      onclick(index)
    }
  }

  return (
    <div className={'articles-group'}>
      {articles.map((article) => {
        if (article.isHeader) {
          return (
            <div
              key={`article-${article.id}`}
              className={[
                'articles-autoLayoutHorizontal',
                selected == article.id ? ['active', 'article-hasdot'].join(' ') : '',
              ].join(' ')}
              onClick={() => handleClick(article.id)}
            >
              <div className={['articles-headerLine']}>{article.title}</div>

              <div className={'articles-line'} />
              {/*<div className={"articles-rectangle"} />*/}
            </div>
          )
        } else {
          return (
            <div
              key={`article-${article.id}`}
              className={[
                'articles-autoLayoutHorizontal',
                selected == article.id ? ['active'].join(' ') : '',
              ].join(' ')}
              onClick={() => handleClick(article.id)}
            >
              <div
                className={[
                  'articles-title',
                  selected == article.id ? ['article-hasdot'].join(' ') : '',
                ].join(' ')}
              >
                {article.title}
                {article?.dropdown && article.dropdown.length !== 0 ? (
                  <div
                    onClick={() => handleDropdown(article.id)}
                    className={[
                      'articles-dropdownIcon',
                      dropdowns.includes(article.id) ? 'active' : '',
                    ].join(' ')}
                  />
                ) : null}
              </div>

              <div
                className={[
                  'articles-dropdown',
                  dropdowns.includes(article.id) ? 'active' : '',
                ].join(' ')}
              >
                {article.dropdown?.map((dropdownArticle) => {
                  return (
                    <div
                      key={`dropdown-article-${dropdownArticle.id}`}
                      className={'articles-dropdown-item'}
                    >
                      {dropdownArticle.title}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}
