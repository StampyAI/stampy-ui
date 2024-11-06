import {ReactNode, SVGProps} from 'react'
import Button from '~/components/Button'
import {ArrowRight} from '~/components/icons-generated'
import './card.css'

interface CardProps {
  title: string
  description: ReactNode
  impact?: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  action: string
  actionDesc?: string
  className?: string
}

export default function Card({
  title,
  description,
  impact,
  icon,
  action,
  actionDesc,
  className,
}: CardProps) {
  className = `card bordered ${className}`

  return (
    <Button action={action} className={className}>
      <div className="card-icon">{icon({})}</div>
      <div className="card-content">
        <p className="extra-large-bold padding-bottom-8">{title}</p>
        <p className="grey padding-bottom-16">{description}</p>
        {actionDesc && (
          <p className="default-bold teal-500">
            <span className="padding-right-8">{actionDesc}</span>
            <ArrowRight />
          </p>
        )}
        {impact && <p className="tag xs">{impact}</p>}
      </div>
    </Button>
  )
}
