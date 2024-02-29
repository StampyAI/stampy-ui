import {ReactNode} from 'react'
import {useOutletContext} from '@remix-run/react'
import type {Context} from '~/root'
import Footer from '~/components/Footer'
import Nav from '~/components/Nav'
import {useTags} from '~/hooks/useCachedObjects'
import useToC from '~/hooks/useToC'

const Page = ({children, modal}: {children: ReactNode; modal?: boolean}) => {
  const {toc} = useToC()
  const {items: tags} = useTags()
  const {embed} = useOutletContext<Context>() || {}

  return (
    <>
      {!modal && <Nav toc={toc} categories={tags} />}
      {children}

      {!embed && !modal && <Footer />}
    </>
  )
}

export default Page
