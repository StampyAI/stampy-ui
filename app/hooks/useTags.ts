import {useState, useEffect} from 'react'
import {fetchTags} from '~/routes/tags.all'
import type {Tag} from '~/server-utils/stampy'

const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    const getTags = async () => {
      const {tags} = await fetchTags()
      setTags(tags)
    }
    getTags()
  }, [setTags])

  return {tags}
}

export default useTags
