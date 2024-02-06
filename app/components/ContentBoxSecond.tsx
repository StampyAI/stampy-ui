import React from 'react'
import {ListTable} from './ListTable'

interface ContentBoxSecondProps {
  /**
   * Table content
   */
  Elements: Record<string, string>
}
export const ContentBoxSecond = ({Elements}: ContentBoxSecondProps) => {
  return (
    <div className={'main-container-box-table'}>
      <div className={'content-box-description'}>
        <p>Explore the arguments</p>
        <div className={'content-box-table-button'}>
          <span>Browse all arguments</span>
        </div>
      </div>
      <div className={'content-box-table'}>
        <ListTable Elements={Elements} />
      </div>
    </div>
  )
}
