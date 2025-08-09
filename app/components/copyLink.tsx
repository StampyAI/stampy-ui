import {useState} from 'react'
import copy from 'copy-to-clipboard'

interface Props {
  to: string
  children: React.ReactNode
  [key: string]: any
}

export default function CopyLink({to, children, ...props}: Props) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    copy(to)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleClick} {...props}>
      {copied ? 'Copied!' : children}
    </button>
  )
}
