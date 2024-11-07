import React, {ReactNode} from 'react'
import {ArrowUpRight} from '~/components/icons-generated'
import Button from '~/components/Button'
import './linkcard.css'

export type Link = {
  title: string
  image?: ReactNode
  tag?: string
  action?: string
}

export type LinkCardProps = Link & {
  className?: string
}

const LinkCard: React.FC<LinkCardProps> = ({title, image, tag, action, className}) => (
  <Button action={action} className={`link-card ${className}`}>
    <p className="default-bold flexbox gap-16 center-align">
      {image && <span className="image">{image}</span>}
      <div className="flexbox flex-column gap-8">
        {tag && <div className="tag xs teal-500">{tag}</div>}
        {title}
      </div>
    </p>
    <ArrowUpRight className="arrow" />
  </Button>
)

export default LinkCard
