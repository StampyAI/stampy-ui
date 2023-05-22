import type {LoaderFunction} from '@remix-run/cloudflare'
import {loadQuestionDetail, QuestionStatus} from '~/server-utils/stampy'
import {useRef, useEffect, useState} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question} from '~/server-utils/stampy'
import type useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {Edit, Link as LinkIcon} from '~/components/icons-generated'
import {Tags} from '~/routes/tags/$tag'
import CopyLink from '~/components/copyLink'
import {Action, ActionType} from '~/routes/questions/actions'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

const UNKNOWN_QUESTION_TITLE = 'Unknown question'

export const loader = async ({request, params}: Parameters<LoaderFunction>[0]) => {
  const {question} = params
  if (!question) {
    throw Error('missing question title')
  }

  try {
    return await loadQuestionDetail(request, question)
  } catch (error: any) {
    const data: Question = {
      pageid: question,
      title: UNKNOWN_QUESTION_TITLE,
      text: `No question found with ID ${question}. Please go to the Discord in the lower right
(or click <a href="https://discord.com/invite/Bt8PaRTDQC">here</a>) and report where you found this link.`,
      answerEditLink: null,
      relatedQuestions: [],
      tags: [],
    }
    return {
      error: error.toString(),
      timestamp: new Date().toISOString(),
      data,
    }
  }
}

export function fetchQuestion(pageid: string) {
  const url = `/questions/${encodeURIComponent(pageid)}`
  return fetch(url).then(async (response) => {
    const json: Awaited<ReturnType<typeof loader>> = await response.json()
    if ('error' in json) console.error(json.error)
    const {data, timestamp} = json

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
} & JSX.IntrinsicElements['div']) {
  const {
    pageid,
    title: codaTitle,
    status: codaStatus,
    text,
    answerEditLink,
    questionState,
    tags,
  } = questionProps
  const title =
    codaStatus && codaStatus !== QuestionStatus.LIVE_ON_SITE ? `WIP - ${codaTitle}` : codaTitle
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

  const handleToggle = () => {
    onToggle(questionProps)
    if (text == null) {
      refreshOnToggleAfterLoading.current = true
    }
  }

  let html
  if (text == '') {
    html = `<i>We don't have an answer for this question yet. Would you like to <a href="${answerEditLink}">write one</a>?</a>`
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
        <div className="answer" draggable="false">
          {isExpanded && (
            <>
              <Contents html={html} />
              {text !== null && text !== UNKNOWN_QUESTION_TITLE && (
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

function Contents({html}: {html: string}) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elementRef.current

    // In theory this could be extended to all links
    const footnotes = el?.querySelectorAll('.footnote-ref a')
    if (footnotes && footnotes.length) {
      footnotes.forEach((e) => {
        // Find the footnote. The href element is just the id, e.g. `#fnt12`, but
        // some browsers (or at least firefox) return a whole qualified url. Hence
        // this mucking around to extract the id
        const [_, id] = (e as HTMLLinkElement)?.href?.split('#')
        const footnote = el?.querySelector(`#${id}`) as HTMLLabelElement

        // Create an element wih the contents of the footnote ...
        const popup = document.createElement('div')
        popup.className = 'link-popup'
        popup.innerHTML = footnote?.innerHTML

        // ... but remove the back link, as it's useless in the popup
        if (popup?.firstElementChild?.lastChild)
          popup.firstElementChild.removeChild(popup.firstElementChild.lastChild)

        e?.parentElement?.appendChild(popup)

        // Add listeners to display the popup whenever the mouse is over the
        // footnote link or over the actual popup
        e.addEventListener('mouseover', (ev) => popup.classList.add('shown'))
        e.addEventListener('mouseout', (ev) => popup.classList.remove('shown'))
        popup.addEventListener('mouseover', (ev) => popup.classList.add('shown'))
        popup.addEventListener('mouseout', (ev) => popup.classList.remove('shown'))

        // The event handlers don't need to be removed, as they should exist as long
        // as the elements do, and so will be deleted along with them
      })
    }
  }, [html])

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      ref={elementRef}
    />
  )
}
