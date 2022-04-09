import {useRef, useEffect} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question} from '~/stampy'
import type useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'

export default function Question({
  questionProps,
  onLazyLoadQuestion,
  onToggle,
}: {
  questionProps: Question
  onLazyLoadQuestion: (question: Question) => void
  onToggle: ReturnType<typeof useQuestionStateInUrl>['toggleQuestion']
}) {
  const {pageid, title, text, questionState} = questionProps
  const refreshOnToggleAfterLoading = useRef(false)

  useEffect(() => {
    if (!text) {
      fetch(`/questions/${pageid}`)
        .then((response) => response.json())
        .then((newQuestionProps: Question) => {
          onLazyLoadQuestion(newQuestionProps)
          if (refreshOnToggleAfterLoading.current) {
            onToggle(newQuestionProps)
            refreshOnToggleAfterLoading.current = false
          }
        })
    }
  }, [pageid, text])

  const isExpanded = questionState === '_'
  const isRelated = questionState === 'r'
  const cls = isExpanded ? 'expanded' : isRelated ? 'related' : 'collapsed'

  const handleToggle = () => {
    onToggle(questionProps)
    if (!text) {
      refreshOnToggleAfterLoading.current = true
    }
  }

  return (
    <article className={cls}>
      <h2 onClick={handleToggle}>
        <button className="transparent-button">{title}</button>
      </h2>
      <AutoHeight>
        {isExpanded && (
          <div className="answer" dangerouslySetInnerHTML={{__html: text || '<p>Loading...</p>'}} />
        )}
      </AutoHeight>
    </article>
  )
}
