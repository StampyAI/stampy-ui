import {ReactNode} from 'react'
import CopyIcon from '~/components/icons-generated/Copy'
import EditIcon from '~/components/icons-generated/Pencil'
import type {Question} from '~/server-utils/stampy'
import './article.css'

type ActionProps = {
  hint: string
  icon: ReactNode
  action?: any
}
const Action = ({hint, icon, action}: ActionProps) => (
  <div className="interactive-option">{icon}</div>
)

export const Article = ({title, text, tags}: Question) => {
  const ttr = (text: string, rate = 160) => {
    const time = text.split(' ')
    return Math.ceil(time.length / rate) // ceil to avoid "0 min read"
  }
  const lastUpdated = 'asd'

  return (
    <div className="article-container">
      <h1 className="teal">{title}</h1>
      <div className="article-meta">
        <p className="grey">{ttr(text || '')} min read</p>

        <div className="interactive-options bordered">
          <Action icon={<CopyIcon />} hint="Copy to clipboard" />
          <Action icon={<EditIcon className="no-fill" />} hint="Edit" />
        </div>
      </div>

      <div dangerouslySetInnerHTML={{__html: text || ''}}></div>
      <div className="article-tags">
        {tags.map((tag) => (
          <a key={tag} className="tag bordered" href={`/tags/${tag}`}>
            <div className="tags-label">{tag}</div>
          </a>
        ))}
      </div>
      <div className="article-last-updated">{lastUpdated}</div>
    </div>
  )
}
export default Article
