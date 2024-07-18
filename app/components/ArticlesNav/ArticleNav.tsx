import {Link} from '@remix-run/react'
import ChevronRight from '~/components/icons-generated/ChevronRight'
import {questionUrl} from '~/routesMapper'
import type {TOCItem} from '~/routes/questions.toc'
import './articlenav.css'

type Article = {
  article: TOCItem
  path?: string[]
  current?: string
  hideChildren?: boolean
  className?: string
}

const DropdownIcon = ({article, path}: Article) => {
  if (!article?.children || article.children.length === 0 || article.pageid === (path && path[0]))
    return null
  if (!path?.includes(article.pageid)) return <ChevronRight className="dropdown-icon" />
  return <ChevronRight className="dropdown-icon active" />
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
      {!article.hasText ? (
        article.title
      ) : (
        <Link to={questionUrl(article)} state={{section: path && path[0]}}>
          {article.title}
        </Link>
      )}
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
        <>
          <div className={'grey articles-dropdown'}>
            {article.children?.map((child) => (
              <ArticleLevel key={child.pageid} article={child} path={path} current={current} />
            ))}
          </div>
          <hr className="mobile-only" />
        </>
      )}
    </details>
  )
}

export const ArticlesNav = ({
  tocLoaded,
  article,
  path,
  className,
}: {tocLoaded: boolean} & Partial<Article>) => {
  const current = path ? path[path.length - 1] : ''

  return article ? (
    <div className={`articles-group small ${className || ''}`}>
      <ArticleLevel article={article} path={path} current={current} hideChildren />
      <hr />

      {article.children?.map((item) => (
        <ArticleLevel key={item.pageid} article={item} path={path} current={current} />
      ))}
    </div>
  ) : (
    <div className={`articles-group ${tocLoaded ? 'none' : 'loading'}`}></div>
  )
}
