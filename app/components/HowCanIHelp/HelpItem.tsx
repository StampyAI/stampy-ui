import {ReactNode} from 'react'
import LinkCard, {Link} from '~/components/LinkCard'

type HelpItemProps = {
  title?: ReactNode
  tag?: string
  children: ReactNode
  links?: Link[]
  additionalInfo?: ReactNode
  titleFont?: 'large-bold' | 'default-bold'
  className?: string
}
const HelpItem = ({
  title,
  tag,
  children,
  links,
  additionalInfo,
  titleFont = 'large-bold',
  className = '',
}: HelpItemProps) => {
  return (
    <div className={`flexbox ${className}`}>
      <div className="col-6">
        {title && (
          <p className={`flexbox gap-16 center-align padding-bottom-16 ${titleFont}`}>
            <span>{title}</span>
            {tag && <span className="tag xs">{tag}</span>}
          </p>
        )}
        <p className="grey default"> {children} </p>
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
