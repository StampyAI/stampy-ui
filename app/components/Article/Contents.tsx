import {useRef, useEffect} from 'react'
import type {Glossary, PageId, GlossaryEntry} from '~/server-utils/stampy'

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

const addPopup = (e: HTMLElement, id: string, contents: string): HTMLElement => {
  const preexisting = document.getElementById(id)
  if (preexisting) return preexisting

  const popup = document.createElement('div')
  popup.className = 'link-popup bordered'
  popup.innerHTML = contents
  popup.id = id

  e.insertAdjacentElement('afterend', popup)

  e.addEventListener('mouseover', () => popup.classList.add('shown'))
  e.addEventListener('mouseout', () => popup.classList.remove('shown'))
  popup.addEventListener('mouseover', () => popup.classList.add('shown'))
  popup.addEventListener('mouseout', () => popup.classList.remove('shown'))

  return popup
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

/*
 * Replace all known glossary words in the given `textNode` with:
 *  - a span to mark it as a glossary item
 *  - an on hover popup with a short explaination of the glossary item
 *  - use each glossary item only once
 */
const glossaryInjecter = (pageid: string, glossary: Glossary) => {
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

  return (html: string) => {
    return unusedGlossaryEntries.reduce((html, [match, replacement], index) => {
      if (html.match(match)) {
        unusedGlossaryEntries.splice(index, 1)
        return html.replace(match, replacement)
      }
      return html
    }, html)
  }
}

const insertGlossary = (pageid: string, glossary: Glossary) => {
  const injecter = glossaryInjecter(pageid, glossary)

  return (textNode: Node) => {
    const html = (textNode.textContent || '').replace('’', "'").replace('—', '-')
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
      if (!entry) return undefined
      const link =
        entry.pageid &&
        `<a href="/${entry.pageid}" class="button secondary">View full definition</a>`
      const image = entry.image && `<img src="${entry.image}"/>`
      addPopup(
        e as HTMLSpanElement,
        `glossary-${entry.term}`,
        `<div class="glossary-popup flex-container black">
              <div class="contents">
                   <h3>${entry.term}</h3>
                   <div class="padding-bottom-24">${entry.contents}</div>
                   ${link || ''}
              </div>
              ${image || ''}
          </div>`
      )
    })

    return fragment
  }
}

const Contents = ({pageid, html, glossary}: {pageid: PageId; html: string; glossary: Glossary}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    updateTextNodes(el, insertGlossary(pageid, glossary))

    // In theory this could be extended to all links
    el.querySelectorAll('.footnote-ref > a').forEach((e) => {
      const footnote = footnoteHTML(el, e as HTMLAnchorElement)
      const footnoteId = (e.getAttribute('href') || '').replace('#', '')
      if (footnote) addPopup(e as HTMLAnchorElement, `footnote-${footnoteId}`, footnote)
    })
  }, [html, glossary, pageid])

  return (
    <div
      className="contents large-reading padding-bottom-80"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      ref={elementRef}
    />
  )
}
export default Contents
