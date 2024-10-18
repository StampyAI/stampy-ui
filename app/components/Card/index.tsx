import {SVGProps} from 'react'
import Button from '../Button'
import './card.css'

interface CardProps {
  title: string
  description: string
  impact: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  action: string
  className?: string
}

export default function Card({title, description, impact, icon, action, className}: CardProps) {
  className = `card bordered ${className}`

  return (
    <Button action={action} className={className}>
      <div className="card-icon">{icon({})}</div>
      <div className="card-content">
        <h3 className="large-bold padding-bottom-8">{title}</h3>
        <p className="grey padding-bottom-16">{description}</p>
        <p className="card-impact small">{impact}</p>
      </div>
    </Button>
  )
}
