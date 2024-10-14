import {SVGProps} from 'react'
import ButtonOrLink from '../ButtonOrLink'
import './card.css'

interface CardProps {
  title: string
  description: string
  impact: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  route?: string
  onClick?: () => void
  className?: string
}

export default function Card({
  title,
  description,
  impact,
  icon,
  route,
  onClick,
  className,
}: CardProps) {
  className = `card bordered ${className}`

  const commonContent = (
    <>
      <div className="card-icon">{icon({})}</div>
      <div className="card-content">
        <h3 className="large-bold padding-bottom-8">{title}</h3>
        <p className="grey padding-bottom-16">{description}</p>
        <p className="card-impact small">{impact}</p>
      </div>
    </>
  )
  return (
    <ButtonOrLink
      commonContent={commonContent}
      route={route}
      onClick={onClick}
      className={className}
    />
  )
}
