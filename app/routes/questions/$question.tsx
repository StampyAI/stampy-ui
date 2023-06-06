import type {LoaderArgs} from '@remix-run/cloudflare'
import {GlossaryEntry, loadQuestionDetail, QuestionStatus} from '~/server-utils/stampy'
import {useRef, useEffect, useState} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question, Glossary, PageId} from '~/server-utils/stampy'
import type useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {Edit, Link as LinkIcon} from '~/components/icons-generated'
import {Tags} from '~/routes/tags/$tag'
import CopyLink from '~/components/copyLink'
import {Action, ActionType} from '~/routes/questions/actions'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

const UNKNOWN_QUESTION_TITLE = 'Unknown question'

export const loader = async ({request, params}: LoaderArgs) => {
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
  glossary,
  ...dragProps
}: {
  questionProps: Question
  onLazyLoadQuestion: (question: Question) => void
  onToggle: ReturnType<typeof useQuestionStateInUrl>['toggleQuestion']
  glossary: Glossary
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
      // This is where the actual contents of the question get fetched from the backend
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
              <Contents pageid={pageid} html={html} glossary={glossary} />
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

/*
 * Recursively go through the child nodes of the provided node, and replace all text nodes
 * with the result of calling `textProcessor(textNode)`
 */
const updateTextNodes = (el: Node, textProcessor: (node: Node) => Node) => {
  Array.from(el.childNodes).forEach((child) => updateTextNodes(child, textProcessor))

  if (el.nodeType == Node.TEXT_NODE && el.textContent && el?.parentElement?.tagName != 'A') {
    const node = textProcessor(el)
    el?.parentNode?.replaceChild(node, el)
  }
}

function Contents({pageid, html, glossary}: {pageid: PageId; html: string; glossary: Glossary}) {
  const elementRef = useRef<HTMLDivElement>(null)

  const footnoteHTML = (el: HTMLDivElement, e: HTMLAnchorElement): string => {
    const id = e.getAttribute('href') || ''
    const footnote = el.querySelector(id) as HTMLLabelElement

    const elem = document.createElement('div')
    elem.innerHTML = footnote.innerHTML

    // remove the back link, as it's useless in the popup
    if (elem?.firstElementChild?.lastChild)
      elem.firstElementChild.removeChild(elem.firstElementChild.lastChild)

    return elem.innerHTML
  }

  const addPopup = (e: HTMLElement, contents: string): HTMLElement => {
    const popup = document.createElement('div')
    popup.className = 'link-popup'
    popup.innerHTML = contents

    e.insertAdjacentElement('afterend', popup)

    e.addEventListener('mouseover', () => popup.classList.add('shown'))
    e.addEventListener('mouseout', () => popup.classList.remove('shown'))
    popup.addEventListener('mouseover', () => popup.classList.add('shown'))
    popup.addEventListener('mouseout', () => popup.classList.remove('shown'))

    return popup
  }

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    /*
     * Replace all known glossary words in the given `textNode` with:
     *  - a span to mark it as a glossary item
     *  - an on hover popup with a short explaination of the glossary item
     */
    const insertGlossary = (textNode: Node) => {
      const html = textNode.textContent || ''
      // The glossary items have to be injected somewhere, so this does it by manually wrapping any known
      // definitions with spans. This is done from the longest to the shortest to make sure that sub strings
      // of longer definitions don't override them.
      const updated = Object.keys(glossary)
        .sort((a, b) => b.length - a.length)
        .reduce(
          (html, entry) =>
            html.replace(
              new RegExp(`(^|[^\\w-])(${entry})($|[^\\w-])`, 'gi'),
              '$1<span class="glossary-entry">$2</span>$3'
            ),
          html
        )
      if (updated == html) {
        return textNode
      }

      const range = document.createRange()
      const fragment = range.createContextualFragment(updated)

      /*
       * If the provided element is a word in the glossary, return its data.
       * This is used to filter out invalid glossary elements
       */
      const glossaryEntry = (e: Element) => {
        const entry = e.textContent && glossary[e?.textContent.toLowerCase().trim()]
        if (
          // If the contents of this item aren't simply a glossary item word, then
          // something has gone wrong and the glossary-entry should be removed
          !entry ||
          // It's possible for a glossary entry to contain another one (e.g. 'goodness' and 'good'), so
          // if this entry is a subset of a bigger entry, remove it.
          e.parentElement?.classList.contains('glossary-entry') ||
          // Remove entries that point to the current question
          pageid == (entry as GlossaryEntry)?.pageid
        ) {
          return null
        }
        return entry
      }

      /*
       * Add a popup to all real glossary words in this text node
       */
      fragment.querySelectorAll('.glossary-entry').forEach((e) => {
        const entry = glossaryEntry(e)
        entry &&
          addPopup(
            e as HTMLSpanElement,
            `<div>${entry.contents}</div><br><a href="/?state=${entry.pageid}_">See more...</a>`
          )
      })

      return fragment
    }

    updateTextNodes(el, insertGlossary)

    // In theory this could be extended to all links
    el.querySelectorAll('.footnote-ref > a').forEach((e) =>
      addPopup(e as HTMLAnchorElement, footnoteHTML(el, e as HTMLAnchorElement))
    )
  }, [html, glossary, pageid])

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      ref={elementRef}
    />
  )
}
