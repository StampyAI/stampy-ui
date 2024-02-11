import {TOCItem} from '~/routes/questions.toc'
import {useToC as useCachedToC} from '~/hooks/useCachedObjects'

const identity = (i: any) => i

const useToC = () => {
  const {items: toc} = useCachedToC()

  const checkPath = (pageid: string) => (item: TOCItem) => {
    if (item.pageid === pageid) return [pageid]
    const path = item.children?.map(checkPath(pageid)).filter(identity)[0] as string[] | undefined
    if (path) return [item.pageid, ...path]
  }

  const findSection = (pageid: string): TOCItem | undefined => {
    return (toc || []).filter(checkPath(pageid))[0]
  }

  const getPath = (pageid: string) => {
    if (!toc || toc.length === 0) return undefined
    return toc.map(checkPath(pageid)).filter(identity)[0]
  }

  return {
    toc: toc || [],
    findSection,
    getPath,
  }
}

export default useToC
