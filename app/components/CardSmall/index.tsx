import {SVGProps} from 'react'
import './cardsmall.css'
import Button from '../Button'

interface CardSmallProps {
  title: string
  description: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  action: string
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
  className = `card-small bordered ${className}`

  return (
    <Button action={action} className={className}>
      <div style={{backgroundColor: iconColor}} className="card-small-icon">
        {icon({})}
      </div>
      <h3 className="large-bold padding-bottom-8">{title}</h3>
      <p className="grey">{description}</p>
    </Button>
  )
}
