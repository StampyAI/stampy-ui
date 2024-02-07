import {ListTable} from '~/components/Table/ListTable'

interface ContentBoxSecondProps {
  /**
   * Table content
   */
  elements: any[]
}
export const ContentBoxSecond = ({elements}: ContentBoxSecondProps) => {
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
