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
          'button-secondary relative leading-7 p-1 rounded-[6px] ' +
          (active ? 'bg-[#EDFAF9] active' : disabled ? '' : 'hover:bg-[#F9FAFC]') +
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
        {tooltip && !disabled && (
          <p className="tool-tip absolute top-[-42px] left-1/2 transform -translate-x-1/2 bg-[#1B2B3E] text-[14px] text-[#f2f2f2] py-[5px] px-[15px] rounded-[8px] whitespace-nowrap pointer-events-none">
            {tooltip}
          </p>
        )}
      </Link>
    )
  }
  return (
    <button
      className={
        'button-secondary relative leading-7 p-1 rounded-[6px] ' +
        (active ? 'bg-[#EDFAF9] active' : disabled ? '' : 'hover:bg-[#F9FAFC]') +
        (className ? ' ' + className : '')
      }
      onClick={action}
      disabled={disabled}
      {...props}
    >
      {children}
      {tooltip && !disabled && (
        <p className="tool-tip absolute top-[-42px] left-1/2 transform -translate-x-1/2 bg-[#1B2B3E] text-[14px] text-[#f2f2f2] py-[5px] px-[15px] rounded-[8px] whitespace-nowrap pointer-events-none">
          {tooltip}
        </p>
      )}
    </button>
  )
}

export interface ButtonSecondaryWrapperProps {
  children: ReactNode
  className?: string
}
export const ButtonSecondaryWrapper = ({children, className}: ButtonSecondaryWrapperProps) => (
  <div
    className={`flex border-[var(--colors-cool-grey-200)] border-[1px] rounded-[6px] space-x-[4px] p-[7px] justify-center items-center size-min ${className || ''}`}
  >
    {children}
  </div>
)

export default ButtonSecondary
