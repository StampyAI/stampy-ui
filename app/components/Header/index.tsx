import {MenuItem} from '~/components/Menu'
import OpenBookIcon from '~/components/icons-generated/OpenBook'
import ChatBoxIcon from '~/components/icons-generated/Chatbot'
import AISafetyIcon from '~/components/icons-generated/Aisafety'
import ArticlesDropdown from '~/components/ArticlesDropdown'
import type {TOCItem} from '~/routes/questions.toc'
import type {Tag} from '~/server-utils/stampy'
import './nav.css'
import Search from '../search'

export interface HeaderProps {
  toc: TOCItem[]
  categories: Tag[]
}
export const Header = ({toc, categories}: HeaderProps) => {
  return (
    <header className="top-header">
      <nav className="top-nav">
        <a href="/" className="top-logo">
          <AISafetyIcon />
        </a>
        <ul className="top-menu">
          <MenuItem
            primary={true}
            link="#"
            icon={<OpenBookIcon />}
            text="Articles"
            id="showArticles"
          />
          <ArticlesDropdown toc={toc} categories={categories} />
          <MenuItem primary={true} link="#" icon={<ChatBoxIcon />} text="Stampy chatbot" />
          <li className="top-menu-item">
            <div className="top-menu-divider"></div>
          </li>
        </ul>
        <div style={{flexGrow: 12}}></div>
        <Search />
      </nav>
    </header>
  )
}
export default Header
