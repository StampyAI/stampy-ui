import {useGlossary as useCachedGlossary} from '~/hooks/useCachedObjects'

const useGlossary = () => {
  const {items} = useCachedGlossary()
  return items
}

export default useGlossary
