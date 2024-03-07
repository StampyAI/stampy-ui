import {useState, useEffect} from 'react'
import {Link as LinkElem} from '@remix-run/react'
import type {Tag} from '~/server-utils/stampy'
import {TOCItem, Category, ADVANCED, INTRODUCTORY} from '~/routes/questions.toc'
import {sortFuncs} from '~/routes/tags.$'
import {questionUrl, tagsUrl, tagUrl} from '~/routesMapper'
import Button from '~/components/Button'
import './dropdown.css'
import useIsMobile from '~/hooks/isMobile'

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
  const mobile = useIsMobile()
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
        .map((item: TOCItem) => (
          <Link key={`${item.pageid}-${item.title}`} to={questionUrl(item)} text={item.title} />
        ))}
    </div>
  )

  return shown ? null : (
    <div className="articles-dropdown-container bordered col-8">
      <div>
        <ArticlesSection
          category={INTRODUCTORY}
          toc={toc}
          className={mobile ? 'padding-bottom-40' : 'padding-bottom-32'}
        />
        <ArticlesSection
          category={ADVANCED}
          toc={toc}
          className={mobile ? 'padding-bottom-40' : ''}
        />
      </div>

      <div>
        {/*sorted right side*/}
        <div className="default-bold">Browse by category</div>

        {categories
          ?.sort(sortFuncs['by number of questions'])
          .slice(0, 12)
          .map((tag) => (
            <Link key={tag.rowId} className="teal-500" to={tagUrl(tag)} text={tag.name} />
          ))}

        <Button
          action={tagsUrl()}
          className={['secondary', mobile ? 'margin-top-40' : ''].join(' ')}
        >
          <span onClick={hide}> Browse all categories</span>
        </Button>
      </div>
    </div>
  )
}

export default ArticlesDropdown
