import './input.css'

type InputProps = {
  className?: string
  disabled?: boolean
  placeholder?: string
  value?: string
  onChange?: (e: any) => void
  onKeyDown?: (e: any) => void
  onBlur?: (e: any) => void
}
const Input = ({className, ...props}: InputProps) => {
  const classes = ['input', className].filter((i) => i).join(' ')

  return <input className={classes} {...props} />
}

export default Input
