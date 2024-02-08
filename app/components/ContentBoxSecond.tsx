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
        <p>Explore the arguments</p>
        <div className="content-box-table-button">
          <a href="/9TDI">Browse all arguments</a>
        </div>
      </div>
      <div className="content-box-table">
        <ListTable elements={elements} />
      </div>
    </div>
  )
}
