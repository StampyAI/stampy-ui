import {ListTable} from '~/components/Table/ListTable'

interface ContentBoxSecondProps {
  /**
   * Table content
   */
  elements: any[]
}
export const ContentBoxSecond = ({elements}: ContentBoxSecondProps) => {
  return (
    <div className="main-container-box-table bordered">
      <div className="content-box-description">
        <h2>Explore the arguments</h2>
        <a href="/9TDI" className="bordered content-box-table-button teal-500">
          Browse all arguments
        </a>
      </div>
      <div className="content-box-table">
        <ListTable elements={elements} />
      </div>
    </div>
  )
}
