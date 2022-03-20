import {useEffect} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question} from '~/utils/stampy'

export default function Question({
  pageid,
  title,
  text,
  questionState,
  onLazyLoadQuestion,
  onToggle,
}: Question & {
  onLazyLoadQuestion: (question: Question) => void
  onToggle: () => void
}) {
  useEffect(() => {
    if (!text) {
      fetch(`/questions/${pageid}`)
        .then((response) => response.json())
        .then(onLazyLoadQuestion)
    }
  }, [pageid, text])

  const isExpanded = questionState === '_'
  const isRelated = questionState === 'r'
  const cls = isExpanded ? 'expanded' : isRelated ? 'related' : 'collapsed'

  return (
    <article className={cls}>
      <h2 onClick={onToggle}>{title}</h2>
      <AutoHeight>
        {isExpanded && (
          <div className="answer" dangerouslySetInnerHTML={{__html: text || '<p>Loading...</p>'}} />
        )}
      </AutoHeight>
    </article>
  )
}
