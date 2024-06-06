import {ReactNode} from 'react'
import {Link} from '@remix-run/react'
import './button.css'

type ButtonProps = {
  action?: string | (() => void)
  children?: ReactNode
  className?: string
  tooltip?: string
  disabled?: boolean
  active?: boolean
  secondary?: boolean
  props?: {[k: string]: any}
}
const Button = ({
  children,
  action,
  secondary,
  tooltip,
  className,
  disabled = false,
  active = false,
  props,
}: ButtonProps) => {
  const classes = [
    (secondary && 'button-secondary') || 'button',
    className,
    tooltip && !secondary && 'tooltip',
  ]
    .filter((i) => i)
    .join(' ')
  if (typeof action === 'string') {
    return (
      <Link
        to={action}
        className={classes + ' ' + (secondary && (active ? 'active' : disabled ? '' : 'inactive'))}
        data-tooltip={tooltip}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
          }
        }}
        {...props}
      >
        {children}
        {secondary && tooltip && !disabled && <p className="tool-tip-secondary xs">{tooltip}</p>}
      </Link>
    )
  }
  return (
    <button
      className={classes + ' ' + (secondary && (active ? 'active' : disabled ? '' : 'inactive'))}
      onClick={action}
      data-tooltip={tooltip}
      disabled={disabled}
      {...props}
    >
      {children}
      {secondary && tooltip && !disabled && <p className="tool-tip-secondary xs">{tooltip}</p>}
    </button>
  )
}

export interface CompositeButtonProps {
  children: ReactNode
  className?: string
  secondary?: boolean
}
export const CompositeButton = ({children, className = '', secondary}: CompositeButtonProps) => (
  <div
    className={`shadowed ${(secondary ? 'composite-button-secondary' : 'composite-button') + ' ' + className}`}
  >
    {children}
  </div>
)

export default Button
