import {useState, useEffect} from 'react'
import {Link as LinkElem} from '@remix-run/react'
import type {Tag} from '~/server-utils/stampy'
import {TOCItem, Category, ADVANCED, INTRODUCTORY} from '~/routes/questions.toc'
import {sortFuncs} from '~/routes/categories.$'
import {questionUrl, tagsUrl, tagUrl} from '~/routesMapper'
import Button from '~/components/Button'
import './dropdown.css'
import useIsMobile from '~/hooks/isMobile'

type LinkProps = {
  to: string
  text: string
  pageid?: string
  className?: string
  onClick: () => void
}
const Link = ({to, text, pageid, className, onClick}: LinkProps) => (
  <div className={'articles-dropdown-entry ' + (className || '')}>
    <LinkElem to={to} onClick={onClick} state={{section: pageid}}>
      {text}
    </LinkElem>
  </div>
)

type ArticlesSectionProps = {
  category: Category
  toc: TOCItem[]
  className?: string
  hide: () => void
}
const ArticlesSection = ({category, toc, className, hide}: ArticlesSectionProps) => {
  // Create the custom TOCItem for "How can I help?" that redirects to the splash page
  const howCanIHelpItem: TOCItem = {
    title: 'How can I help?',
    pageid: 'how-can-i-help',
    hasText: true,
    category: INTRODUCTORY,
    order: 999, // Place it at the end
    ttr: 15,
  }

  const items = toc
    .filter((item) => item.category === category)
    .concat(category === INTRODUCTORY ? [howCanIHelpItem] : [])

    return (
      <div className={className || ''}>
        <div className="default-bold">{category} sections</div>
        {items.map((item: TOCItem) => {
          // Determine the correct URL based on whether it's how-can-i-help or not
          const to = item.pageid === 'how-can-i-help' ? '/how-can-i-help' : questionUrl(item)
          
          return (
            <Link
              key={`${item.pageid}-${item.title}`}
              to={to}
              text={item.title}
              pageid={item.pageid}
              onClick={hide}
            />
          )
        })}
      </div>
    )
  }

export type ArticlesDropdownProps = {
  toc: TOCItem[]
  categories: Tag[]
  fullWidth?: boolean
}
export const ArticlesDropdown = ({toc, categories, fullWidth}: ArticlesDropdownProps) => {
  // The dropdown works by using the onHover pseudoclass, so will only hide once
  // the mouse leaves it. When using client side changes, the mouse doesn't leave
  // it, so it's always shown (until the mouse is moved out, of course). To get around
  // this, use this variable to simply not render the dropdown for one render, which
  // will reset the CSS onHover checker.
  const [hidden, setHidden] = useState(false)
  const hide = () => setHidden(true)
  useEffect(() => setHidden(false), [hidden])
  const mobile = useIsMobile()

  return hidden ? null : (
    <div
      className={`articles-dropdown-container bordered ${fullWidth ? 'full-width' : 'col-8'} z-index-4`}
    >
      <div className={(fullWidth ? '' : 'col-5 ') + 'toc'}>
        <ArticlesSection
          category={INTRODUCTORY}
          toc={toc}
          className={mobile ? 'padding-bottom-40' : 'padding-bottom-32'}
          hide={hide}
        />
        <ArticlesSection
          category={ADVANCED}
          toc={toc}
          className={mobile ? 'padding-bottom-40' : ''}
          hide={hide}
        />
      </div>
      <div className={fullWidth ? '' : 'col-4'}>
        {/*sorted right side*/}
        <div className="default-bold">Browse by category</div>

        <div className="padding-bottom-8">
          {categories
            ?.sort(sortFuncs['by number of questions'])
            .slice(0, 12)
            .map((tag) => (
              <Link
                key={tag.rowId}
                className="teal-500"
                to={tagUrl(tag)}
                text={tag.name}
                onClick={hide}
              />
            ))}
        </div>

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
