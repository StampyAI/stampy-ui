import {Link} from '@remix-run/react'
import {questionUrl} from '~/routesMapper'
import type {TOCItem} from '~/routes/questions.toc'
import './menu.css'

type Article = {
  article: TOCItem
  path?: string[]
  current?: string
  hideChildren?: boolean
}

const DropdownIcon = ({article, path}: Article) => {
  if (!article?.children || article.children.length === 0 || article.pageid === (path && path[0]))
    return null
  if (!path?.includes(article.pageid)) return <div className="dropdown-icon" />
  return <div className="dropdown-icon active" />
}

const Title = ({article, path, current}: Article) => {
  const isHeader = article.pageid === (path && path[0])
  const classes = [
    isHeader && 'small-bold',
    isHeader && 'header',
    article?.pageid === current && 'selected',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <summary className={'articles-title ' + classes}>
      {!article.hasText ? article.title : <Link to={questionUrl(article)}>{article.title}</Link>}
      {!isHeader && <DropdownIcon article={article} path={path} />}
    </summary>
  )
}

const ArticleLevel = ({article, path, current, hideChildren}: Article) => {
  if (!article.hasText && (!article.children || article.children.length === 0)) return null

  const currentPage = article.pageid === current
  const isParent = (path || []).includes(article.pageid)
  const isParentClass = !hideChildren && !currentPage && isParent ? ' parent' : ''

  return (
    <details
      key={article.pageid}
      open={path?.includes(article.pageid)}
      className={'article' + isParentClass}
    >
      <Title article={article} path={path} current={current} />
      {!hideChildren && (
        <div className={'articles-dropdown' + (path?.includes(article.pageid) ? ' active' : '')}>
          {article.children?.map((child) => (
            <ArticleLevel key={child.pageid} article={child} path={path} current={current} />
          ))}
        </div>
      )}
    </details>
  )
}

export const ArticlesNav = ({article, path}: Article) => {
  const current = path ? path[path.length - 1] : ''

  return (
    <div className="articles-group col-4-5 bordered small">
      <ArticleLevel article={article} path={path} current={current} hideChildren />
      <hr />

      {article.children?.map((item) => (
        <ArticleLevel key={item.pageid} article={item} path={path} current={current} />
      ))}
    </div>
  )
}
