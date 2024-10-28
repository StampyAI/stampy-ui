import {Link} from '@remix-run/react'
import Page from '~/components/Page'
import HelpMethods, {HelpMethodsProps} from '~/components/HowCanIHelp/HelpMethods'
import {helpUrl} from '~/routesMapper'
import {ReactNode} from 'react'

type BaseProps = {
  title: ReactNode
  children: ReactNode
} & HelpMethodsProps

export default function Base({title, current, children, ...props}: BaseProps) {
  return (
    <Page>
      <div className="page-body">
        <div className="padding-bottom-16 padding-top-48 large">
          <Link to={helpUrl()}>How can I help with AI safety?</Link>
        </div>

        <div>
          <h1 className="teal-500 padding-bottom-56">{title}</h1>

          {children}

          <HelpMethods current={current} {...props} />
        </div>
      </div>
    </Page>
  )
}
