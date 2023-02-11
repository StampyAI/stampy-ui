import type {LoaderFunction} from '@remix-run/cloudflare'
import {loadQuestionDetail} from '~/server-utils/stampy'
import {useRef, useEffect, useState} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question} from '~/server-utils/stampy'
import type useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {Edit, Link as LinkIcon} from '~/components/icons-generated'
import Tags from '~/components/tags'
import CopyLink from '~/components/copyLink'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

export const loader = async ({request, params}: Parameters<LoaderFunction>[0]) => {
  const {question} = params
  if (!question) {
    throw Error('missing question title')
  }

  return await loadQuestionDetail(request, question)
}

export function fetchQuestion(pageid: string) {
  const url = `/questions/${encodeURIComponent(pageid)}`
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
  selectQuestion,
}: {
  questionProps: Question
  onLazyLoadQuestion: (question: Question) => void
  onToggle: ReturnType<typeof useQuestionStateInUrl>['toggleQuestion']
  selectQuestion: (pageid: string, title: string) => void
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
    const textWithUrlsInIframes = urlToIframe(text);
    html = textWithUrlsInIframes;
  }

  return (
    <article className={cls}>
      <h2 onClick={handleToggle} title={isExpanded ? 'Hide answer' : 'Show answer'}>
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
        <div className={`answer ${showLongDescription ? 'long' : 'short'}`}>
          {isExpanded && (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
                ref={answerRef}
              />
              <div className="question-footer">
                <Tags tags={tags} selectQuestion={selectQuestion} />
                <div className="actions">
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
            </>
          )}
        </div>
      </AutoHeight>
    </article>
  )
}

/**
 * Replaces all of the URLs in text with iframes of the URLs
 * @param text text in which URLs should be replaced
 */
function urlToIframe(text: string) {
  const whitelistedHosts = [
    "coda.io",
    "airtable.com", 
    "aisafety.world"
  ]
  // Regex is from: https://stackoverflow.com/a/3809435
  const httpsUrlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi)
  const matches = text.matchAll(httpsUrlRegex)
  let updatedText = text
  for (const match of matches) {
    const url = match[0] 
    if (whitelistedHosts.includes(new URL(url).host))
    updatedText = text.replace(url, `<iframe src="${url}">`)
  }
  return updatedText
}
