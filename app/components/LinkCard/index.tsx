import React from 'react'
import './linkcard.css'
import {ArrowUpRight} from '../icons-generated'
import Button from '../Button'

interface LinkCardProps {
  title: string
  tag?: string
  action?: string
  className?: string
}

const LinkCard: React.FC<LinkCardProps> = ({title, tag, action, className}) => {
  className = `link-card ${className}`

  return (
    <Button action={action} className={className}>
      {tag && <div className="tag small teal-500">{tag}</div>}
      <p className="default-bold">{title}</p>
      <ArrowUpRight className="arrow" />
    </Button>
  )
}

export default LinkCard
