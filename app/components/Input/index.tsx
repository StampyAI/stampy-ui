import './input.css'
import AutoHeight from 'react-auto-height'
import {forwardRef} from 'react'

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

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({className = '', multiline, ...props}, ref) => {
    const classes = `input ${className}`

    if (multiline) {
      return (
        <AutoHeight
          element="textarea"
          className={classes}
          rows={1}
          {...props}
          innerRef={ref as any}
        />
      )
    }

    return <input className={classes} {...props} ref={ref as any} />
  }
)

Input.displayName = 'Input'

export default Input
