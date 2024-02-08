import type {Tag} from '~/server-utils/stampy'
import {TOCItem, Category, ADVANCED, INTRODUCTORY} from '~/routes/questions.toc'
import './dropdown.css'
import {sortFuncs} from '~/routes/tags._index'


const Link = ({to, text, className}: {to: string, text: string, className?: string}) => (
    <div className={"articles-dropdown-entry " + (className || '')}>
        <a className="unstyled" href={to}>
            {text}
        </a>
    </div>
)

const ArticlesSection = ({category, toc}: {category: Category; toc: TOCItem[]}) => (
  <div>
    <div className="articles-dropdown-title">{category}</div>
    {toc
      .filter((item) => item.category === category)
      .map(({pageid, title}: TOCItem) => (<Link key={`${pageid}-${title}`} to={`/${pageid}`} text={title} />))}
  </div>
)

export type ArticlesDropdownProps = {
  toc: TOCItem[]
  categories: Tag[]
}
export const ArticlesDropdown = ({toc, categories}: ArticlesDropdownProps) => (
  <div className="articles-dropdown-container bordered">
    <div className="articles-dropdown-grid">
      <ArticlesSection category={INTRODUCTORY} toc={toc} />
      <ArticlesSection category={ADVANCED} toc={toc} />
    </div>

    <div className="articles-dropdown-grid">
      {/*sorted right side*/}
      <div className="articles-dropdown-title">Browse by category</div>

      {categories
        ?.sort(sortFuncs['by number of questions'])
        .slice(0, 12)
        .map(({rowId, name}) => (
          <Link
            key={rowId}
            className="articles-dropdown-teal-entry"
            to={`/tags/${name}`}
            text={name}
          />
        ))}

      <div className="dropdown-button bordered grey">
        <a href="/tags" className="dropdown-button-label unstyled">
          Browse all categories
        </a>
      </div>
    </div>
  </div>
)

export default ArticlesDropdown
