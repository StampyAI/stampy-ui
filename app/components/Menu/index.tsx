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
  reload?: boolean
}
export const MenuItem = ({
  primary = false,
  link,
  icon,
  text,
  onMouseEnter,
  onMouseLeave,
  id,
  reload,
}: MenuItemProps) => {
  const Component = !reload ? Link : (props: {to: string}) => <a href={props.to} {...props} />
  return (
    <li className="top-menu-item" id={id} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Component to={link} className="top-menu-link">
        {icon ? (
          typeof icon === 'string' ? (
            <img loading="lazy" src={icon} className="top-menu-icon" alt={text} />
          ) : (
            icon
          )
        ) : null}

        <span className={['top-menu-text', primary ? '' : 'teal-500'].join(' ')}>{text}</span>
      </Component>
    </li>
  )
}

export default MenuItem
