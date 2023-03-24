import {useCallback, useRef} from 'react'

type Props = {
  children: any
  onClose: (e: any) => void
  [k: string]: any
}

export default function Dialog({children, onClose}: Props) {
  // React magic to get the actual DOM element once it's been mounted
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const dialogSetter = useCallback((node: HTMLDialogElement) => {
    if (node !== null) {
      // Show the dialog this way, in order for it to automatically handle escapes
      node.showModal()
      dialogRef.current = node
    }
  }, [])

  // Calculate whether the given click event was outside of the dialog, and if so close it
  const closeIfOutside = (e: React.MouseEvent<HTMLElement>) => {
    // If there isn't any dialog displayed, then the click obviously wasn't in it
    if (dialogRef?.current == null) return

    const rect = dialogRef.current.getBoundingClientRect()
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    if (!isInDialog) {
      dialogRef.current.close()
    }
  }

  // Older browsers don't support HTML5 dialogs, so add a fallback option for them
  const nativeDialogSupport = !!document.createElement('dialog').showModal
  if (nativeDialogSupport) {
    return (
      <dialog ref={dialogSetter} className="dialog" onClose={onClose} onClick={closeIfOutside}>
        <div className="dialog-contents">{children}</div>
      </dialog>
    )
  } else {
    return (
      <div className="dialog">
        <button className="close" onClick={onClose}>
          X
        </button>
        <div className="dialog-contents">{children}</div>
      </div>
    )
  }
}
