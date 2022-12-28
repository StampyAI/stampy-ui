import type {LoaderFunction} from '@remix-run/cloudflare'
import {loadQuestionDetail} from '~/server-utils/stampy'
import {useRef, useEffect, useState} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question} from '~/server-utils/stampy'
import type useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {tmpPageId} from '~/hooks/useQuestionStateInUrl'
import {Edit, Link as LinkIcon} from '~/components/icons-generated'
import CopyLink from '~/components/copyLink'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const loader = async ({request, params}: Parameters<LoaderFunction>[0]) => {
  const {question: gdocId} = params
  if (!gdocId) {
    throw Error('missing google doc id')
  }

  return await loadQuestionDetail(request, gdocId)
}

export function fetchQuestion(gdocId: string) {
  const url = `/questions/${gdocId}`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<ReturnType<typeof loader>> = await response.json()
    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}

export function Question({
  questionProps,
  onLazyLoadQuestion,
  onToggle,
}: {
  questionProps: Question
  onLazyLoadQuestion: (question: Question) => void
  onToggle: ReturnType<typeof useQuestionStateInUrl>['toggleQuestion']
}) {
  const {shortId, gdocId, question, answer, editLink, questionState} = questionProps
  const isLoading = useRef(false)
  const refreshOnToggleAfterLoading = useRef(false)
  useEffect(() => {
    if (shortId !== tmpPageId && !answer && !isLoading.current) {
      isLoading.current = true
      fetchQuestion(gdocId).then((newQuestionProps) => {
        onLazyLoadQuestion(newQuestionProps)
        if (refreshOnToggleAfterLoading.current) {
          onToggle(newQuestionProps)
          refreshOnToggleAfterLoading.current = false
        }
      })
    }
  }, [shortId, gdocId, answer, onLazyLoadQuestion, onToggle])

  const isExpanded = questionState === '_'
  const isRelated = questionState === 'r'
  const clsExpanded = isExpanded ? 'expanded' : isRelated ? 'related' : 'collapsed'

  const [isLinkHovered, setLinkHovered] = useState(false)
  const clsLinkHovered = isLinkHovered ? 'link-hovered' : ''
  const cls = `${clsExpanded} ${clsLinkHovered}`

  const [showLongDescription, setShowLongDescription] = useState(false)
  const answerRef = useRef<HTMLDivElement>(null)
  const isExpandedAfterLoading = isExpanded && !refreshOnToggleAfterLoading.current
  useEffect(() => {
    if (isExpandedAfterLoading) {
      const el = answerRef.current
      const showEl = el?.querySelector('.card-show-longdesc')
      const hideEl = el?.querySelector('.card-hide-longdesc')

      if (showEl) {
        const showLong = () => setShowLongDescription(true)
        const hideLong = () => setShowLongDescription(false)

        // TODO: #13 change to accessible button/link instead of <div>
        showEl.addEventListener('click', showLong)
        hideEl?.addEventListener('click', hideLong)

        return () => {
          showEl.removeEventListener('click', showLong)
          hideEl?.removeEventListener('click', hideLong)
        }
      }
    }
  }, [isExpandedAfterLoading])

  const handleToggle = () => {
    onToggle(questionProps)
    if (!answer) {
      refreshOnToggleAfterLoading.current = true
    }
  }

  return (
    <article className={cls}>
      <h2 onClick={handleToggle} title={isExpanded ? 'Hide answer' : 'Show answer'}>
        <button className="transparent-button">
          {question}
          <CopyLink
            to={`?state=${gdocId}_`}
            title="Link to question"
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
          >
            <LinkIcon />
          </CopyLink>
        </button>
      </h2>
      <AutoHeight>
        <div className={`answer ${showLongDescription ? 'long' : 'short'}`}>
          {isExpanded && (
            <>
              <div
                dangerouslySetInnerHTML={{__html: answer || '<p>Loading...</p>'}}
                ref={answerRef}
              />
              <div className="actions">
                {editLink && (
                  // TODO: on the first click (remember in localstorage), display a disclaimer popup text from https://stampy.ai/wiki/Edit_popup
                  <a
                    className="icon-link"
                    href={editLink}
                    target="_blank"
                    rel="noreferrer"
                    title="edit answer"
                  >
                    <Edit />
                    Edit
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
