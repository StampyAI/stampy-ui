import {useRef, useEffect, MutableRefObject} from 'react'
import useIsMobile from '~/hooks/isMobile'
import {canonicalizeQuestionSlug} from '~/routesMapper'
import type {PageId} from '~/server-utils/stampy'
import {addPopup} from '../popups'
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
