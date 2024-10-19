import {ReactNode} from 'react'
import LinkCard, {Link} from '~/components/LinkCard'

type HelpItemProps = {
  title?: ReactNode
  children: ReactNode
  links?: Link[]
}
const HelpItem = ({title, children, links}: HelpItemProps) => {
  return (
    <div className="section-split padding-bottom-40">
      <div>
        {title && <p className="default-bold padding-bottom-16">{title}</p>}
        <p className="grey default padding-bottom-16"> {children} </p>
      </div>
      <div>
        {links?.map((link) => <LinkCard key={link.title} action={link.action || '#'} {...link} />)}
      </div>
    </div>
  )
}
export default HelpItem
