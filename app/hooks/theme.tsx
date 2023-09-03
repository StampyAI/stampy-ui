import {useCallback, useEffect, useState} from 'react'
import {useSearchParams} from '@remix-run/react'

const THEME = 'theme'
const supported = new Set(['dark', 'light', undefined])
const isSupported = (theme: string | null | undefined): theme is string | undefined =>
  theme !== null && supported.has(theme)

export const useTheme = () => {
  const [searchParams] = useSearchParams() // url parameter for iframe usage: ...?embed&theme=dark
  const [savedTheme, setSavedTheme] = useState(() => {
    const fromParams = searchParams.get(THEME)
    if (isSupported(fromParams)) return fromParams

    if (typeof window === 'undefined') return
    const fromStorage = window.localStorage.getItem(THEME)
    if (isSupported(fromStorage)) return fromStorage
  })

  // remember UI theme toggle state in localStorage
  const setStorageTheme = useCallback((theme: string | undefined) => {
    if (isSupported(theme)) {
      if (!theme) {
        window.localStorage.removeItem(THEME)
      } else {
        window.localStorage.setItem(THEME, theme)
      }
      setSavedTheme(theme)
    }
  }, [])

  // if no preference is saved, use the system preferences
  useEffect(() => {
    if (savedTheme) return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const updateHtmlClass = () => {
      const classList = document.documentElement.classList
      if (media.matches) {
        classList.remove('light')
        classList.add('dark')
      } else {
        classList.remove('dark')
        classList.add('light')
      }
    }
    media.addEventListener('change', updateHtmlClass)
    updateHtmlClass()

    return () => media.removeEventListener('change', updateHtmlClass)
  }, [savedTheme])

  return {savedTheme, setStorageTheme}
}
