import {ReactNode, useState, useRef, useCallback} from 'react'
import {Question} from '~/server-utils/stampy'

type Props = {
  children: ReactNode[]
  fetchMore: () => Promise<Question[]>
  loadingRenderer?: (loading: boolean) => ReactNode
} & JSX.IntrinsicElements['div']

export default function InfiniteScroll({
  children,
  fetchMore,
  loadingRenderer = (loading: boolean) => loading && <div className="loader"></div>,
  ...props
}: Props) {
  const [pageNum, setPageNum] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const getMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    const nextPage = await fetchMore()
    setPageNum(pageNum + 1)

    if (nextPage?.length === 0) {
      setHasMore(false)
    }

    setLoading(false)
  }, [loading, hasMore, pageNum, setLoading, setPageNum, setHasMore, fetchMore])

  const observer = useRef<IntersectionObserver | null>(null)
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
