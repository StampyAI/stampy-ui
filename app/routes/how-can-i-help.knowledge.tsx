import {MetaFunction} from '@remix-run/node'
import Base from '~/components/HowCanIHelp/Base'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

export default function Knowledge() {
  return (
    <Base title="Share knowledge about AI safety" subpage="knowledge">
      <div>fill me out, please</div>
    </Base>
  )
}
