import type {LoaderFunction} from '@remix-run/cloudflare'
import {loadQuestionDetail, QuestionStatus} from '~/server-utils/stampy'
import {useRef, useEffect, useState} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question} from '~/server-utils/stampy'
import type useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {Edit, Link as LinkIcon} from '~/components/icons-generated'
import Tags from '~/components/tags'
import CopyLink from '~/components/copyLink'
import {Action, ActionType} from '~/routes/questions/actions'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const loader = async ({request, params}: Parameters<LoaderFunction>[0]) => {
  const {question} = params
  if (!question) {
    throw Error('missing question title')
  }

  try {
    return await loadQuestionDetail(request, question)
  } catch (error) {
    return {
      error: error.toString(),
      timestamp: new Date().toISOString(),
      data: {
        pageid: question,
        title: 'Unknown question',
        text: `No question found with ID ${question}. Please go to the Discord in the lower right
(or click <a href="https://discord.com/invite/Bt8PaRTDQC">here</a>) and report where you found this link.`,
        relatedQuestions: [],
        status: QuestionStatus.UNKNOWN,
      },
    }
  }
}

export function fetchQuestion(pageid: string) {
  const url = `/questions/${encodeURIComponent(pageid)}`
  return fetch(url).then(async (response) => {
    const {data, timestamp, error}: Awaited<ReturnType<typeof loader>> = await response.json()

    if (error) console.error(error)

    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}

export function Question({
  questionProps,
  onLazyLoadQuestion,
  onToggle,
  selectQuestion,
  ...dragProps
}: {
  questionProps: Question
  onLazyLoadQuestion: (question: Question) => void
  onToggle: ReturnType<typeof useQuestionStateInUrl>['toggleQuestion']
  selectQuestion: (pageid: string, title: string) => void
  [k: string]: JSX.IntrinsicElements['div']
}) {
  const {pageid, title, text, answerEditLink, questionState, tags} = questionProps
  const isLoading = useRef(false)
  const refreshOnToggleAfterLoading = useRef(false)
  useEffect(() => {
    if (text == null && !isLoading.current) {
      isLoading.current = true
      fetchQuestion(pageid).then((newQuestionProps) => {
        if (!newQuestionProps) return
        onLazyLoadQuestion(newQuestionProps)
        if (refreshOnToggleAfterLoading.current) {
          onToggle(newQuestionProps)
          refreshOnToggleAfterLoading.current = false
        }
      })
    }
  }, [pageid, text, onLazyLoadQuestion, onToggle])

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
    if (text == null) {
      refreshOnToggleAfterLoading.current = true
    }
  }

  let html
  if (text == '') {
    html = '<i>(empty)</i>'
  } else if (text == null) {
    html = 'Loading...'
  } else {
    html = text
  }

  return (
    <article className={cls}>
      <h2 onClick={handleToggle} title={isExpanded ? 'Hide answer' : 'Show answer'} {...dragProps}>
        <button className="transparent-button">
          {title}
          <CopyLink
            to={`?state=${pageid}_`}
            title="Link to question"
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
          >
            <LinkIcon />
          </CopyLink>
        </button>
      </h2>
      <AutoHeight>
        <div className={`answer ${showLongDescription ? 'long' : 'short'}`} draggable="false">
          {isExpanded && (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
                ref={answerRef}
              />
              {text !== null && questionProps.status != QuestionStatus.UNKNOWN && (
                /* Any changes to this class should also be reflected in App.handleSpecialLinks */
                <div className="question-footer">
                  <Tags tags={tags} selectQuestion={selectQuestion} />
                  <div className="actions">
                    <Action pageid={pageid} actionType={ActionType.HELPFUL} />
                    {answerEditLink && (
                      // TODO: on the first click (remember in localstorage), display a disclaimer popup text from https://stampy.ai/wiki/Edit_popup
                      <a
                        className="icon-link"
                        href={answerEditLink}
                        target="_blank"
                        rel="noreferrer"
                        title="edit answer"
                      >
                        <Edit />
                        Edit
                      </a>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AutoHeight>
    </article>
  )
}
