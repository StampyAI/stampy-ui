import {useState} from 'react'
import {useOutletContext} from '@remix-run/react'
import type {Context} from '~/root'
import {NavBar} from './Nav'
import {FooterBar} from './Footer'
const year = new Date().getFullYear()

export const Header = () => {
  const {minLogo, embed} = useOutletContext<Context>()
  const [showMenu, setShowMenu] = useState(false)

  if (embed) return null

  return <NavBar categories={[]} toc={[]} />
}

export const Footer = () => {
  const {embed} = useOutletContext<Context>()

  if (embed) return null

  return <FooterBar />
}
