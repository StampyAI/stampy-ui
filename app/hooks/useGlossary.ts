import {useState, useEffect} from 'react'
import {fetchGlossary} from '~/routes/questions.glossary'
import type {Glossary} from '~/server-utils/stampy'

const useGlossary = () => {
  const [glossary, setGlossary] = useState<Glossary>({})

  useEffect(() => {
    const getGlossary = async () => {
      const {data} = await fetchGlossary()
      setGlossary(data)
    }
    getGlossary()
  }, [setGlossary])

  return {glossary}
}

export default useGlossary
