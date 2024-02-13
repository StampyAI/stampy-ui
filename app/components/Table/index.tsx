import {Link} from '@remix-run/react'
import {ArrowUpRight} from '~/components/icons-generated'
import './listTable.css'

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
}

export const ListTable = ({elements}: ListTableProps) => (
  <div className={'table-list'}>
    {elements.map(({pageid, title, subtitle, hasIcon}, i) => (
      <Link
        key={`entry-${i}`}
        className={'table-entry'}
        to={`/${pageid}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>{title}</div>
        {subtitle && <div className="grey">{subtitle}</div>}
        {hasIcon && <ArrowUpRight />}
      </Link>
    ))}
  </div>
)
export default ListTable
