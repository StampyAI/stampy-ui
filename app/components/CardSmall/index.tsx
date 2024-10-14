import {SVGProps} from 'react'
import ButtonOrLink from '../ButtonOrLink'
import './cardsmall.css'

interface CardSmallProps {
  title: string
  description: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  route?: string
  onClick?: () => void
  className?: string
  iconColor?: string
}

export default function CardSmall({
  title,
  description,
  icon,
  route,
  onClick,
  className,
  iconColor = 'var(--colors-teal-50)',
}: CardSmallProps) {
  className = `card-small bordered ${className}`

  const commonContent = (
    <>
      <div style={{backgroundColor: iconColor}} className="card-small-icon">
        {icon({})}
      </div>
      <h3 className="large-bold padding-bottom-8">{title}</h3>
      <p className="grey">{description}</p>
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
