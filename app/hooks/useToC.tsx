import {TOCItem, ADVANCED} from '~/routes/questions.toc'
import {useToC as useCachedToC} from '~/hooks/useCachedObjects'

const identity = (i: any) => i

const useToC = () => {
  const {items} = useCachedToC()
  const {toc, visible} = items || {}

  const getArticle = (pageid: string): TOCItem | undefined => {
    const all = {pageid: '', children: visible || []} as TOCItem
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
    const checker = checkPath(pageid)
    // Articles can be in multiple sections, or even be sections. It's assumed here that
    // the highest level usage should be used, so assuming article "ABC", with the following
    // paths:
    //  * ["123", "432", "ABC"]
    //  * ["123", "ABC"]
    //  * ["324", "ABC"]
    //  * ["ABC"]
    // Then the shorter the path, the better
    return (toc || [])
      .filter(checker)
      .sort((a, b) => (checker(a)?.length || 20) - (checker(b)?.length || 20))[0]
  }

  const getPath = (pageid: string, sectionId?: string) => {
    if (!toc || toc.length === 0) return undefined
    const paths = toc.map(checkPath(pageid)).filter(identity)

    if (sectionId) return paths.filter((p) => p && p[0] === sectionId)[0]
    return paths[0]
  }

  const getNext = (pageid: string, sectionId?: string): TOCItem | undefined => {
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

    // Assume that next articles must always be in the same section
    return toc
      ?.filter(({pageid}) => pageid === sectionId)
      .map((section) => findNext('', section).next)
      .filter(identity)[0]
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
