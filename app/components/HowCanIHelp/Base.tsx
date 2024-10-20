import {Link} from '@remix-run/react'
import Page from '~/components/Page'
import HelpMethods from '~/components/HowCanIHelp/HelpMethods'
import {HelpPage, helpUrl} from '~/routesMapper'
import {ReactNode} from 'react'

type BaseProps = {
  title: string
  subpage: HelpPage
  children: ReactNode
}
export default function Base({title, subpage, children}: BaseProps) {
  return (
    <Page>
      <div className="page-body">
        <div className="padding-bottom-16">
          <Link to={helpUrl()}>How can I help with AI Safety?</Link>
        </div>

        <div>
          <h1 className="teal-500 padding-bottom-40">{title}</h1>

          {children}

          <HelpMethods current={subpage} />
        </div>
      </div>
    </Page>
  )
}
