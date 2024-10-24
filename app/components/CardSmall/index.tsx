import {SVGProps} from 'react'
import './cardsmall.css'
import Button from '../Button'

interface CardSmallProps {
  title: string
  description: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  action: string | ((e: React.MouseEvent<HTMLButtonElement>) => void)
  className?: string
  iconColor?: string
}

export default function CardSmall({
  title,
  description,
  icon,
  action,
  className,
  iconColor = 'var(--colors-teal-50)',
}: CardSmallProps) {
  className = `card-small bordered col-4 ${className}`

  return (
    <Button action={action} className={className}>
      <div style={{backgroundColor: iconColor}} className="card-small-icon">
        {icon({})}
      </div>
      <p className="default-bold padding-bottom-8">{title}</p>
      <p className="grey small">{description}</p>
    </Button>
  )
}
