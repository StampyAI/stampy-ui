import './input.css'
import AutoHeight from 'react-auto-height'

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

const Input = ({className = '', multiline, ...props}: InputProps) => {
  const classes = `input ${className}`

  if (multiline) {
    return <AutoHeight element="textarea" className={classes} rows={1} {...props} />
  }

  return <input className={classes} {...props} />
}

export default Input
