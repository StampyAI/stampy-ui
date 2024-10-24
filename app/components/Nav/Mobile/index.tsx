import {ElementType, useState} from 'react'
import {Link} from '@remix-run/react'
import AISafetyIcon from '~/components/icons-generated/Aisafety'
import ListLarge from '~/components/icons-generated/ListLarge'
import XLarge from '~/components/icons-generated/XLarge'
import CarrotLarge from '~/components/icons-generated/CarrotLarge'
import BotIcon from '~/components/icons-generated/Bot'
import OpenBookIcon from '~/components/icons-generated/OpenBook'
import MagnifyingLarge from '~/components/icons-generated/MagnifyingLarge'
import {NavProps} from '~/components/Nav'
import Button from '~/components/Button'
import '../nav.css'
import './navMobile.css'
import ArticlesDropdown from '~/components/ArticlesDropdown'
import Search from '~/components/search'

type State = 'initial' | 'search' | 'menu' | 'articles'

type MenuItemProps = {
  action: string | (() => void)
  label: string
  Icon: ElementType
  hasChildren?: boolean
}
const MenuItem = ({action, label, Icon, hasChildren}: MenuItemProps) => (
  <Button action={action} className="menu-item flex-row secondary full-width space-between">
    <p className="flex-row">
      <Icon className={'icon-margin'} />
      <span className="black">{label}</span>
    </p>
    {hasChildren && <CarrotLarge />}
  </Button>
)

const SearchBar = ({onClose}: {show?: boolean; onClose: () => void}) => (
  <div className="flex-row full-width search-bar">
    <Search className="full-width" />
    <XLarge className="pointer" onClick={onClose} />
  </div>
)

type MenuProps = {
  state: State
  setState: (state: State) => void
}
const Menu = ({state, setState}: MenuProps) => {
  const isMenu = state === 'menu'
  const isInitial = state === 'initial'
  const MenuIcon = isMenu ? XLarge : ListLarge
  return (
    (isInitial || isMenu) && (
      <header
        className={['top-header', 'z-index-3', isMenu && 'background'].filter(Boolean).join(' ')}
      >
        <div className="menu-item flex-row">
          <Link to="/" className="top-logo flex-double">
            <AISafetyIcon />
          </Link>

          {isInitial && (
            <MagnifyingLarge className="search-icon pointer" onClick={() => setState('search')} />
          )}
          <MenuIcon className="pointer" onClick={() => setState(isInitial ? 'menu' : 'initial')} />
        </div>

        {isMenu && (
          <MenuItem
            label="Articles"
            hasChildren
            Icon={OpenBookIcon}
            action={() => setState('articles')}
          />
        )}
        {isMenu && (
          <MenuItem
            label="AI safety Chatbot"
            Icon={BotIcon}
            action={() => (window.location.href = '/chat/')}
          />
        )}
      </header>
    )
  )
}

export const MobileNav = ({toc, categories}: NavProps) => {
  const [current, setCurrent] = useState<State>('initial')
  if (['initial', 'menu'].includes(current)) {
    return <Menu state={current} setState={setCurrent} />
  } else if (current === 'search') {
    return <SearchBar onClose={() => setCurrent('initial')} />
  } else {
    return (
      <header className="top-header z-index-3 background">
        <nav className="articles-header menu-item flex-row">
          <CarrotLarge className="reverse-icon" onClick={() => setCurrent('menu')} />
          <OpenBookIcon className="auto-left" />
          <span className="auto-right">Articles</span>
          <XLarge className="pointer" onClick={() => setCurrent('initial')} />
        </nav>

        <div className="articles-mobile" onClick={() => setCurrent('initial')}>
          <ArticlesDropdown fullWidth toc={toc} categories={categories || []} />
        </div>
      </header>
    )
  }
}
export default MobileNav
