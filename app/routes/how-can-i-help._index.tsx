import Page from '~/components/Page'
import HelpGrid from '~/components/HelpGrid'
import '~/components/HowCanIHelp/howcanihelp.css'
import {MetaFunction} from '@remix-run/node'
import {createMetaTags} from '~/utils/meta'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'How Can I Help? - AISafety.info',
    description: 'The AI safety movement is still relatively new, and your actions could have significant impact. Explore ways to contribute to AI safety.',
  })
}

export default function HowCanIHelp() {
  return (
    <Page>
      <div className="page-body padding-top-56">
        <div className="flexbox padding-bottom-80">
          <h1 className="teal-500 col-7">
            How can I help with <br className="title-break"></br>AI safety?
          </h1>
          <p className="large col-5 desktop-only">
            The AI safety movement is still relatively new, and your actions could have significant
            impact. Here's what you can do:
          </p>
        </div>
        <HelpGrid />
      </div>
    </Page>
  )
}
