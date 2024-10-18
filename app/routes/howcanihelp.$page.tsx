import {Link, useParams} from '@remix-run/react'
import Page from '~/components/Page'
import {howCanIHelpComponents} from '~/components/HowCanIHelp'
import {MetaFunction} from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

export default function HowCanIHelp() {
  const {page} = useParams()
  const Component = howCanIHelpComponents[page as keyof typeof howCanIHelpComponents]

  if (!Component) {
    return <div>Page not found</div>
  }

  return (
    <Page>
      <div className="page-body">
        <div className="padding-bottom-16">
          <Link to="/howcanihelp">How can I help with AI Safety?</Link>
        </div>
        <Component />
      </div>
    </Page>
  )
}
