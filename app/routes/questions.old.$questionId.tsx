import {defer, type LoaderFunctionArgs} from '@remix-run/cloudflare'
import {GlossaryEntry, loadQuestionDetail, loadTags, QuestionState} from '~/server-utils/stampy'
import {useRef, useEffect, useState} from 'react'
import AutoHeight from 'react-auto-height'
import type {Question, Glossary, PageId, Banner as BannerType} from '~/server-utils/stampy'
import type useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {Edit, Link as LinkIcon} from '~/components/icons-generated'
import {Tags} from '~/routes/tags.single.$tag'
import CopyLink from '~/components/copyLink'
import {Action, ActionType} from '~/routes/questions.actions'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'

const UNKNOWN_QUESTION_TITLE = 'Unknown question'
export const LINK_WITHOUT_DETAILS_CLS = 'link-without-details'

const raise500 = (error: Error) => new Response(error.toString(), {status: 500})

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const {questionId} = params
  if (!questionId) {
    throw new Response('Missing question title', {status: 400})
  }

  try {
    const dataPromise = loadQuestionDetail(request, questionId)
      .then(({data}) => data)
      .catch(raise500)
    const tagsPromise = loadTags(request)
      .then(({data}) => data)
      .catch(raise500)
    return defer({data: dataPromise, tags: tagsPromise})
  } catch (error: unknown) {
    const msg = `No question found with ID ${questionId}. Please go to <a href="https://discord.com/invite/Bt8PaRTDQC">Discord</a> and report where you found this link.`
    throw new Response(msg, {status: 404})
  }
}

export function fetchQuestion(pageid: string) {
  const url = `/questions/${encodeURIComponent(pageid)}`
  return fetch(url)
    .then(async (response) => {
      const json: Awaited<ReturnType<typeof loadQuestionDetail>> = await response.json()
      if ('error' in json) console.error(json.error)
      const {data, timestamp} = json

      reloadInBackgroundIfNeeded(url, timestamp)

      return data
    })
    .catch((e) => {
      throw raise500(e)
    })
}

export function Question({
  questionProps,
  onLazyLoadQuestion,
  onToggle,
  selectQuestion,
  glossary,
  embedWithoutDetails,
  ...dragProps
}: {
  questionProps: Question
  onLazyLoadQuestion: (question: Question) => void
  onToggle: ReturnType<typeof useQuestionStateInUrl>['toggleQuestion']
  glossary: Glossary
  selectQuestion: (pageid: string, title: string) => void
  embedWithoutDetails?: boolean
} & JSX.IntrinsicElements['div']) {
  const {pageid, title, text, answerEditLink, questionState, tags, banners} = questionProps
  const isLoading = useRef(false)

  const isExpanded = questionState === QuestionState.OPEN
  const isRelated = questionState === QuestionState.RELATED
  const clsExpanded = isExpanded ? 'expanded' : isRelated ? 'related' : 'collapsed'

  const [isLinkHovered, setLinkHovered] = useState(false)
  const clsLinkHovered = isLinkHovered ? 'link-hovered' : ''
  const cls = `${clsExpanded} ${clsLinkHovered}`

  useEffect(() => {
    if (text == null && !isLoading.current) {
      isLoading.current = true
      // This is where the actual contents of the question get fetched from the backend
      fetchQuestion(pageid).then((newQuestionProps) => {
        if (!newQuestionProps) return
        onLazyLoadQuestion(newQuestionProps)
        if (isExpanded) onToggle(newQuestionProps, {onlyRelated: true})
      })
    }
  }, [pageid, text, onLazyLoadQuestion, onToggle, isExpanded])

  const handleToggle = () => {
    onToggle(questionProps)
  }

  if (embedWithoutDetails) {
    return (
      <article className={cls}>
        <h2>
          <a
            href={`https://aisafety.info/?state=${pageid}_`}
            className={`transparent-link ${LINK_WITHOUT_DETAILS_CLS}`}
            target="_blank"
            rel="noreferrer"
          >
            {title}
          </a>
        </h2>
      </article>
    )
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
      <h2
        onClick={handleToggle}
        className="chevron"
        title={isExpanded ? 'Hide answer' : 'Show answer'}
        {...dragProps}
      >
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
              <div className="banners">{banners && banners.map(Banner)}</div>
              <Contents pageid={pageid} html={html} glossary={glossary} />
              {text !== null && text !== UNKNOWN_QUESTION_TITLE && (
                /* Any changes to this class should also be reflected in App.handleSpecialLinks */
                <div className="question-footer">
                  <Tags tags={tags} selectQuestion={selectQuestion} />
                  <div className="actions">
                    <Action pageid={pageid} showText={false} actionType={ActionType.HELPFUL} />
                    <Action pageid={pageid} showText={false} actionType={ActionType.UNHELPFUL} />
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

const Banner = ({title, text, icon, backgroundColour, textColour}: BannerType) => {
  return (
    <div
      className="banner"
      style={{
        backgroundColor: backgroundColour || 'inherit',
        color: textColour || 'inherit',
      }}
    >
      <h3>
        <img src={icon?.url} alt={icon?.name} />
        <span className="title">{title}</span>
      </h3>
      <div
        className="banner-contents"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      ></div>
    </div>
  )
}

/*
 * Recursively go through the child nodes of the provided node, and replace all text nodes
 * with the result of calling `textProcessor(textNode)`
 */
const updateTextNodes = (el: Node, textProcessor: (node: Node) => Node) => {
  Array.from(el.childNodes).forEach((child) => updateTextNodes(child, textProcessor))

  if (el.nodeType == Node.TEXT_NODE && el.textContent) {
    const node = textProcessor(el)
    el?.parentNode?.replaceChild(node, el)
  }
}

function Contents({pageid, html, glossary}: {pageid: PageId; html: string; glossary: Glossary}) {
  const elementRef = useRef<HTMLDivElement>(null)

  const footnoteHTML = (el: HTMLDivElement, e: HTMLAnchorElement): string | null => {
    const id = e.getAttribute('href') || ''
    const footnote = el.querySelector(id)

    if (!footnote) return null

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
     *  - use each glossary item only once
     */
    const unusedGlossaryEntries = Object.values(glossary)
      .filter((item) => item.pageid != pageid)
      .map(({term}) => term)
      .sort((a, b) => b.length - a.length)
      .map(
        (term) =>
          [
            new RegExp(`(^|[^\\w-])(${term})($|[^\\w-])`, 'i'),
            '$1<span class="glossary-entry">$2</span>$3',
          ] as const
      )
    const insertGlossary = (textNode: Node) => {
      const html = (textNode.textContent || '').replace('’', "'").replace('—', '-')
      // The glossary items have to be injected somewhere, so this does it by manually wrapping any known
      // definitions with spans. This is done from the longest to the shortest to make sure that sub strings
      // of longer definitions don't override them.
      const updated = unusedGlossaryEntries.reduce((html, [match, replacement], index) => {
        if (html.match(match)) {
          unusedGlossaryEntries.splice(index, 1)
          return html.replace(match, replacement)
        }
        return html
      }, html)
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
            `<div>${entry.contents}</div>` +
              (entry.pageid ? `<br><a href="/?state=${entry.pageid}_">See more...</a>` : '')
          )
      })

      return fragment
    }

    updateTextNodes(el, insertGlossary)

    // In theory this could be extended to all links
    el.querySelectorAll('.footnote-ref > a').forEach((e) => {
      const footnote = footnoteHTML(el, e as HTMLAnchorElement)
      if (footnote) addPopup(e as HTMLAnchorElement, footnote)
    })
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
