import React from 'react'
import './h1.css'
export interface h1Props {
  /**
   * Children of the component
   */
  children: string
}
export interface h1Props {
  /**
   * Children of the component
   */
  children: string
  /**
   * main class name
   */
  main?: boolean
  /**
   * Style of the component
   */
  style?: React.CSSProperties
}
export const H1 = ({children, main, style}: h1Props) => {
  return (
    <h1 className={['h1', main ? 'main' : null].join(' ')} style={style}>
      {children}
    </h1>
  )
}
