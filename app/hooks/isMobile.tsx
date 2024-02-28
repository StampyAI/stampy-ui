import {useState, useEffect} from 'react'

export default function useIsMobile() {
  const mobileWidth = 640
  const [windowWidth, setWindowWidth] = useState<number>(0)

  const isWindow = typeof window !== 'undefined'

  const getWidth = () => (isWindow ? window.innerWidth : windowWidth)

  const resize = () => setWindowWidth(getWidth())

  useEffect(() => {
    if (isWindow) {
      setWindowWidth(getWidth())

      window.addEventListener('resize', resize)

      return () => window.removeEventListener('resize', resize)
    }
    //eslint-disable-next-line
  }, [isWindow])

  return windowWidth <= mobileWidth
}
