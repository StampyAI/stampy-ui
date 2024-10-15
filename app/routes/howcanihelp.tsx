import {useEffect} from 'react'
import Page from '~/components/Page'
import HelpGrid from '~/components/HelpGrid'
import '~/components/HowCanIHelp/howcanihelp.css'

export default function HowCanIHelp() {
  useEffect(() => {
    document.title = 'How Can I Help? - AISafety.info'
  }, [])

  return (
    <Page>
      <div className="page-body padding-top-40">
        <div className="howcanihelp-header padding-bottom-104">
          <h1 className="teal-500">How can I help with AI Safety?</h1>
          <p className="large-reading padding-left-80">
            The AI safety movement is still relatively new, and your actions could have significant
            impact. Here's what you can do:
          </p>
        </div>
        <HelpGrid />
      </div>
    </Page>
  )
}
