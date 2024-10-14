import ButtonOrLink from '../ButtonOrLink'
import './cardsmall.css'

interface CardSmallProps {
  title: string
  description: string
  icon: string
  route?: string
  onClick?: () => void
  className?: string
}

export default function CardSmall({
  title,
  description,
  icon,
  route,
  onClick,
  className,
}: CardSmallProps) {
  className = `card-small bordered ${className}`

  const commonContent = (
    <>
      <div className="card-small-icon">{icon}</div>
      <h3 className="large-bold">{title}</h3>
      <p className="grey padding-bottom-16">{description}</p>
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
