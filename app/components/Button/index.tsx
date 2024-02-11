import {ReactNode} from 'react'
import {Link} from '@remix-run/react'
import './button.css'

type ButtonProps = {
  action?: string | (() => void)
  children?: ReactNode
  className?: string
}
const Button = ({children, action, className}: ButtonProps) => {
  const classes = 'button ' + (className || '')
  if (typeof action === 'string') {
    return (
      <Link to={action} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} onClick={action}>
      {children}
    </button>
  )
}

export default Button
