import './box.css'
import {ListTable} from '~/components/Table/ListTable'

interface ContentBoxTableProps {
  /**
   * Table content
   */
  elements: any[]
}
export const ContentBoxTable = ({elements}: ContentBoxTableProps) => {
  return (
    <div className={'main-container-box-table'}>
      <div className={'content-box-description'}>
        <p>Explore the arguments</p>
        <div className={'content-box-table-button'}>
          <span>Browse all arguments</span>
        </div>
      </div>
      <div className={'content-box-table'}>
        <ListTable elements={elements} />
      </div>
    </div>
  )
}
