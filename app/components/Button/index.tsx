import {ReactNode} from 'react'
import {Link} from '@remix-run/react'
import './button.css'

type ButtonProps = {
  action?: string | (() => void)
  children?: ReactNode
  className?: string
  tooltip?: string
  icon?: ReactNode
  disabled?: boolean
}
const Button = ({children, action, tooltip, icon, className, disabled = false}: ButtonProps) => {
  const classes = ['button', className, tooltip && 'tooltip'].filter((i) => i).join(' ')
  if (typeof action === 'string') {
    return (
      <Link to={action} className={classes} data-tooltip={tooltip}>
        {children}
        {icon && icon}
      </Link>
    )
  }
  return (
    <button className={classes} onClick={action} data-tooltip={tooltip} disabled={disabled}>
      {children}
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
