import React from 'react'
import './h2.css'
export interface h1Props {
  /**
   * Children of the component
   */
  children: string
}
export interface h2Props {
  /**
   * Children of the component
   */
  children: string
  /**
   * Is teal color?
   */
    teal?: boolean
}
export const H2 = ({children,teal}: h2Props) => {
  return <h2 className={['h2', teal?'teal':null].join(' ')}>{children}</h2>
}
