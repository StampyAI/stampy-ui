import {useRef, useEffect} from 'react'
import useIsMobile from '~/hooks/isMobile'
import {questionUrl} from '~/routesMapper'
import {isQuestionViewable} from '~/server-utils/stampy'
import type {Glossary, PageId, GlossaryEntry, Question} from '~/server-utils/stampy'
import {useOnSiteQuestions} from '~/hooks/useCachedObjects'
import {togglePopup} from '../popups'
import {createRoot} from 'react-dom/client'
import MediaCarousel from '../MediaCarousel'
import {Carousel} from '~/server-utils/parsing-utils'

const footnoteHTML = (el: HTMLDivElement, e: HTMLAnchorElement): string | null => {
  const id = e.getAttribute('href') || ''
  const footnote = el.querySelector(id)

  if (!footnote) return null

  const elem = footnote.cloneNode(true) as Element

  // remove the back link, as it's useless in the popup
  Array.from(elem.getElementsByClassName('footnote-backref')).forEach((e) => {
    e.parentElement?.removeChild(e)
  })

  return elem.firstElementChild?.innerHTML || null
}

const addPopup = (e: HTMLElement, id: string, contents: string, mobile: boolean): HTMLElement => {
  const preexisting = document.getElementById(id)
  if (preexisting) return preexisting

  const popup = document.createElement('div')
  popup.className = 'link-popup bordered small background'
  popup.innerHTML = contents
  popup.id = id

  e.insertAdjacentElement('afterend', popup)

  const toggle = () => popup.classList.toggle('shown')
  const show = () => popup.classList.add('shown')
  const hide = () => popup.classList.remove('shown')

  if (!mobile) {
    e.addEventListener('mouseover', show)
    e.addEventListener('mouseout', hide)
    popup.addEventListener('mouseover', show)
    popup.addEventListener('mouseout', hide)
  } else {
    popup.addEventListener('click', togglePopup(toggle, e))
    e.addEventListener('click', togglePopup(toggle, e))
    popup.children[0].addEventListener('click', (e) => e.stopPropagation())
  }

  return popup
}

/*
 * Recursively go through the child nodes of the provided node, and replace all text nodes
 * with the result of calling `textProcessor(textNode)`.
 * Skip text nodes that are within:
 * - Link elements
 * - Heading tags (h1-h5)
 * - Existing glossary entries
 * - Glossary popups
 */
const updateTextNodes = (el: Node, textProcessor: (node: Node) => Node) => {
  Array.from(el.childNodes).forEach((child) => updateTextNodes(child, textProcessor))

  // Central check for excluding text from glossary processing based on its HTML context
  const shouldSkipGlossary = (node: Node): boolean => {
    // Node doesn't have closest(), but Element does
    // Check if node has a parentElement we can use closest() on
    return Boolean(
      // Skip links, headings, and existing glossary entries
      node.parentElement?.closest('a, h1, h2, h3, h4, h5, .glossary-entry, .glossary-popup')
    )
  }

  if (el.nodeType == Node.TEXT_NODE && el.textContent && !shouldSkipGlossary(el)) {
    const node = textProcessor(el)
    el?.parentNode?.replaceChild(node, el)
  }
}

/*
 * Replace all known glossary words in the given `textNode` with:
 *  - a span to mark it as a glossary item
 *  - an on hover popup with a short explaination of the glossary item
 *  - use each glossary item only once
 */
const normalizeForComparison = (text: string): string => {
  // Standardize fancy quotes and dashes with their simpler equivalents
  return text
    .replace(/[‘’]/g, "'") // Replace left and right single quotes (U+2018, U+2019)
    .replace(/[“”]/g, '"') // Replace left and right double quotes (U+201C, U+201D)
    .replace(/[‒–—]/g, '-') // Replace figure-dash, en-dash and em-dash with hyphen
}

const glossaryInjecter = (pageid: string, glossary: Glossary) => {
  const seen = new Set()
  return (html: string) => {
    // Normalize for comparison to find terms regardless of formatting
    const normalizedHtml = normalizeForComparison(html)

    return Object.values(glossary)
      .filter((item) => item.pageid != pageid)
      .sort((a, b) => (b.alias?.length ?? 0) - (a.alias?.length ?? 0))
      .reduce((currentHtml, {term, alias}) => {
        // Create a normalized pattern for matching variations in formatting
        const normalizedAlias = normalizeForComparison(alias || '')
        const match = new RegExp(`(^|[^\\w-])(${normalizedAlias})($|[^\\w-])`, 'i')

        // Check if the term exists in the normalized HTML
        if (!seen.has(term) && normalizedHtml.search(match) >= 0) {
          seen.add(term)

          return currentHtml.replace(match, '$1<span class="glossary-entry">$2</span>$3')
        }
        return currentHtml
      }, html)
  }
}

const insertGlossary = (
  pageid: string,
  glossary: Glossary,
  mobile: boolean,
  onSiteQuestions: Question[]
) => {
  // Generate a random ID for these glossary items. This is needed when multiple articles are displayed -
  // glossary items should be only displayed once per article, but this is checked by popup id, so if
  // there are 2 articles that have the same glossary item, then only the first articles popups would work
  const randomId = Math.floor(1000 + Math.random() * 9000).toString()
  const injecter = glossaryInjecter(pageid, glossary)

  return (textNode: Node) => {
    const html = textNode.textContent || ''
    // The glossary items have to be injected somewhere, so this does it by manually wrapping any known
    // definitions with spans. This is done from the longest to the shortest to make sure that sub strings
    // of longer definitions don't override them.
    const updated = injecter(html)
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
      if (!entry) return undefined

      const linkedQuestionIsViewable =
        entry.pageid && isQuestionViewable(onSiteQuestions?.find((q) => q.pageid === entry.pageid))

      const link =
        linkedQuestionIsViewable &&
        `<a href="${questionUrl(entry)}" target="_blank" rel="noopener noreferrer" class="button secondary">View full definition</a>`
      const isGoogleDrive = entry.image && entry.image.includes('drive.google.com/file/d/')
      const image = entry.image
        ? isGoogleDrive
          ? `<iframe src="${entry.image.replace(/\/view$/, '/preview')}" style="width:100%; border:none;" allowFullScreen></iframe>`
          : `<img src="${entry.image}"/>`
        : ''
      addPopup(
        e as HTMLSpanElement,
        `glossary-${entry.term}-${randomId}`,
        `<div class="glossary-popup flex-container black small">
              <div class="contents ${image ? '' : 'full-width'}">
                   <div class="small-bold text-no-wrap">${entry.term}</div>
                   <div class="definition small">${entry.contents}</div>
                   ${link || ''}
              </div>
              ${image || ''}
          </div>`,
        mobile
      )
    })

    return fragment
  }
}

const Contents = ({
  pageid,
  html,
  carousels,
  glossary,
  className = '',
}: {
  pageid: PageId
  html: string
  carousels?: Carousel[]
  glossary: Glossary
  className?: string
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const mobile = useIsMobile(1136)
  const {items: onSiteQuestions} = useOnSiteQuestions()

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // Replace carousel placeholders with actual carousel components
    carousels?.forEach((carousel) => {
      const placeholder = el.querySelector(`#${carousel.id}`)
      if (placeholder) {
        const root = createRoot(placeholder)
        root.render(<MediaCarousel items={carousel.items} />)
      }
    })

    // Process captions
    const paragraphs = el.getElementsByTagName('p')
    for (const p of paragraphs) {
      const text = p.textContent || ''
      const html = p.innerHTML || ''
      if (text.startsWith('Caption:')) {
        p.classList.add('image-caption')
        p.innerHTML = html.replace(/Caption:\s*/, '')
      }
    }
    updateTextNodes(el, insertGlossary(pageid, glossary, mobile, onSiteQuestions || []))

    // In theory this could be extended to all links
    el.querySelectorAll('.footnote-ref > a').forEach((e) => {
      const footnote = footnoteHTML(el, e as HTMLAnchorElement)
      const footnoteId = (e.getAttribute('href') || '').replace('#', '')
      if (footnote) {
        addPopup(
          e as HTMLAnchorElement,
          `footnote-${footnoteId}`,
          `<div class="footnote">${footnote}</div>`,
          mobile
        )
      }
    })

    // Wrap tables for horizontal scrolling on mobile
    const tables = el.getElementsByTagName('table')
    for (const table of tables) {
      const wrapper = document.createElement('div')
      wrapper.className = 'table-container'
      table.parentNode?.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    }
  }, [html, carousels, glossary, pageid, mobile, onSiteQuestions])

  return (
    <div
      className={`contents large-reading ${className}`}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      ref={elementRef}
    />
  )
}
export default Contents
