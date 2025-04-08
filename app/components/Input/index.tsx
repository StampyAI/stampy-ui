import './input.css'
import AutoHeight from 'react-auto-height'
import {createElement} from 'react'

type InputProps = {
  className?: string
  disabled?: boolean
  placeholder?: string
  value?: string
  onChange?: (e: any) => void
  onKeyDown?: (e: any) => void
  onBlur?: (e: any) => void
  multiline?: boolean
}

const Input = ({className, multiline, ...props}: InputProps) => {
  const classes = ['input', className].filter((i) => i).join(' ')

  if (multiline) {
    // Use createElement to pass direct element prop to AutoHeight
    return createElement(AutoHeight, {element: 'textarea', className: classes, ...props})
  }

  return <input className={classes} {...props} />
}

export default Input
