import {ReactNode} from 'react'
import {Link} from '@remix-run/react'

interface ButtonOrLinkProps {
  commonContent: ReactNode
  route?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function ButtonOrLink({
  commonContent,
  route,
  onClick,
  className = '',
  disabled = false,
}: ButtonOrLinkProps) {
  if (onClick) {
    return (
      <button onClick={onClick} className={className} disabled={disabled}>
        {commonContent}
      </button>
    )
  }

  return (
    <Link to={route || '#'} className={className} aria-disabled={disabled}>
      {commonContent}
    </Link>
  )
}
