import {TOCItem} from '~/routes/questions.toc'
import {useToC as useCachedToC} from '~/hooks/useCachedObjects'

const identity = (i: any) => i

const useToC = () => {
  const {items: toc} = useCachedToC()
  console.log(toc)

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

  const getNext = (pageid: string): TOCItem | undefined => {
    type NextItem = {
      current?: string
      next?: TOCItem
    }
    const findNext = (prev: string | undefined, item: TOCItem): NextItem => {
      if (pageid === prev) return {current: prev, next: item}

      let previous: string | undefined = item.pageid
      for (const child of item.children || []) {
        const {next, current} = findNext(previous, child)
        if (next) return {next, current}
        previous = current
      }
      return {current: previous}
    }

    const all = {pageid: '', children: toc || []} as TOCItem
    return toc && findNext('', all).next
  }

  return {
    toc: toc || [],
    findSection,
    getPath,
    getNext,
  }
}

export default useToC
