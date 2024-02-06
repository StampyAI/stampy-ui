import React from 'react'
import {GridBox} from './GridBox'
interface GridSystemProps {
  /**
   * Object of GridBoxes
   */
  GridBoxes: []
}
export const GridSystem = ({GridBoxes}: GridSystemProps) => {
  return (
    <div className={'grid-group'}>
      {GridBoxes.map((box, index) => {
        return (
          <GridBox title={box.title} description={box.description} icon={box.icon} url={box.url} />
        )
      })}
    </div>
  )
}
