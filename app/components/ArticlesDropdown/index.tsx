import type {Tag} from '~/server-utils/stampy'
import {TOCItem, Category, ADVANCED, INTRODUCTORY} from '~/routes/questions.toc'
import './dropdown.css'

const ArticlesSection = ({category, toc}: {category: Category; toc: TOCItem[]}) => (
  <div>
    <div className="articles-dropdown-title">{category}</div>
    {toc
      .filter((item) => item.category === category)
      .map(({pageid, title}: TOCItem) => (
        <a key={`${pageid}-${title}`} className="articles-dropdown-entry" href={`/${pageid}`}>
          {title}
        </a>
      ))}
  </div>
)

export type ArticlesDropdownProps = {
  toc: TOCItem[]
  categories: Tag[]
}
export const ArticlesDropdown = ({toc, categories}: ArticlesDropdownProps) => (
  <div className="articles-dropdown-container">
    <div className="articles-dropdown-grid">
      <ArticlesSection category={INTRODUCTORY} toc={toc} />
      <ArticlesSection category={ADVANCED} toc={toc} />
    </div>

    <div className="articles-dropdown-grid">
      {/*sorted right side*/}
      <div className="articles-dropdown-title">Browse by category</div>

      {categories?.map(({rowId, name}) => {
        return (
          <a key={rowId} className="articles-dropdown-teal-entry" href={`/tags/${name}`}>
            {name}
          </a>
        )
      })}

      <div className="dropdown-button">
        <a href="/tags" className="dropdown-button-label">
          Browse all categories
        </a>
      </div>
    </div>
  </div>
)

export default ArticlesDropdown
