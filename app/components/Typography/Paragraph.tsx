import React from 'react'
import './paragraph.css'
export interface ParagraphProps {
  /**
   * Children of the component
   */
  children: string
  /**
   * Style of the component
   */
    style?: React.CSSProperties
}
export const Paragraph = ({children,style}: ParagraphProps) => {
  return <p className={'paragraph'} style={style}>{children}</p>
}
