import {useOutletContext, Link} from '@remix-run/react'
import logoFunSvg from '../assets/stampy-logo.svg'
import logoMinSvg from '../assets/stampy-logo-min.svg'
import {Share, Users, Code, Tag} from './icons-generated'
import CopyLink from './copyLink'
import type {Context} from '~/root'

const year = new Date().getFullYear()

export const Header = () => {
  const {minLogo, embed} = useOutletContext<Context>()

  if (embed) return null

  return (
    <header className={minLogo ? 'min-logo' : 'fun-logo'}>
      <div className="logo-intro-group">
        <a href="/">
          <img className="logo" alt="logo" src={minLogo ? logoMinSvg : logoFunSvg} />
        </a>
        <div className="intro">
          {minLogo ? (
            <>
              Answering questions about
              <h1>AI Safety</h1>
            </>
          ) : (
            <>
              <h1>
                Welcome to <span className="highlight">stampy.ai</span>!
              </h1>
              I can answer questions about artificial general intelligence safety
            </>
          )}
        </div>
      </div>
      <div className="icon-link-group">
        <CopyLink>
          <Share />
          Share link
        </CopyLink>
        <a href="https://get_involved.aisafety.info" className="icon-link">
          <Users />
          Get Involved
        </a>
        <a href="https://github.com/StampyAI/stampy-ui" className="icon-link">
          <Code />
          Help Code
        </a>
        <a href="/tags/" className="icon-link">
          <Tag />
          Tags
        </a>
      </div>
    </header>
  )
}

export const Footer = () => {
  const {embed} = useOutletContext<Context>()

  if (embed) return null

  return (
    <footer>
      <a href="https://coda.io/d/AI-Safety-Info-Dashboard_dfau7sl2hmG/Copyright_su79L#_luPMa">
        © stampy.ai, 2022 - {year}
      </a>
    </footer>
  )
}
