import React from 'react'
import {MenuItem} from '../Menu/MenuItem'
import {OpenBookIcon} from '~/assets/OpenBook.tsx'
import {ChatBoxIcon} from '../../assets/ChatBox.tsx'
import {AISafetyIcon} from '../../assets/AISafety.tsx'
import ArticlesDropdown from '../ArticlesDropdown'
import {SearchInput} from '../SearchInput/Input'
import './nav.css'

export interface NavBarProps {
    toc: TOCItem[]
    categories: Tag[]
}
export const NavBar = ({toc, categories}: NavBarProps) => {
  const [isSticky, setSticky] = React.useState(false)
  const MouseEnter = () => {
    setSticky(true)
  }
  const MouseLeave = () => {
    setSticky(false)
  }

  return (
    <header className="top-header">
      <nav className="top-nav">
        <a href="/">
          <AISafetyIcon classname={'top-logo'} />
        </a>
        <ul className="top-menu">
          <MenuItem
            primary={true}
            link="#"
            icon={<OpenBookIcon classname={'top-menu-icon'} />}
            text="Articles"
            onMouseEnter={MouseEnter}
          />
          <ArticlesDropdown
              isSticky={isSticky}
              MouseEnter={MouseEnter}
              MouseLeave={MouseLeave}
              toc={toc}
              categories={categories}
          />
          <MenuItem
            primary={true}
            link="#"
            icon={<ChatBoxIcon classname={'top-menu-icon'} />}
            text="Stampy chatbot"
          />
          <li className="top-menu-item">
            <div className="top-menu-divider"></div>
          </li>
        </ul>

        <div style={{flexGrow: 12}}></div>
        <SearchInput />
      </nav>
    </header>
  )
}
export default NavBar
