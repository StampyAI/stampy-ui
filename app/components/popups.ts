export const scrollToElement = (e: HTMLElement, offset?: number) => {
  const elementPosition = e.getBoundingClientRect().top + window.scrollY
  const offsetPosition = elementPosition - (offset || 0)

  window.scrollTo({top: offsetPosition, behavior: 'smooth'})
}

export const togglePopup =
  (onToggle: () => void, reference?: HTMLElement) => (event: MouseEvent | React.MouseEvent) => {
    event.preventDefault()
    onToggle()
    document.body.classList.toggle('noscroll')
    reference && scrollToElement(reference, 16)
  }

// TODO: Potential memory leak - event listeners are not cleaned up.
// Consider refactoring to React components with proper cleanup in useEffect.
export const addPopup = (
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
