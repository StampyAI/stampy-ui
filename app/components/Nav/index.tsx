import {Link} from '@remix-run/react'
import {MenuItem} from '~/components/Menu'
import OpenBookIcon from '~/components/icons-generated/OpenBook'
import BotIcon from '~/components/icons-generated/Bot'
import AISafetyIcon from '~/components/icons-generated/Aisafety'
import ArticlesDropdown from '~/components/ArticlesDropdown'
import type {TOCItem} from '~/routes/questions.toc'
import type {Tag} from '~/server-utils/stampy'
import './nav.css'
import Search from '../search'

export interface NavProps {
  toc: TOCItem[]
  categories?: Tag[]
}
export const Nav = ({toc, categories}: NavProps) => {
  return (
    <header className="top-header">
      <nav className="top-nav">
        <Link to="/" className="top-logo">
          <AISafetyIcon />
        </Link>
        <ul className="top-menu small">
          <MenuItem
            primary={true}
            link="#"
            icon={<OpenBookIcon />}
            text="Articles"
            id="showArticles"
          />
          <ArticlesDropdown toc={toc} categories={categories || []} />
          <MenuItem
              primary={true}
              link="https://chat.aisafety.info"
              icon={<BotIcon />}
              text="Stampy chatbot"
          />
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
export default Nav
