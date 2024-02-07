import {GridBox} from './GridBox'
import type {TOCItem} from '~/routes/questions.toc'
interface GridSystemProps {
  /**
   * Object of GridBoxes
   */
  GridBoxes: TOCItem[]
}
export const GridSystem = ({GridBoxes}: GridSystemProps) => {
  return <div className={'grid-group'}>{GridBoxes.map(GridBox)}</div>
}
