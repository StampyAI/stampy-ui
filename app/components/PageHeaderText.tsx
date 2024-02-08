import {ReactNode} from 'react'
import './pageHeaderText.css'
interface PageHeaderTextProps {
  /**
   * Children paragraph component
   */
  children: ReactNode
}
export const PageHeaderText = ({children}: PageHeaderTextProps) => {
  return <div className={'container-page-title '}>{children}</div>
}
