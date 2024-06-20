import {useEffect, useRef} from 'react'

const useOutsideOnClick = (onClick?: () => void) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onClick) return

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !(ref.current as any)?.contains(e.target)) {
        onClick()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClick])

  return ref
}

export default useOutsideOnClick
