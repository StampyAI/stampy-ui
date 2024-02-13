import React, {ReactNode} from 'react'
import Button from '../Button'
import ListTable from '~/components/Table'
import './keepGoing.css'
export interface Article {
  title: string
  pageid: string
}
export interface NextArticle {
  title: string
  pageid: string
  icon: any
}
export interface ArticleKeepGoingProps {
  /**
   * Category of the article
   */
  category: string
  /**
   * Related articles
   */
  articles: Article[]
  /**
   * Next article
   */
  next: NextArticle
}
export const ArticleKeepGoing = ({category, articles, next}: ArticleKeepGoingProps) => {
  const nextArticle = (pageId) => {
    console.log('Next article')
    location.href = `/${pageId}`
  }
  return (
    <div className="keepGoing">
      <h2>Keep going! &#128073;</h2>
      <span>Continue with the next article in {category}</span>
      <div className="keepGoing-next">
        <span className="keepGoing-next-title">{next.title}</span>
        <Button action={`${next.pageid}`} className="primary-alt" icon={next.icon}>
          Next
        </Button>
      </div>
      <span>Or, jump to related questions</span>
      <ListTable elements={articles} />
    </div>
  )
}
