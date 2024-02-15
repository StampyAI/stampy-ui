import {ReactNode} from 'react'
import {useOutletContext} from '@remix-run/react'
import type {Context} from '~/root'
import Footer from '~/components/Footer'
import Nav from '~/components/Nav'
import {useTags} from '~/hooks/useCachedObjects'
import useToC from '~/hooks/useToC'

const Page = ({children}: {children: ReactNode}) => {
  const {toc} = useToC()
  const {items: tags} = useTags()
  const {embed} = useOutletContext<Context>() || {}

  return (
    <>
      <Nav toc={toc} categories={tags} />
      {children}

      {!embed && <Footer />}
    </>
  )
}

export default Page
