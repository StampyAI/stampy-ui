import React from 'react'
import {Link} from '@remix-run/react'
import './menuItem.css'

interface MenuItemProps {
  link: string
  icon?: React.ReactNode | string
  text: string
  /**
   * Is this the primary class of Menu link?
   */
  primary?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  id?: string
}
export const MenuItem = ({
  primary = false,
  link,
  icon,
  text,
  onMouseEnter,
  onMouseLeave,
  id,
}: MenuItemProps) => {
  return (
    <li className="top-menu-item" id={id} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link to={link} className="top-menu-link">
        {icon ? (
          typeof icon === 'string' ? (
            <img loading="lazy" src={icon} className="top-menu-icon" alt={text} />
          ) : (
            icon
          )
        ) : null}

        <span className={['top-menu-text', primary ? '' : 'secondary'].join(' ')}>{text}</span>
      </Link>
    </li>
  )
}

export default MenuItem
