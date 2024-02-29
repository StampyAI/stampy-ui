import {ReactNode} from 'react'
import {Link} from '@remix-run/react'
import './button.css'

type ButtonProps = {
  action?: string | (() => void)
  children?: ReactNode
  className?: string
  tooltip?: string
}
const Button = ({children, action, tooltip, className}: ButtonProps) => {
  const classes = ['button', className, tooltip && 'tooltip'].filter((i) => i).join(' ')
  if (typeof action === 'string') {
    return (
      <Link to={action} className={classes} data-tooltip={tooltip}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} onClick={action} data-tooltip={tooltip}>
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
