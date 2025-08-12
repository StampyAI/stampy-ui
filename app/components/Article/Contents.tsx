import {useRef, useEffect} from 'react'
import useIsMobile from '~/hooks/isMobile'
import {questionUrl} from '~/routesMapper'
import type {Glossary, PageId, GlossaryEntry} from '~/server-utils/stampy'
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

const addPopup = (
  e: HTMLElement,
  id: string,
  contents: string,
  mobile: boolean,
  hasImage: boolean = false,
  imageHtml: string = ''
): HTMLElement => {
  const preexisting = document.getElementById(id)
  if (preexisting) return preexisting

  const popup = document.createElement('div')
  popup.className = 'link-popup bordered small background'
  popup.innerHTML = contents
  popup.id = id

  e.insertAdjacentElement('afterend', popup)

  // Create image popup if needed
  let imagePopup: HTMLElement | null = null
  if (hasImage && imageHtml) {
    imagePopup = document.createElement('div')
    imagePopup.className = 'link-popup image-popup'
    imagePopup.innerHTML = `<div class="glossary-image-container">${imageHtml}</div>`
    imagePopup.id = `${id}-image`
    imagePopup.style.display = 'none'
    e.insertAdjacentElement('afterend', imagePopup)
  }

  const positionPopup = () => {
    if (!mobile) {
      const article = e.closest('article')
      if (article) {
        const articleRect = article.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const availableRight = viewportWidth - articleRect.right

        // Only position to the right if there's actually enough space in the viewport
        // Reduced minimum to allow more cases to display on the right
        if (availableRight >= 200) {
          // Position to the right of the article
          popup.classList.add('positioned-right')
          const elementRect = e.getBoundingClientRect()
          popup.style.position = 'fixed'

          // Calculate left position ensuring popup stays within viewport
          const popupWidth = Math.min(350, availableRight - 40)
          let leftPosition = articleRect.right + 20

          // Check if popup would go off the right edge
          if (leftPosition + popupWidth > viewportWidth - 20) {
            leftPosition = viewportWidth - popupWidth - 20
          }

          popup.style.left = `${leftPosition}px`
          popup.style.width = `${popupWidth}px`
          popup.style.transform = 'none'

          // Calculate vertical position ensuring popup stays in viewport
          const viewportHeight = window.innerHeight
          let topPosition = elementRect.top

          // Estimate popup height for initial positioning
          const estimatedPopupHeight = 350

          // Check if popup would go below viewport
          if (topPosition + estimatedPopupHeight > viewportHeight - 20) {
            topPosition = Math.max(10, viewportHeight - estimatedPopupHeight - 20)
          }

          popup.style.top = `${topPosition}px`

          // Position image popup above if there's space
          if (imagePopup) {
            const estimatedImageHeight = 250 // Estimate for image container
            const gap = 10 // Gap between image and text popup
            const spaceAbove = topPosition // Use adjusted position

            if (spaceAbove > estimatedImageHeight + gap + 10) {
              imagePopup.style.position = 'fixed'
              imagePopup.style.left = `${leftPosition}px`
              imagePopup.style.width = `${popupWidth}px`
              imagePopup.style.transform = 'none'
              imagePopup.style.display = 'block'
              imagePopup.classList.add('shown')

              // Wait for image to load to get actual height and reposition
              requestAnimationFrame(() => {
                if (imagePopup) {
                  const actualHeight = imagePopup.offsetHeight || estimatedImageHeight
                  // Position above the text popup (which might have been adjusted)
                  imagePopup.style.top = `${Math.max(10, topPosition - actualHeight - gap)}px`
                }
              })
            } else {
              imagePopup.classList.remove('shown')
              imagePopup.style.display = 'none'
            }
          }
        }
      }
    }
  }

  // Shared hover state for this popup group
  let isHovered = false
  let hideTimeout: number | null = null

  const clearHideTimeout = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  const actuallyShow = () => {
    // Hide any other visible popups immediately (both text and image)
    const visiblePopups = document.querySelectorAll('.link-popup.shown')
    const otherPopups = Array.from(visiblePopups).filter((p) => p !== popup && p !== imagePopup)
    otherPopups.forEach((p) => {
      // Force instant hide by temporarily disabling transitions
      const popupElement = p as HTMLElement
      popupElement.style.transition = 'none'
      p.classList.remove('shown')

      // Reset transition after next frame
      requestAnimationFrame(() => {
        const popupElement = p as HTMLElement
        popupElement.style.transition = ''
      })

      // Also hide associated image popups
      const associatedImageId = p.id + '-image'
      const associatedImage = document.getElementById(associatedImageId)
      if (associatedImage) {
        const imageElement = associatedImage as HTMLElement
        imageElement.style.transition = 'none'
        associatedImage.classList.remove('shown')
        imageElement.style.display = 'none'
        requestAnimationFrame(() => {
          imageElement.style.transition = ''
        })
      }
    })

    // Only add shown and reposition if not already shown
    if (!popup.classList.contains('shown')) {
      popup.classList.add('shown')
      positionPopup()
    }
  }

  const actuallyHide = () => {
    popup.classList.remove('shown')
    if (imagePopup) {
      imagePopup.classList.remove('shown')
    }
  }

  const toggle = () => popup.classList.toggle('shown')
  const show = () => {
    isHovered = true
    clearHideTimeout()
    // Always call actuallyShow to handle hiding other popups immediately
    actuallyShow()
  }

  const hide = () => {
    isHovered = false
    clearHideTimeout()
    // Use a small delay to allow moving between term and popup
    hideTimeout = setTimeout(() => {
      if (!isHovered) {
        actuallyHide()
      }
    }, 100) as unknown as number
  }

  if (!mobile) {
    e.addEventListener('mouseover', show)
    e.addEventListener('mouseout', hide)
    popup.addEventListener('mouseover', show)
    popup.addEventListener('mouseout', hide)
    if (imagePopup) {
      imagePopup.addEventListener('mouseover', show)
      imagePopup.addEventListener('mouseout', hide)
    }
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

const insertGlossary = (pageid: string, glossary: Glossary, mobile: boolean) => {
  // Generate a random ID for these glossary items. This is needed when mulitple articles are displayed -
  // gloassary items should be only displayed once per article, but this is checked by popup id, so if
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
      const link =
        entry.pageid &&
        `<a href="${questionUrl(entry)}" target="_blank" rel="noopener noreferrer" class="button secondary">View full definition</a>`
      const isGoogleDrive = entry.image && entry.image.includes('drive.google.com/file/d/')
      const imageHtml = entry.image
        ? isGoogleDrive
          ? `<iframe src="${entry.image.replace(/\/view$/, '/preview')}" style="width:100%; border:none;" allowFullScreen></iframe>`
          : `<img src="${entry.image}"/>`
        : ''
      addPopup(
        e as HTMLSpanElement,
        `glossary-${entry.term}-${randomId}`,
        `<div class="glossary-popup black small">
              <div class="contents full-width">
                   <div class="small-bold text-no-wrap">${entry.term}</div>
                   <div class="definition small">${entry.contents}</div>
                   ${link || ''}
              </div>
          </div>`,
        mobile,
        !!imageHtml,
        imageHtml
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
    updateTextNodes(el, insertGlossary(pageid, glossary, mobile))

    // In theory this could be extended to all links
    el.querySelectorAll('.footnote-ref > a').forEach((e) => {
      const footnote = footnoteHTML(el, e as HTMLAnchorElement)
      const footnoteId = (e.getAttribute('href') || '').replace('#', '')
      if (footnote) {
        addPopup(
          e as HTMLAnchorElement,
          `footnote-${footnoteId}`,
          `<div class="footnote">${footnote}</div>`,
          mobile,
          false,
          ''
        )
      }
    })
  }, [html, carousels, glossary, pageid, mobile])

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
