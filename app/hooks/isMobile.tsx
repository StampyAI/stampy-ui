import {useState, useEffect} from 'react'

const isWindow = typeof window !== 'undefined'
export default function useIsMobile() {
  const mobileWidth = 780
  const getWidth = () => (isWindow ? window.innerWidth : 1280) // assume desktop until proven otherwise (for SSR)
  const [windowWidth, setWindowWidth] = useState<number>(getWidth)

  useEffect(() => {
    if (isWindow) {
      const resize = () => setWindowWidth(getWidth())
      setWindowWidth(getWidth())

      window.addEventListener('resize', resize)

      return () => window.removeEventListener('resize', resize)
    }
  }, [])

  return windowWidth <= mobileWidth
}
