import React from 'react'
import {Link} from '@remix-run/react'
import AISafetyIcon from '~/components/icons-generated/Aisafety'
import {ListLarge} from '~/components/icons-generated'
import {XLarge} from '~/components/icons-generated'
import {CarrotLarge} from '~/components/icons-generated'
import OpenBookIcon from '~/components/icons-generated/OpenBook'
import BotIcon from '~/components/icons-generated/Bot'
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
                    <MagnifyingLarge className={'search-icon'} onClick={toggleSearch} />
                    <ListLarge className={'menu-button'} onClick={() => setShowMenu(true)} />
                  </div>
                ) : (
                  <XLarge className={'menu-button'} onClick={toggleMenu} />
                )}
              </>
            )}

            {showSearch ? (
              <div className={'mobile-searchbar'}>
                <XLarge className={'menu-button'} onClick={toggleMenu} />
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
                  Articles
                </p>
                <CarrotLarge />
              </Button>
              <Button action="https://xkcd.com/285/" className="secondary full-width flex-start">
                <p className={'composite-elements small'}>
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
            <ArticlesDropdown toc={toc} categories={categories || []} />
          </div>
        </>
      )}
    </header>
  )
}
export default MobileNav
