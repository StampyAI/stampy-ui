import {ReactNode, useState, useRef, useCallback} from 'react'

type Props = {
  children: ReactNode[]
  perPage: number
  fetchMore: (page: number, perPage: number) => any[]
  loadingRenderer: (loading: boolean) => ReactNode
  [k: string]: any
}

export default function InfiniteScroll({
  children,
  fetchMore,
  perPage = 10,
  loadingRenderer = (loading: boolean) => loading && <div className="loader"></div>,
  ...props
}: Props) {
  const [pageNum, setPageNum] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const getMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    const nextPage = await fetchMore(pageNum, perPage)
    setPageNum(pageNum + 1)

    if (nextPage?.length === 0) {
      setHasMore(false)
    }

    setLoading(false)
  }, [loading, hasMore, pageNum, setLoading, setPageNum, setHasMore, fetchMore, perPage])

  const observer = useRef<IntersectionObserver>(null)
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect()

      if (node) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            getMore()
          }
        })
        observer.current.observe(node)
      }
    },
    [getMore]
  )
  return (
    <div {...props}>
      {children}
      {loadingRenderer(loading)}
      <div ref={lastElementRef}></div>
    </div>
  )
}
