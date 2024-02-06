import type {Tag} from '~/server-utils/stampy'
import type {TOCItem} from '~/routes/questions/toc'
import './dropdown.css'

const ArticlesSection = ({title, pageid, children}: TOCItem) => (
  <div key={pageid}>
    <div className="articles-dropdown-title">{title}</div>
    {children?.map(({pageid, title}: TOCItem) => (
      <a key={pageid} className="articles-dropdown-entry" href={`?state=${pageid}`}>
        {title}
      </a>
    ))}
  </div>
)

export type ArticlesDropdownProps = {
  toc: TOCItem[]
  categories: Tag[]
  isSticky: boolean
  MouseEnter: () => void
  MouseLeave: () => void
}
export const ArticlesDropdown = ({
  toc,
  categories,
  isSticky,
  MouseEnter,
  MouseLeave,
}: ArticlesDropdownProps) => (
  <div
    className="articles-dropdown-container"
    onMouseEnter={MouseEnter}
    onMouseLeave={MouseLeave}
    style={{display: isSticky ? 'flex' : 'none'}}
  >
    <div className="articles-dropdown-grid">{toc.map(ArticlesSection)}</div>

    <div className={'articles-dropdown-grid'}>
      {/*sorted right side*/}
      <div className={'articles-dropdown-title'}>Browse by category</div>

      {categories?.map(({rowId, name}) => {
        return (
          <a key={rowId} className={'articles-dropdown-teal-entry'} href={`/tags/${name}`}>
            {name}
          </a>
        )
      })}

      <div className={'dropdown-button'}>
        <a href="/tags" className={'dropdown-button-label'}>
          Browse all categories
        </a>
      </div>
    </div>
  </div>
)

export default ArticlesDropdown
