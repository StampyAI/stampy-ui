import {ReactNode} from 'react'
import {Link} from '@remix-run/react'
import './button_secondary.css'

type ButtonProps = {
  action?: string | (() => void)
  children?: ReactNode
  className?: string
  tooltip?: string
  active?: boolean
  disabled?: boolean
  props?: {[k: string]: any}
}
const ButtonSecondary = ({
  children,
  action,
  tooltip,
  className,
  active = false,
  disabled = false,
  props,
}: ButtonProps) => {
  if (typeof action === 'string') {
    return (
      <Link
        to={action}
        className={
          'button-secondary ' +
          (active ? 'active' : disabled ? '' : 'inactive') +
          (className ? ' ' + className : '')
        }
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
          }
        }}
        {...props}
      >
        {children}
        {tooltip && !disabled && <p className="tool-tip">{tooltip}</p>}
      </Link>
    )
  }
  return (
    <button
      className={
        'button-secondary ' +
        (active ? 'active' : disabled ? '' : 'inactive') +
        (className ? ' ' + className : '')
      }
      onClick={action}
      disabled={disabled}
      {...props}
    >
      {children}
      {tooltip && !disabled && <p className="tool-tip">{tooltip}</p>}
    </button>
  )
}

export interface ButtonSecondaryWrapperProps {
  children: ReactNode
  className?: string
}
export const ButtonSecondaryWrapper = ({children, className}: ButtonSecondaryWrapperProps) => (
  <div className={`wrapper ${className || ''}`}>{children}</div>
)

export default ButtonSecondary
