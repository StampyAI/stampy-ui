import {useState, useLayoutEffect} from 'react'

export default function useIsMobile(mobileWidth = 780) {
  const [windowWidth, setWindowWidth] = useState<number>()

  useLayoutEffect(() => {
    const measureWidth = () => setWindowWidth(window.innerWidth)
    measureWidth()

    window.addEventListener('resize', measureWidth)

    return () => window.removeEventListener('resize', measureWidth)
  }, [])

  return windowWidth ? windowWidth <= mobileWidth : null
}
