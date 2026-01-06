import {useRef, useEffect, MutableRefObject} from 'react'
import useIsMobile from '~/hooks/isMobile'
import {canonicalizeQuestionSlug} from '~/routesMapper'
import type {PageId} from '~/server-utils/stampy'
import {togglePopup} from '../popups'
import {createRoot} from 'react-dom/client'
import MediaCarousel from '../MediaCarousel'
import {Carousel} from '~/server-utils/parsing-utils'
import useGlossaryInjection from '~/hooks/useGlossaryInjection'

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

// TODO: Potential memory leak - event listeners are not cleaned up.
// Consider refactoring to React components with proper cleanup in useEffect.
const addPopup = (
  e: HTMLElement,
  id: string,
  contents: string,
  mobile: boolean,
  layout?: string
): void => {
  const preexisting = document.getElementById(id)
  if (preexisting) return

  const popup = document.createElement('div')
  popup.className = 'link-popup bordered small background'
  if (layout) {
    popup.classList.add(`${layout}-image-layout`)
  }
  popup.innerHTML = contents
  popup.id = id

  e.insertAdjacentElement('afterend', popup)

  // Timeout management for show/hide delays
  let showTimeout: number | null = null
  let hideTimeout: number | null = null

  const clearTimeouts = () => {
    if (showTimeout) {
      clearTimeout(showTimeout)
      showTimeout = null
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  const toggle = () => popup.classList.toggle('shown')

  const show = () => {
    clearTimeouts()
    showTimeout = window.setTimeout(() => {
      // Position popup above if it would not fit in viewport
      const elementRect = e.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Check if popup would fit below the element
      const estimatedPopupHeight = 250
      const wouldFitBelow = elementRect.bottom + estimatedPopupHeight <= viewportHeight - 50

      // If it doesn't fit below, position it above
      if (!wouldFitBelow) {
        popup.classList.add('position-above')
      } else {
        popup.classList.remove('position-above')
      }

      popup.classList.add('shown')
      showTimeout = null
    }, 500)
  }

  const hide = () => {
    clearTimeouts()
    hideTimeout = window.setTimeout(() => {
      popup.classList.remove('shown')
      hideTimeout = null
    }, 100)
  }

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
}

const Contents = ({
  pageid,
  html,
  carousels,
  className = '',
  seenGlossaryTermsRef,
}: {
  pageid: PageId
  html: string
  carousels?: Carousel[]
  className?: string
  seenGlossaryTermsRef: MutableRefObject<Set<string>>
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const mobile = useIsMobile(1136)

  // Use the shared glossary injection hook
  useGlossaryInjection({
    elementRef,
    pageid,
    seenGlossaryTermsRef,
  })

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

    // Canonicalize internal question URLs (replace spaces with hyphens)
    el.querySelectorAll('a[href^="/questions/"]').forEach((link) => {
      const anchor = link as HTMLAnchorElement
      const href = anchor.getAttribute('href')
      if (href) {
        const decodedHref = decodeURIComponent(href)
        const pathSegments = decodedHref.split('/')
        // URL structure: ['', 'questions', '{id}', '{slug}', ...]
        const SLUG_START_INDEX = 3
        const canonicalHref = pathSegments
          .map((segment, index) => {
            if (index >= SLUG_START_INDEX) {
              return canonicalizeQuestionSlug(segment)
            }
            return segment
          })
          .join('/')

        if (href !== canonicalHref) {
          anchor.setAttribute('href', canonicalHref)
        }
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

    // In theory this could be extended to all links
    el.querySelectorAll('.footnote-ref > a').forEach((e) => {
      const anchor = e as HTMLAnchorElement
      const footnote = footnoteHTML(el, anchor)
      const footnoteId = (anchor.getAttribute('href') || '').replace('#', '')

      // Add popup for hover
      if (footnote) {
        addPopup(
          anchor,
          `footnote-${footnoteId}`,
          `<div class="footnote">${footnote}</div>`,
          mobile
        )
      }

      // Fix forward navigation to work on first click (Remix router intercepts hash links)
      if (footnoteId) {
        anchor.onclick = (e) => {
          e.preventDefault()
          const target = document.getElementById(footnoteId)
          target?.scrollIntoView({block: 'start'})
        }
      }
    })

    // Fix footnote back links to work on first click (Remix router intercepts hash links)
    el.querySelectorAll('.footnote-backref').forEach((backLink) => {
      const anchor = backLink as HTMLAnchorElement
      const targetId = anchor.getAttribute('href')?.replace('#', '')
      if (targetId) {
        anchor.onclick = (e) => {
          e.preventDefault()
          const target = document.getElementById(targetId)
          target?.scrollIntoView({block: 'start'})
        }
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
  }, [html, carousels, mobile])

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
