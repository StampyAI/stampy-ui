import {GridBox} from './GridBox'
import type {TOCItem} from '~/routes/questions.toc'
interface GridSystemProps {
  gridBoxes: TOCItem[]
}
export const GridSystem = ({gridBoxes}: GridSystemProps) => {
  return (
    <div className={'grid-group'}>
      {gridBoxes.map((gridBoxProps) => (
        <GridBox key={gridBoxProps.title} {...gridBoxProps} />
      ))}
    </div>
  )
}
