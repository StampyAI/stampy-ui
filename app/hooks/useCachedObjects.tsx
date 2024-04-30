import {useEffect, useState, createContext, useContext, ReactElement} from 'react'
import type {Tag, Glossary, Question} from '~/server-utils/stampy'
import {fetchTags} from '~/routes/categories.all'
import {fetchTOC, TOCItem} from '~/routes/questions.toc'
import {fetchGlossary} from '~/routes/questions.glossary'
import {fetchAllQuestionsOnSite} from '~/routes/questions.allQuestionsOnSite'

type ServerObject = Tag[] | TOCItem[] | Glossary | Question[]
type APICall = () => Promise<ServerObject>
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
  onSiteQuestions: useObjectsType<Question[]>
  glossary: useObjectsType<Glossary>
  tags: useObjectsType<Tag[]>
  toc: useObjectsType<TOCItem[]>
}
export const CachedObjectsContext = createContext<useCachedObjectsType | null>(null)

const getOnSiteQuestions = async () => (await fetchAllQuestionsOnSite()).data
const getGlossary = async () => (await fetchGlossary()).data
const getTags = async () => (await fetchTags()).tags
const getToC = async () => (await fetchTOC()).data

export const CachedObjectsProvider = ({children}: {children: ReactElement}) => {
  const onSiteQuestions = useItemsFuncs<Question[]>(getOnSiteQuestions)
  const glossary = useItemsFuncs<Glossary>(getGlossary)
  const tags = useItemsFuncs<Tag[]>(getTags)
  const toc = useItemsFuncs<TOCItem[]>(getToC)

  return (
    <CachedObjectsContext.Provider value={{tags, glossary, toc, onSiteQuestions}}>
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

export const useOnSiteQuestions = () => {
  const context = useContext(CachedObjectsContext)
  if (!context) {
    throw new Error('useOnSiteQuestions must be used within a CachedObjectsProvider')
  }
  return context.onSiteQuestions
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
