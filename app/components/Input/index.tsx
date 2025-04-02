import './input.css'
import {useRef, useEffect, RefObject} from 'react'

type InputProps = {
  className?: string
  disabled?: boolean
  placeholder?: string
  value?: string
  onChange?: (e: any) => void
  onKeyDown?: (e: any) => void
  onBlur?: (e: any) => void
  multiline?: boolean
  textareaRef?: RefObject<HTMLTextAreaElement>
}
const Input = ({className, multiline, textareaRef, ...props}: InputProps) => {
  const classes = ['input', className].filter((i) => i).join(' ')
  const internalRef = useRef<HTMLTextAreaElement>(null)

  // Use provided ref or internal ref
  const textareaReference = textareaRef || internalRef

  // Auto-resize textarea based on content
  useEffect(() => {
    const resizeTextarea = () => {
      const textarea = textareaReference.current
      if (!textarea) return

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'

      // Get the content height using scrollHeight which accounts for wrapped lines
      const scrollHeight = textarea.scrollHeight

      // Get min and max heights from CSS
      const minHeight = parseInt(getComputedStyle(textarea).minHeight)
      const maxHeight = parseInt(getComputedStyle(textarea).maxHeight)

      // Choose height based on content, ensuring we stay within min/max bounds
      const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight))
      textarea.style.height = `${newHeight}px`

      // Hide scrollbar if not needed
      if (scrollHeight <= maxHeight) {
        textarea.style.overflowY = 'hidden'
      } else {
        textarea.style.overflowY = 'auto'
      }
    }

    if (multiline) {
      resizeTextarea()
      // Run it again after a short delay to catch any layout shifts
      setTimeout(resizeTextarea, 10)
    }
  }, [props.value, multiline, textareaReference])

  return multiline ? (
    <textarea ref={textareaReference} className={classes} {...props} />
  ) : (
    <input className={classes} {...props} />
  )
}

export default Input
