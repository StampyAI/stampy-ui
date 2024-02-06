import React, {useState} from 'react'
import {OpenBookIcon} from '~/components/icons/OpenBook'
import {ChatBoxIcon} from '~/components/icons/ChatBox'
import {AISafetyIcon} from '~/components/icons/AISafety'
import {MagnifyingIcon} from '~/components/icons/Magnifying'
import MenuItem from '~/components/MenuItem'
import ArticlesDropdown from '~/components/ArticlesDropdown'
import type {Tag} from '~/server-utils/stampy'
import type {TOCItem} from '~/routes/questions/toc'

export interface NavBarProps {
  toc: TOCItem[]
  categories: Tag[]
}
export const NavBar = ({toc, categories}: NavBarProps) => {
  const [isSticky, setSticky] = useState(false)
  const MouseEnter = () => {
    setSticky(true)
  }
  const MouseLeave = () => {
    setSticky(false)
  }

  return (
    <header className="top-header">
      <nav className="top-nav">
        <a href="/" style={{width: '175px'}}>
          <AISafetyIcon classname={'top-logo'} />
        </a>
        <ul className="top-menu">
          <MenuItem
            primary={true}
            link="#"
            icon={<OpenBookIcon className={'top-menu-icon'} />}
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
            icon={<ChatBoxIcon className={'top-menu-icon'} />}
            text="Stampy chatbot"
          />
          <li className="top-menu-item">
            <div className="top-menu-divider"></div>
          </li>
        </ul>

        <div style={{flexGrow: 12}}></div>
        <div className={'search-box'}>
          <div className={'search-inputChild'} />
          <div className={'search-content'}>
            <MagnifyingIcon className={'iconsMagnifyingGlass'} />
            <input placeholder={'Search articles'} className={'search-input'}></input>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavBar
