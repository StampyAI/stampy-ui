import {FunctionComponent, ReactChildren} from 'react'
import './pageHeaderText.css'
interface PageHeaderTextProps {
  /**
   * Children paragraph component
   */
  children: ReactChildren
}
export const PageHeaderText = ({children}: PageHeaderTextProps) => {
  return <div className={'container-page-title'}>{children}</div>
}
