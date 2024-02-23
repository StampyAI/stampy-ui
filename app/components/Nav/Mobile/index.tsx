import React from 'react'
import {Link} from '@remix-run/react'
import AISafetyIcon from '~/components/icons-generated/Aisafety'
import {ListLarge} from '~/components/icons-generated'
import {XLarge} from '~/components/icons-generated'
import {CarrotLarge} from '~/components/icons-generated'
import OpenBookIcon from '~/components/icons-generated/OpenBook'
import BotIcon from '~/components/icons-generated/Bot'
import {NavProps} from '~/components/Nav'
import Button from '~/components/Button'
import '../nav.css'
import './navMobile.css'
import {sortFuncs} from '~/routes/tags.$'
import {questionUrl, tagsUrl, tagUrl} from '~/routesMapper'
import {TOCItem} from '~/routes/questions.toc'
export const MobileNav = ({toc, categories}: NavProps) => {
  const [showMenu, setShowMenu] = React.useState(false)
  const [showArticles, setShowArticles] = React.useState(false)
  const toggleMenu = () => {
    setShowMenu(!showMenu)
    setShowArticles(false)
  }
  console.log('toc', toc)
  return (
    <header className="top-header">
      {!showArticles && (
        <>
          <nav className="top-nav">
            <Link to="/" className="top-logo">
              <AISafetyIcon />
            </Link>
            {!showMenu ? (
              <ListLarge className={'menu-button'} onClick={toggleMenu} />
            ) : (
              <XLarge className={'menu-button'} onClick={toggleMenu} />
            )}
          </nav>
          {showMenu && (
            <div className="mobile-menu">
              <Button
                action={() => setShowArticles(!showArticles)}
                className="secondary full-width space-between"
                icon={<CarrotLarge />}
              >
                <p className={'composite-elements'}>
                  <OpenBookIcon className={'icon-margin'} />
                  Articles
                </p>
              </Button>
              <Button action="https://xkcd.com/285/" className="secondary full-width flex-start">
                <p className={'composite-elements'}>
                  <BotIcon className={'icon-margin'} />
                  Stampy chatbot
                </p>
              </Button>
            </div>
          )}
        </>
      )}
      {showArticles && (
        <>
          <nav className="articles-header">
            <CarrotLarge className={'back-icon'} onClick={() => setShowArticles(false)} />
            <p className={'composite-elements'}>
              <OpenBookIcon className={'icon-margin'} />
              Articles
            </p>
            <XLarge className={'menu-button'} onClick={toggleMenu} />
          </nav>

          <div className={'articles-mobile'}>
            <div className="default-bold margin-bottom">Introductory</div>
            {toc
              .filter((item) => item.category === 'Introductory')
              .map((item: TOCItem) => (
                <Link
                  key={`${item.pageid}-${item.title}`}
                  className="articles-entry"
                  to={questionUrl(item)}
                >
                  {item.title}
                </Link>
              ))}
            <div className="default-bold margin-bottom top-margin">Advanced</div>
            {toc
              .filter((item) => item.category === 'Advanced')
              .map((item: TOCItem) => (
                <Link
                  key={`${item.pageid}-${item.title}`}
                  to={questionUrl(item)}
                  className="articles-entry"
                >
                  {item.title}
                </Link>
              ))}
            <div className="default-bold margin-bottom top-margin">Browse by category</div>
            {categories
              ?.sort(sortFuncs['by number of questions'])
              .slice(0, 12)
              .map((tag) => (
                <Link
                  key={tag.rowId}
                  className="articles-dropdown-teal-entry articles-entry"
                  to={tagUrl(tag)}
                >
                  {tag.name}
                </Link>
              ))}
            <Button action={tagsUrl()} className="secondary">
              <span> Browse all categories</span>
            </Button>
          </div>
        </>
      )}
    </header>
  )
}
export default MobileNav
