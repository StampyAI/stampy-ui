import {useState, useEffect} from 'react'

const empty = {}
export default function useRerenderOnResize(): void {
  const [, set] = useState<typeof empty>()

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const forceRerender = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        set(empty)
      }, 100)
    }
    addEventListener('orientationchange', forceRerender)
    addEventListener('resize', forceRerender)

    return () => {
      removeEventListener('orientationchange', forceRerender)
      removeEventListener('resize', forceRerender)
    }
  }, [])
}
