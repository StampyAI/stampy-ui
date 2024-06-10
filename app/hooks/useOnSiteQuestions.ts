import {Question} from '~/server-utils/stampy'
import {useOnSiteQuestions as getQuestions} from './useCachedObjects'
import {useEffect, useState} from 'react'

const topQuestions = [
  '6953', // Do people seriously worry about existential risk from AI? debugger eval code:1:26
  '6194', // Is AI safety about systems becoming malevolent or conscious? debugger eval code:1:26
  '5633', // When do experts think human-level AI will be created? debugger eval code:1:26
  '8163', // Why is AI alignment a hard problem? debugger eval code:1:26
  '6176', // Why can’t we just “put the AI in a box” so that it can’t influence the outside world? debugger eval code:1:26
  '5864', // What are the differences between AGI, transformative AI, and superintelligence? debugger eval code:1:26
  '5864', // What are large language models? debugger eval code:1:26
  '3119', // Why can't we just turn the AI off if it starts to misbehave? debugger eval code:1:26
  '897I', // What is instrumental convergence? debugger eval code:1:26
  '8185', // What is Goodhart's law? debugger eval code:1:26
  '6568', // What is the orthogonality thesis? debugger eval code:1:26
  '7755', // How powerful would a superintelligence become? debugger eval code:1:26
  '8E41', // Will AI be able to think faster than humans? debugger eval code:1:26
  '9B85', // Isn't the real concern misuse? debugger eval code:1:26
  '8V5J', // Are AIs conscious? debugger eval code:1:26
  '8IHO', // What are the differences between a singularity, an intelligence explosion, and a hard takeoff? debugger eval code:1:26
  '6306', // What is an intelligence explosion? debugger eval code:1:26
  '5943', // How might AGI kill people? debugger eval code:1:26
  '7748', // What is a "warning shot"?
]

const useOnSiteQuestions = () => {
  const onSite = getQuestions()
  const [selected, setSelected] = useState([] as Question[])

  const top = onSite.items?.filter((i) => topQuestions.includes(i.pageid))
  const randomQuestions = (n?: number) =>
    top?.sort(() => 0.5 - Math.random()).slice(0, n || 3) || []

  useEffect(() => {
    if (!selected?.length) {
      setSelected(randomQuestions())
    }
    // eslint-disable-next-line
  }, [onSite.items])

  return {...onSite, topQuestions: top, selected, randomQuestions}
}
export default useOnSiteQuestions
