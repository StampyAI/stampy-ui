import './input.css'

type InputProps = {
  className?: string
  disabled?: boolean
  placeHolder?: string
  value?: string
  onChange?: (e: any) => void
  onKeyDown?: (e: any) => void
}
const Input = ({
  className,
  disabled = false,
  placeHolder,
  value,
  onChange,
  onKeyDown,
}: InputProps) => {
  const classes = ['input', className].filter((i) => i).join(' ')

  return (
    <input
      className={classes}
      disabled={disabled}
      placeholder={placeHolder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  )
}

export default Input
