import {FunctionComponent, ReactChildren} from 'react'

interface PageHeaderTextProps {
  /**
   * Children paragraph component
   */
  children: JSX.Element
}
export const PageHeaderText = ({children}: PageHeaderTextProps) => {
  return <div className={'container-page-title'}>{children}</div>
}
