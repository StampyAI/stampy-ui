import {MetaFunction} from '@remix-run/node'
import Base from '~/components/HowCanIHelp/Base'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

export default function Donate() {
  return <Base title="Donate to AISafety.info" subpage="donate" />
}
