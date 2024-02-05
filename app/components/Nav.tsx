import {useState} from 'react'
import {OpenBookIcon} from '~/components/icons/OpenBook'
import {ChatBoxIcon} from '~/components/icons/ChatBox'
import {AISafetyIcon} from '~/components/icons/AISafety'
import {MagnifyingIcon} from '~/components/icons/Magnifying'
import MenuItem from '~/components/MenuItem'
import ArticlesDropdown from '~/components/ArticlesDropdown'

const IntroductorySections = {
  'Introduction to AI Safety': '/introduction-to-ai-safety',
  'Frequent questions guide': '/frequent-questions-guide',
  'Get involved with AI Safety': '/get-involved-with-ai-safety',
}
const AdvancedSections = {
  Governance: '/governance',
  'Predictions on advanced AI': '/predictions-on-advanced-ai',
  'Technical alignment research categories': '/technical-alignment-research-categories',
  'Existential risk concepts': '/existential-risk-concepts',
  'Prominent research organizations': '/prominent-research-organizations',
}
const BrowseByCategory = {
  Definitions: '/definitions',
  Objections: '/objections',
  Superintelligence: '/superintelligence',
  Contributing: '/contributing',
  'Existential risk': '/existential-risk',
  Catastrophe: '/catastrophe',
  'Research agendas': '/research-agendas',
  Governance: '/governance',
  Resources: '/resources',
  Capabilities: '/capabilities',
  'Machine learning': '/machine-learning',
  AGI: '/agi',
}
const BrowseAllCategories = '/browse-all-categories'
type ArticlesTree = {
  IntroductorySections?: Record<string, string>
  AdvancedSections?: Record<string, string>
  BrowseByCategory?: Record<string, string>
  BrowseAllCategories?: string
}

export interface NavBarProps {
  articles: ArticlesTree
}
export const NavBar = ({articles}: NavBarProps) => {
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
        <AISafetyIcon className="top-logo" />
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
            IntroductorySections={articles.IntroductorySections || IntroductorySections}
            AdvancedSections={articles.AdvancedSections || AdvancedSections}
            BrowseByCategory={articles.BrowseByCategory || BrowseByCategory}
            BrowseAllCategories={articles.BrowseAllCategories || BrowseAllCategories}
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
