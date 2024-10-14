import React from 'react'
import './linkcard.css'
import {ArrowUpRight} from '../icons-generated'
import ButtonOrLink from '../ButtonOrLink'
interface LinkCardProps {
  title: string
  tag?: string
  route?: string
  onClick?: () => void
  className?: string
}

const LinkCard: React.FC<LinkCardProps> = ({title, tag, route, onClick, className}) => {
  className = `link-card ${className}`
  const commonContent = (
    <>
      {tag && <div className="tag small teal-500">{tag}</div>}
      <p className="default-bold">{title}</p>
      <ArrowUpRight className="arrow" />
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

export default LinkCard
