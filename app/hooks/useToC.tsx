import {TOCItem, ADVANCED} from '~/routes/questions.toc'
import {useToC as useCachedToC} from '~/hooks/useCachedObjects'

const identity = (i: any) => i

const useToC = () => {
  const {items: toc} = useCachedToC()
  const all = {pageid: '', children: toc || []} as TOCItem

  const getArticle = (pageid: string): TOCItem | undefined => {
    const search = (item: TOCItem): TOCItem | undefined => {
      if (item.pageid === pageid) return item
      return item.children?.map(search).filter(identity)[0]
    }
    return toc && search(all)
  }

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
      if (item.hasText && pageid === prev) return {current: prev, next: item}

      let previous: string | undefined = item.hasText ? item.pageid : prev
      for (const child of item.children || []) {
        const {next, current} = findNext(previous, child)
        if (next) return {next, current}
        previous = current
      }
      return {current: previous}
    }

    return toc?.map((section) => findNext('', section).next).filter(identity)[0]
  }

  return {
    toc: toc || [],
    advanced: (toc || []).filter(({category}) => category === ADVANCED),
    getArticle,
    findSection,
    getPath,
    getNext,
  }
}

export default useToC
