import React from 'react'
import './paragraph.css'
export interface ParagraphProps {
  /**
   * Children of the component
   */
  children: string
}
export const Paragraph = ({children}: ParagraphProps) => {
  return <p className={'paragraph'}>{children}</p>
}
