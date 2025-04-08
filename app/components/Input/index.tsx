import './input.css'
import {useRef, useEffect} from 'react'

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    const resizeTextarea = () => {
      const textarea = textareaRef.current
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
  }, [props.value, multiline])

  return multiline ? (
    <textarea ref={textareaRef} className={classes} {...props} />
  ) : (
    <input className={classes} {...props} />
  )
}

export default Input
