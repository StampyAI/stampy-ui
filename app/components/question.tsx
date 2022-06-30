import {useRef, useEffect} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question} from '~/stampy'
import type useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {tmpPageId} from '~/hooks/useQuestionStateInUrl'
import iconPen from '~/assets/icons/pen.svg'

export default function Question({
  questionProps,
  onLazyLoadQuestion,
  onToggle,
}: {
  questionProps: Question
  onLazyLoadQuestion: (question: Question) => void
  onToggle: ReturnType<typeof useQuestionStateInUrl>['toggleQuestion']
}) {
  const {pageid, title, text, answerEditLink, questionState} = questionProps
  const refreshOnToggleAfterLoading = useRef(false)

  useEffect(() => {
    if (pageid !== tmpPageId && !text) {
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
        <div className="answer">
          {isExpanded && (
            <>
              <div dangerouslySetInnerHTML={{__html: text || '<p>Loading...</p>'}} />
              <div className="actions">
                {answerEditLink && (
                  // TODO: on the first click (remember in localstorage), display a disclaimer popup text from https://stampy.ai/wiki/Edit_popup
                  <a href={answerEditLink} target="_blank" title="edit this answer on the wiki">
                    <img alt="" src={iconPen} />
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </AutoHeight>
    </article>
  )
}
