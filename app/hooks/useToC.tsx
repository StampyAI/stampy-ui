import {useState, useEffect} from 'react'
import {fetchTOC, TOCItem} from '~/routes/questions.toc'

const identity = (i: any) => i

const useToC = () => {
  const [toc, setToC] = useState<TOCItem[]>([])

  useEffect(() => {
    const getToc = async () => {
      const {data} = await fetchTOC()
      console.log(data)
      setToC(data)
    }
    getToc()
  }, [])

  const checkPath = (pageid: string) => (item: TOCItem) => {
    if (item.pageid === pageid) return [pageid]
    const path = item.children?.map(checkPath(pageid)).filter(identity)[0] as string[] | undefined
    if (path) return [item.pageid, ...path]
  }

  const findSection = (pageid: string) => {
    return toc.filter(checkPath(pageid))[0]
  }

  const getPath = (pageid: string) => {
    if (toc.length === 0) return undefined
    return toc.map(checkPath(pageid)).filter(identity)[0]
  }

  return {
    toc,
    findSection,
    getPath,
  }
}

export default useToC
