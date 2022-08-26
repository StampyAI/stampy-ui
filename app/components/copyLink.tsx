import {ReactNode, useState, MouseEvent} from 'react'
import copy from 'copy-to-clipboard'

type Props = {
  to?: string
  children: ReactNode
  [k: string]: any
}

export default function CopyLink({to, children, ...props}: Props) {
  const [copied, setCopied] = useState(false)
  const shareLink = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    let url = to ?? location.href
    if (to?.match(/^[?/]/)) {
      url = `${location.origin}${to}`
    }
    copy(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  return (
    <a
      href={to}
      className={`icon-link share ${copied ? 'copied' : ''}`}
      onClick={shareLink}
      {...props}
    >
      {children}
    </a>
  )
}
