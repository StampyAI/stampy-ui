import {useEffect, RefObject} from 'react'
import useIsMobile from '~/hooks/isMobile'
import {questionUrl} from '~/routesMapper'
import {isQuestionViewable} from '~/server-utils/stampy'
import type {Glossary, GlossaryEntry, Question} from '~/server-utils/stampy'
import {useOnSiteQuestions} from '~/hooks/useCachedObjects'
import {addPopup} from '../components/popups'
import useGlossary from '~/hooks/useGlossary'

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
    .replace(/['']/g, "'") // Replace left and right single quotes (U+2018, U+2019)
    .replace(/[""]/g, '"') // Replace left and right double quotes (U+201C, U+201D)
    .replace(/[‒–—]/g, '-') // Replace figure-dash, en-dash and em-dash with hyphen
}

const glossaryInjecter = (pageid: string, glossary: Glossary, seen: Set<string>) => {
  return (html: string) => {
    const sortedGlossary = Object.values(glossary)
      .filter((item) => item.pageid != pageid)
      .sort((a, b) => (b.alias?.length ?? 0) - (a.alias?.length ?? 0))

    // Track replacements with placeholders to avoid overlapping matches
    const replacements: Array<{placeholder: string; replacement: string; term: string}> = []
    let result = html
    let placeholderCounter = 0

    // Replace ALL occurrences of each term with placeholders
    // This prevents shorter terms from matching within longer terms
    for (const {term, alias} of sortedGlossary) {
      const normalizedAlias = normalizeForComparison(alias || '')
      const pattern = new RegExp(`(^|[^\\w-])(${normalizedAlias})($|[^\\w-])`, 'gi')

      result = result.replace(pattern, (match, prefix, matchedTerm, suffix) => {
        const placeholder = `__GLOSSARY_${placeholderCounter++}__`
        replacements.push({
          placeholder,
          replacement: matchedTerm, // Store the original text
          term,
        })
        return `${prefix}${placeholder}${suffix}`
      })
    }

    // Now decide which placeholders should become glossary entries
    // Only mark as glossary entry if this term hasn't been seen before
    replacements.forEach(({placeholder, replacement, term}) => {
      if (!seen.has(term)) {
        seen.add(term)
        result = result.replace(placeholder, `<span class="glossary-entry">${replacement}</span>`)
      } else {
        result = result.replace(placeholder, replacement)
      }
    })

    return result
  }
}

const createGlossaryProcessor = (
  pageid: string,
  glossary: Glossary,
  mobile: boolean,
  onSiteQuestions: Question[],
  seen: Set<string>
) => {
  const injecter = glossaryInjecter(pageid, glossary, seen)

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
      const imageHtml = entry.image
        ? isGoogleDrive
          ? `<iframe src="${entry.image.replace(/\/view$/, '/preview')}" style="width:100%; border:none;" allowFullScreen></iframe>`
          : `<img src="${entry.image}"/>`
        : ''

      // Determine layout based on pre-computed dimensions
      let layout: 'right' | 'top' = 'right'
      if (entry.image && !isGoogleDrive && entry.imageDimensions) {
        const aspectRatio = entry.imageDimensions.width / entry.imageDimensions.height
        layout = aspectRatio > 2.0 ? 'top' : 'right'
      }

      // Create popup with pre-calculated layout
      const popupContent = imageHtml
        ? layout === 'top'
          ? `<div class="glossary-popup top-image-layout black small">
                <div class="image-container">
                  ${imageHtml}
                </div>
                <div class="text-content">
                  <div class="small-bold text-no-wrap">${entry.term}</div>
                  <div class="definition small">${entry.contents}</div>
                  ${link || ''}
                </div>
             </div>`
          : `<div class="glossary-popup right-image-layout black small">
                <div class="text-content">
                  <div class="small-bold text-no-wrap">${entry.term}</div>
                  <div class="definition small">${entry.contents}</div>
                  ${link || ''}
                </div>
                <div class="image-container">
                  ${imageHtml}
                </div>
             </div>`
        : `<div class="glossary-popup black small">
              <div class="text-content full-width">
                <div class="small-bold text-no-wrap">${entry.term}</div>
                <div class="definition small">${entry.contents}</div>
                ${link || ''}
              </div>
           </div>`

      addPopup(
        e as HTMLSpanElement,
        `glossary-${entry.term}`,
        popupContent,
        mobile,
        imageHtml ? layout : undefined
      )
    })

    return fragment
  }
}

type UseGlossaryInjectionOptions = {
  elementRef: RefObject<HTMLElement | null>
  pageid?: string
  enabled?: boolean
  seenGlossaryTermsRef?: RefObject<Set<string>>
}

/**
 * Hook to inject glossary popups into HTML content.
 * Fetches the glossary internally via useGlossary.
 *
 * @param elementRef - Ref to the container element
 * @param pageid - Optional page ID to exclude self-references
 * @param enabled - Whether to run the injection (default: true)
 * @param seenGlossaryTermsRef - Optional ref to track seen terms across multiple calls
 */
const useGlossaryInjection = ({
  elementRef,
  pageid = '',
  enabled = true,
  seenGlossaryTermsRef,
}: UseGlossaryInjectionOptions) => {
  const mobile = useIsMobile(1136)
  const glossary = useGlossary()
  const {items: onSiteQuestions} = useOnSiteQuestions()

  useEffect(() => {
    const el = elementRef.current
    if (!el || !enabled || !glossary || Object.keys(glossary).length === 0) return

    // Use provided ref if available, otherwise create a fresh Set for this processing run.
    // A fresh Set ensures each term in this content gets glossaried once,
    // even if the effect re-runs due to dependency changes.
    const seen = seenGlossaryTermsRef?.current ?? new Set<string>()

    updateTextNodes(
      el,
      createGlossaryProcessor(pageid, glossary, mobile, onSiteQuestions || [], seen)
    )
  }, [glossary, pageid, mobile, onSiteQuestions, enabled, elementRef, seenGlossaryTermsRef])
}

export default useGlossaryInjection
