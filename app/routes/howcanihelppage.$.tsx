import {Link, useParams} from '@remix-run/react'
import {useEffect} from 'react'
import Page from '~/components/Page'
import {howCanIHelpComponents} from '~/components/HowCanIHelp'

export default function HowCanIHelp() {
  const {'*': subpage} = useParams()
  const Component = howCanIHelpComponents[subpage as keyof typeof howCanIHelpComponents]

  useEffect(() => {
    document.title = `How Can I Help: ${subpage} - AISafety.info`
  }, [subpage])

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
