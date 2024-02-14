import {ReactNode, Suspense} from 'react'
import {Await, useOutletContext} from '@remix-run/react'
import type {Context} from '~/root'
import Footer from '~/components/Footer'
import Nav from '~/components/Nav'
import {useTags} from '~/hooks/useCachedObjects'
import useToC from '~/hooks/useToC'

const Page = ({children}: {children: ReactNode}) => {
  const {toc} = useToC()
  const {items: tags} = useTags()
  const {embed} = useOutletContext<Context>()

  return (
    <>
      <Suspense fallback={<Nav toc={toc} categories={[]} />}>
        <Await resolve={tags}>{(tags) => <Nav toc={toc} categories={tags} />}</Await>
      </Suspense>
      {children}

      {!embed && <Footer />}
    </>
  )
}

export default Page
