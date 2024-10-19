import {MetaFunction} from '@remix-run/node'
import Base from '~/components/HowCanIHelp/Base'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

export default function Grassroots() {
  return <Base title="Help with grassroots AI Safety" subpage="grassroots" />
}
