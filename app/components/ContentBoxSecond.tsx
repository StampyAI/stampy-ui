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
          <a href="/9TDI" className="unstyled teal">
              <div className="content-box-table-button">
                  Browse all arguments
              </div>
          </a>
      </div>
      <div className="content-box-table">
        <ListTable elements={elements} />
      </div>
    </div>
  )
}
