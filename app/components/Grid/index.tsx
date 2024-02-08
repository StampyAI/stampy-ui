import type {TOCItem} from '~/routes/questions.toc'
import './grid.css'

export const GridBox = ({title, subtitle, icon, pageid}: TOCItem) => (
    <a href={`/${pageid}`} className="grid-item unstyled bordered">
        {icon && <img alt={title} width="72" height="72" src={icon} />}
        <div className="grid-title">{title}</div>
        <div className="grid-description grey">{subtitle}</div>
    </a>
)

interface GridProps {
  gridBoxes: TOCItem[]
}
export const Grid = ({gridBoxes}: GridProps) => {
  return (
    <div className="grid">
      {gridBoxes.slice(0, 6).map((gridBoxProps) => (
        <GridBox key={gridBoxProps.title} {...gridBoxProps} />
      ))}
    </div>
  )
}
export default Grid
