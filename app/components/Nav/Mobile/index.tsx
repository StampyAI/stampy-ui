import React from 'react'
import {Link} from '@remix-run/react'
import AISafetyIcon from '~/components/icons-generated/Aisafety'
import {ListLarge} from '~/components/icons-generated'
import {XLarge} from '~/components/icons-generated'
import {CarrotLarge} from '~/components/icons-generated'
import OpenBookIcon from '~/components/icons-generated/OpenBook'
import MagnifyingLarge from '~/components/icons-generated/MagnifyingLarge'
import {NavProps} from '~/components/Nav'
import Button from '~/components/Button'
import '../nav.css'
import './navMobile.css'
import ArticlesDropdown from '~/components/ArticlesDropdown'
import Search from '~/components/search'
export const MobileNav = ({toc, categories}: NavProps) => {
  const [showMenu, setShowMenu] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)
  const [showArticles, setShowArticles] = React.useState(false)
  const toggleMenu = () => {
    setShowMenu(false)
    setShowArticles(false)
    setShowSearch(false)
  }
  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }
  return (
    <header className={['top-header', showArticles || showMenu ? 'expanded' : ''].join(' ')}>
      {!showArticles && (
        <>
          <nav className="top-nav">
            {!showSearch && (
              <>
                <Link to="/" className="top-logo">
                  <AISafetyIcon />
                </Link>

                {!showMenu ? (
                  <div>
                    <MagnifyingLarge className="search-icon pointer" onClick={toggleSearch} />
                    <ListLarge className="pointer" onClick={() => setShowMenu(true)} />
                  </div>
                ) : (
                  <XLarge className="pointer" onClick={toggleMenu} />
                )}
              </>
            )}

            {showSearch ? (
              <div className={'mobile-searchbar'}>
                <XLarge className="pointer" onClick={toggleMenu} />
                <Search />
              </div>
            ) : null}
          </nav>
          {showMenu && (
            <div className="mobile-menu">
              <Button
                action={() => setShowArticles(!showArticles)}
                className="secondary full-width space-between"
              >
                <p className={'composite-elements small'}>
                  <OpenBookIcon className={'icon-margin'} />
                  <span className="black">Articles</span>
                </p>
                <CarrotLarge />
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
            <XLarge className="pointer" onClick={toggleMenu} />
          </nav>

          <div className={'articles-mobile'} onClick={toggleMenu}>
            <ArticlesDropdown toc={toc} categories={categories || []} />
          </div>
        </>
      )}
    </header>
  )
}
export default MobileNav
