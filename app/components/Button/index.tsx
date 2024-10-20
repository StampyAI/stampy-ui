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
  size?: 'default' | 'large' | 'small'
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
  size,
  props,
}: ButtonProps) => {
  const mobile = useIsMobile()

  const classes = [
    'default',
    (secondary && 'button-secondary') || 'button',
    className,
    secondary && active && 'active',
    secondary && !active && !disabled && 'inactive',
    size,
  ]
    .filter((i) => i)
    .join(' ')
  if (typeof action !== 'string') {
    return (
      <button className={classes} onClick={action} disabled={disabled} {...props}>
        {children}
        {tooltip && !disabled && !mobile && <p className="tool-tip xs z-index-1">{tooltip}</p>}
      </button>
    )
  }
  const LinkComponent = !action.startsWith('http')
    ? Link
    : ({to, children, ...props}: {[k: string]: any}) => (
        <a href={to} rel="noreferrer" target="_blank" {...props}>
          {children}
        </a>
      )

  return (
    <LinkComponent
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
    </LinkComponent>
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
