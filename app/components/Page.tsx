import {ReactNode} from 'react'
import {useOutletContext} from '@remix-run/react'
import type {Context} from '~/root'
import Footer from '~/components/Footer'
import Nav from '~/components/Nav'
import MobileNav from '~/components/Nav/Mobile'
import {useTags} from '~/hooks/useCachedObjects'
import useToC from '~/hooks/useToC'
import useIsMobile from '~/hooks/isMobile'

type PageProps = {
  children: ReactNode
  modal?: boolean
  noFooter?: boolean
}
const Page = ({children, modal, noFooter}: PageProps) => {
  const {toc} = useToC()
  const {items: tags} = useTags()
  const {embed} = useOutletContext<Context>() || {}
  const isMobile = useIsMobile(1024)
  return (
    <div className="page">
      {!modal &&
        (isMobile ? (
          <MobileNav toc={toc} categories={tags} />
        ) : (
          <Nav toc={toc} categories={tags} />
        ))}
      {children}

      {!embed && !modal && !noFooter && <Footer />}
    </div>
  )
}

export default Page
