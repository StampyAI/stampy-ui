import React from 'react'
import {ArrowUpRight} from '~/components/icons-generated'
import Button from '~/components/Button'
import './linkcard.css'

export type Link = {
  title: string
  tag?: string
  action?: string
}

export type LinkCardProps = Link & {
  className?: string
}

const LinkCard: React.FC<LinkCardProps> = ({title, tag, action, className}) => (
  <Button action={action} className={`link-card ${className}`}>
    {tag && <div className="tag small teal-500">{tag}</div>}
    <p className="default-bold">{title}</p>
    <ArrowUpRight className="arrow" />
  </Button>
)

export default LinkCard
