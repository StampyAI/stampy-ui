import './listTable.css'

export type ListTableProps = {
  /**
   * Browse by category
   */
  elements: any[]
}

export const ListTable = ({elements}: ListTableProps) => {
  return (
    <div className={'table-list'}>
      {elements.map(({pageid, title}, i) => {
        return (
          <a key={`entry-${i}`} className={'table-entry'} href={`/${pageid}`}>
            {title}
          </a>
        )
      })}
    </div>
  )
}
