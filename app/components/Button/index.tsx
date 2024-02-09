import {ReactNode} from 'react'
import './button.css'

type ButtonProps = {
  action?: string | (() => void)
  children?: ReactNode
  className?: string
}
const Button = ({children, action, className}: ButtonProps) => {
  if (typeof action === 'string') {
    return (
      <a href={action} className={className}>
        {children}
      </a>
    )
  }
  return (
    <button className={className} onClick={action}>
      {children}
    </button>
  )
}

export default Button
