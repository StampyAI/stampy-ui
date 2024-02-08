import type {TOCItem} from '~/routes/questions.toc'
import './menu.css'

type Article = {
  article: TOCItem
  path?: string[]
  current?: string
}

const DropdownIcon = ({article, path}: Article) => {
  if (!article?.children || article.children.length === 0 || article.pageid === (path && path[0]))
    return null
  if (!path?.includes(article.pageid)) return <div className="dropdown-icon" />
  return <div className="dropdown-icon active" />
}

const Title = ({article, path, current}: Article) => {
  const selectedClass = article?.pageid === current ? ' selected' : ''
  if (article.pageid === (path && path[0])) {
    return (
      <a href={`/${article.pageid}`} className="unstyled">
        <div className={'article' + selectedClass}>
          <div className="articles-headerLine">{article?.title}</div>
        </div>
      </a>
    )
  }
  return (
    <summary className={'articles-title' + selectedClass}>
        {!article.hasText ? article.title : <a href={`/${article.pageid}`} className="unstyled">{article.title}</a>}
      <DropdownIcon article={article} path={path} />
    </summary>
  )
}

const ArticleLevel = ({article, path, current}: Article) => {
  if (!article.hasText && (!article.children || article.children.length === 0)) return null
  const isParentClass =
    article.pageid !== current && (path || []).includes(article.pageid) ? ' parent' : ''
  return (
    <details
      key={article.pageid}
      open={path?.includes(article.pageid)}
      className={'article' + isParentClass}
    >
      <Title article={article} path={path} current={current} />
      <div className={'articles-dropdown' + (path?.includes(article.pageid) ? ' active' : '')}>
        {article.children?.map((child) => (
          <ArticleLevel key={child.pageid} article={child} path={path} current={current} />
        ))}
      </div>
    </details>
  )
}

export const ArticlesNav = ({article, path}: Article) => {
  const current = path ? path[path.length - 1] : ''

  return (
    <div className="articles-group">
      {/* Section Header */}
      <Title article={article} path={path} current={current} />

      <hr />

      {article.children?.map((item) => (
        <ArticleLevel key={item.pageid} article={item} path={path} current={current} />
      ))}
    </div>
  )
}

export const EmtpyArticlesNav = () => {
  return <div className="articles-group empty"></div>
}
