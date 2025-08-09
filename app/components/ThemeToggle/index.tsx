import {useTheme} from '~/hooks/theme'
import {useState, useEffect} from 'react'
import './themeToggle.css'

export const ThemeToggle = () => {
  const {savedTheme, setStorageTheme} = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only run client-side code after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine current theme (saved theme or system preference)
  const currentTheme =
    savedTheme ||
    (mounted && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  const isDark = currentTheme === 'dark'

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setStorageTheme(newTheme)
  }

  // Don't render until mounted to avoid SSR mismatch
  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Theme toggle" title="Theme toggle">
        <span className="theme-toggle-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path
              d="M12 1v2M12 21v2M23 12h-2M3 12H1M20.5 3.5L19 5M5 19l-1.5 1.5M20.5 20.5L19 19M5 5L3.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
    )
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-icon">
        {isDark ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path
              d="M12 1v2M12 21v2M23 12h-2M3 12H1M20.5 3.5L19 5M5 19l-1.5 1.5M20.5 20.5L19 19M5 5L3.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" fill="currentColor" />
          </svg>
        )}
      </span>
    </button>
  )
}
