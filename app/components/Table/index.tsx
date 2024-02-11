import {Link} from '@remix-run/react'
import './listTable.css'

export type ListTableProps = {
  /**
   * Browse by category
   */
  elements: any[]
}

export const ListTable = ({elements}: ListTableProps) => (
  <div className={'table-list'}>
    {elements.map(({pageid, title}, i) => (
      <Link key={`entry-${i}`} className={'table-entry'} to={`/${pageid}`}>
        {title}
      </Link>
    ))}
  </div>
)
export default ListTable
