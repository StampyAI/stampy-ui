import {useState, useEffect} from 'react'
import {Link as LinkElem} from '@remix-run/react'
import type {Tag} from '~/server-utils/stampy'
import {TOCItem, Category, ADVANCED, INTRODUCTORY} from '~/routes/questions.toc'
import {buildTagUrl, sortFuncs} from '~/routes/tags.$'
import Button from '~/components/Button'
import './dropdown.css'

export type ArticlesDropdownProps = {
  toc: TOCItem[]
  categories: Tag[]
}
export const ArticlesDropdown = ({toc, categories}: ArticlesDropdownProps) => {
  // The dropdown works by using the onHover pseudoclass, so will only hide once
  // the mouse leaves it. When using client side changes, the mouse doesn't leave
  // it, so it's always shown (until the mouse is moved out, of course). To get around
  // this, use this variable to simply not render the dropdown for one render, which
  // will reset the CSS onHover checker.
  const [shown, setShown] = useState(false)
  const hide = () => setShown(true)
  useEffect(() => setShown(false), [shown])

  const Link = ({to, text, className}: {to: string; text: string; className?: string}) => (
    <div className={'articles-dropdown-entry ' + (className || '')}>
      <LinkElem to={to} onClick={hide}>
        {text}
      </LinkElem>
    </div>
  )

  const ArticlesSection = ({
    category,
    toc,
    className,
  }: {
    category: Category
    toc: TOCItem[]
    className?: string
  }) => (
    <div className={className || ''}>
      <div className="default-bold">{category}</div>
      {toc
        .filter((item) => item.category === category)
        .map(({pageid, title}: TOCItem) => (
          <Link key={`${pageid}-${title}`} to={`/${pageid}`} text={title} />
        ))}
    </div>
  )

  return shown ? null : (
    <div className="articles-dropdown-container bordered">
      <div>
        <ArticlesSection category={INTRODUCTORY} toc={toc} className="padding-bottom-32" />
        <ArticlesSection category={ADVANCED} toc={toc} />
      </div>

      <div>
        {/*sorted right side*/}
        <div className="default-bold">Browse by category</div>

        {categories
          ?.sort(sortFuncs['by number of questions'])
          .slice(0, 12)
          .map((tag) => (
            <Link
              key={tag.rowId}
              className="articles-dropdown-teal-entry"
              to={buildTagUrl(tag)}
              text={tag.name}
            />
          ))}

        <Button action="/tags/" className="secondary">
          <span onClick={hide}> Browse all categories</span>
        </Button>
      </div>
    </div>
  )
}

export default ArticlesDropdown
