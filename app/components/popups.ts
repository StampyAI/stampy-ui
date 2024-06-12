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
