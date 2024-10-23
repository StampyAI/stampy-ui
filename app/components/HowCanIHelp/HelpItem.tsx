import {ReactNode} from 'react'
import LinkCard, {Link} from '~/components/LinkCard'

type HelpItemProps = {
  title?: ReactNode
  tag?: string
  children: ReactNode
  links?: Link[]
  additionalInfo?: ReactNode
  titleFont?: 'large-bold' | 'default-bold'
}
const HelpItem = ({
  title,
  tag,
  children,
  links,
  additionalInfo,
  titleFont = 'large-bold',
}: HelpItemProps) => {
  return (
    <div className="flexbox padding-bottom-40">
      <div className="col-6">
        {title && (
          <p className={`flexbox padding-bottom-16 ${titleFont}`}>
            <span>{title}</span>
            {tag && <span className="tag small">{tag}</span>}
          </p>
        )}
        <p className="grey default padding-bottom-16"> {children} </p>
      </div>
      <div className="col-6">
        {links?.map((link) => (
          <div key={link.title} className="padding-bottom-16">
            <LinkCard action={link.action || '#'} {...link} />
            {additionalInfo && <p className="small grey padding-top-16">{additionalInfo}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
export default HelpItem
