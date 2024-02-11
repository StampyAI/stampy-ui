import {useEffect, useState, createContext, useContext, ReactElement} from 'react'
import type {Tag, Glossary} from '~/server-utils/stampy'
import {fetchTags} from '~/routes/tags.all'
import {fetchTOC, TOCItem} from '~/routes/questions.toc'
import {fetchGlossary} from '~/routes/questions.glossary'

type ServerObject = Tag[] | TOCItem[] | Glossary
type APICall = () => Promise<Tag[] | TOCItem[] | Glossary>
type useObjectsType<T extends ServerObject> = {
  items?: T
}

export const useItemsFuncs = <T extends ServerObject>(apiFetcher: APICall): useObjectsType<T> => {
  const [items, setItems] = useState<T | undefined>()

  useEffect(() => {
    const getter = async () => {
      const data = await apiFetcher()
      setItems(data as T)
    }
    getter()
  }, [apiFetcher])

  return {items}
}

type useCachedObjectsType = {
  glossary: useObjectsType<Glossary>
  tags: useObjectsType<Tag[]>
  toc: useObjectsType<TOCItem[]>
}
const CachedObjectsContext = createContext<useCachedObjectsType | null>(null)

const getGlossary = async () => (await fetchGlossary()).data
const getTags = async () => (await fetchTags()).tags
const getToC = async () => (await fetchTOC()).data

export const CachedObjectsProvider = ({children}: {children: ReactElement}) => {
  const glossary = useItemsFuncs<Glossary>(getGlossary)
  const tags = useItemsFuncs<Tag[]>(getTags)
  const toc = useItemsFuncs<TOCItem[]>(getToC)

  console.log('caching')
  return (
    <CachedObjectsContext.Provider value={{tags, glossary, toc}}>
      {children}
    </CachedObjectsContext.Provider>
  )
}

export const useCachedObjects = () => {
  const context = useContext(CachedObjectsContext)
  if (!context) {
    throw new Error('useCachedObjectsContext must be used within a CachedObjectsProvider')
  }
  return context
}

export const useTags = () => {
  const context = useContext(CachedObjectsContext)
  if (!context) {
    throw new Error('useTags must be used within a CachedObjectsProvider')
  }
  return context.tags
}

export const useToC = () => {
  const context = useContext(CachedObjectsContext)
  if (!context) {
    throw new Error('useToC must be used within a CachedObjectsProvider')
  }
  return context.toc
}

export const useGlossary = () => {
  const context = useContext(CachedObjectsContext)
  if (!context) {
    throw new Error('useGlossary must be used within a CachedObjectsProvider')
  }
  return context.glossary
}

export default useCachedObjects
