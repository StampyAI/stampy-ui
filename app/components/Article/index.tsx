import React from 'react'
import {CopyIcon} from '~/assets/Copy'
import {Tag} from '~/components/Tags/Tag'
import type {Question} from '~/server-utils/stampy'
import './article.css'

const mapInteractiveOptionsIcon = {
  copy: <CopyIcon />,
  Edit: 'edit',
  Audio: 'audio',
}

export const Article: React.FC<ArticleProps> = ({
  title,
  text,
  tags,
  lastUpdated,
}: Question) => {
    const ttr = (text: string, rate = 160) => {
        const time = text.split(' ')
        return Math.ceil(time.length / rate) // ceil to avoid "0 min read"
    }

  return (
    <div className="article-container">
      <h1>{title}</h1>
      <div className="article-meta">
          <p>{ttr(text)}</p>

        <div className="article-interactive-options">
            {/* {interactiveOptions.map((option) => {
                return (
                <div key={option} className="interactive-option">
                {mapInteractiveOptionsIcon[option]}
                </div>
                )
                })} */}
        </div>
      </div>

      <div dangerouslySetInnerHTML={{__html: text}}></div>
      <div className="article-tags">
        {tags.map((tag) => {
          return <Tag key={tag}>{tag}</Tag>
        })}
      </div>
      <div className="article-last-updated">{lastUpdated}</div>
    </div>
  )
}
export default Article
