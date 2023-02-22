import {useEffect, useState, DragEvent} from 'react'
import type {Question, PageId} from '~/server-utils/stampy'

export default function useDraggable(onMove: (pageid: PageId, to: PageId | null) => void) {
  const [draggedOver, setDraggedOver] = useState<PageId | null>(null)

  useEffect(() => {
    // This handles questions being dragged outside the questions list
    const handleDrag = (e: DragEvent) => {
      e.preventDefault()
      // the effect will be set to 'move' if it was over the questions list
      if (e.dataTransfer.effectAllowed === 'uninitialized') {
        setDraggedOver(null)
      }
    }

    window.addEventListener('dragover', handleDrag as any)
    return () => {
      // Make sure to remove this listner when the component is destroyed
      window.removeEventListener('dragover', handleDrag as any)
    }
  }, [])

  const handleDragOver = (question: {pageid: PageId | null}) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.effectAllowed = 'move'
    if (question) setDraggedOver(question.pageid)
  }

  const handleDragStart = (question: Question) => (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('pageId', question.pageid)

    // Add the question's URL so it can be dragged to a new tab
    const url = new URL(window.location.href)
    url.search = `state=${question.pageid}_`
    e.dataTransfer.setData('text/uri-list', url.href)

    // Add the title as a fallback param - this allows it to be dragged into the search bar
    e.dataTransfer.setData('text', question.title)
  }

  const handleDragEnd = (question: Question) => () => {
    onMove(question.pageid, draggedOver)
    setDraggedOver(null)
  }

  const DragPlaceholder = ({pageid}: {pageid: PageId}) => {
    if (draggedOver == pageid) return <hr className="drag-placeholder"></hr>
    return <></>
  }

  return {
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    DragPlaceholder,
  }
}
