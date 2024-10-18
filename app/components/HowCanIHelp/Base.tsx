import {Link} from '@remix-run/react'
import Page from '~/components/Page'
import HelpMethods from '~/components/HowCanIHelp/HelpMethods'
import {HelpPage, helpUrl} from '~/routesMapper'

export default function Base({title, subpage}: {title: string; subpage: HelpPage}) {
  return (
    <Page>
      <div className="page-body">
        <div className="padding-bottom-16">
          <Link to={helpUrl()}>How can I help with AI Safety?</Link>
        </div>

        <div>
          <h1 className="teal-500 padding-bottom-40">{title}</h1>

          <HelpMethods current={subpage} />
        </div>
      </div>
    </Page>
  )
}
