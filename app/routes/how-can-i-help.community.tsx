import {MetaFunction} from '@remix-run/node'
import Base from '~/components/HowCanIHelp/Base'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

export default function Community() {
  return (
    <Base title="Join the community" current="community">
      <div>fill me out, please</div>
    </Base>
  )
}
