import React from 'react'
import {MenuItem} from '~/components/Menu'
import {OpenBookIcon} from '~/assets/OpenBook'
import {ChatBoxIcon} from '~/assets/ChatBox'
import {AISafetyIcon} from '~/assets/AISafety'
import ArticlesDropdown from '~/components/ArticlesDropdown'
import {SearchInput} from '~/components/SearchInput/Input'
import type {TOCItem} from '~/routes/questions.toc'
import type {Tag} from '~/server-utils/stampy'
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
            onMouseEnter={MouseEnter}
            onMouseLeave={MouseLeave}
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
