import {ReactNode, useState, useRef, useCallback} from 'react'

type Props = {
  children: ReactNode
  fetchMore: () => Promise<string | null>
} & JSX.IntrinsicElements['div']

export default function InfiniteScroll({children, fetchMore}: Props) {
  const [loading, setLoading] = useState(false)

  // must use stable callback without depencencies, otherwise it will create many instances of IntersectionObserver
  const fetchMoreRef = useRef(fetchMore)
  fetchMoreRef.current = fetchMore
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (!node) return

    let loadingInternal = false
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        // state is needed for re-render, internal variable to avoid dependencies
        if (loadingInternal) return
        setLoading(true)
        loadingInternal = true

        const nextPageLink = await fetchMoreRef.current()
        if (!nextPageLink) {
          observer.disconnect()
        }
        setLoading(false)
        loadingInternal = false
      }
    })
    observer.observe(node)
  }, [])

  return (
    <>
      {loading && <div className="loader" />}
      {children}
      <div ref={lastElementRef} />
    </>
  )
}
