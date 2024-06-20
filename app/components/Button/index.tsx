import {ReactNode} from 'react'
import {Link} from '@remix-run/react'
import './button.css'
import useIsMobile from '~/hooks/isMobile'

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
  const mobile = useIsMobile()

  const classes = [
    (secondary && 'button-secondary') || 'button',
    className,
    secondary && active && 'active',
    secondary && !active && !disabled && 'inactive',
  ]
    .filter((i) => i)
    .join(' ')
  if (typeof action === 'string') {
    return (
      <Link
        to={action}
        className={classes}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
          }
        }}
        {...props}
      >
        {children}
        {tooltip && !disabled && !mobile && <p className="tool-tip xs z-index-1">{tooltip}</p>}
      </Link>
    )
  }
  return (
    <button className={classes} onClick={action} disabled={disabled} {...props}>
      {children}
      {tooltip && !disabled && !mobile && <p className="tool-tip xs z-index-1">{tooltip}</p>}
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
