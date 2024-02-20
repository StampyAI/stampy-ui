import {Link} from '@remix-run/react'
import {ArrowUpRight} from '~/components/icons-generated'
import {questionUrl} from '~/routesMapper'
import styles from './listTable.module.css'

export type ListItem = {
  pageid: string
  title: string
  subtitle?: string
  hasIcon?: boolean
}
export type ListTableProps = {
  /**
   * Browse by category
   */
  elements: ListItem[]
  sameTab?: boolean
  className?: string
}

export const ListTable = ({elements, sameTab, className}: ListTableProps) => {
  if (!elements || elements.length === 0) return null
  return (
    <div className={styles.container + ' bordered' + (className ? ' ' + className : '')}>
      {elements.map(({pageid, title, subtitle, hasIcon}, i) => (
        <Link
          key={`entry-${i}`}
          className={styles.entry + ' teal-500 default-bold flex-container'}
          to={questionUrl({pageid, title})}
          target={sameTab ? undefined : '_blank'}
          rel={sameTab ? undefined : 'noopener noreferrer'}
        >
          <div>
            <div>{title}</div>
            {subtitle && <div className="grey subtitle">{subtitle}</div>}
          </div>
          {hasIcon && <ArrowUpRight className="vertically-centered" />}
        </Link>
      ))}
    </div>
  )
}
export default ListTable
