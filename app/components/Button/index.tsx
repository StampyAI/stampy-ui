import {ReactNode} from 'react'
import {Link} from '@remix-run/react'
import './button.css'

type ButtonProps = {
  action?: string | (() => void)
  children?: ReactNode
  className?: string
  tooltip?: string
  icon?: ReactNode
  leftIcon?: ReactNode
}
const Button = ({children, action, tooltip, icon, leftIcon, className}: ButtonProps) => {
  const classes = ['button', className, tooltip && 'tooltip'].filter((i) => i).join(' ')
  if (typeof action === 'string') {
    return (
      <Link to={action} className={classes} data-tooltip={tooltip}>
        {leftIcon && leftIcon}
        {children}
        {icon && icon}
      </Link>
    )
  }
  return (
    <button className={classes} onClick={action} data-tooltip={tooltip}>
      {leftIcon && leftIcon}
      {children}
      {icon && icon}
    </button>
  )
}

export interface CompositeButtonProps {
  children: ReactNode
  className?: string
}
export const CompositeButton = ({children, className}: CompositeButtonProps) => (
  <div className={`composite-button ${className || ''}`}>{children}</div>
)

export default Button
