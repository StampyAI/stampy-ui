import {Link} from '@remix-run/react'
import {ArrowUpRight} from '~/components/icons-generated'
import './listTable.css'

export type ListTableProps = {
  /**
   * Browse by category
   */
  elements: any[]
}

export const ListTable = ({elements}: ListTableProps) => (
  <div className={'table-list'}>
    {elements.map(({pageid, title, hasIcon}, i) => (
      <Link key={`entry-${i}`} className={'table-entry'} to={`/${pageid}`}>
        {title}
        {hasIcon && <ArrowUpRight />}
      </Link>
    ))}
  </div>
)
export default ListTable
