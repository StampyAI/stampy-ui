import {useState, useEffect, useRef, useCallback} from 'react'
import {useNavigate, useLocation} from '@remix-run/react'
import {ChatSettings} from './useChat'

const parseHash = (hash: string): {[key: string]: any} => {
  if (!hash || hash === '#') return {}
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash
  const params = new URLSearchParams(cleanHash)
  const result: {[key: string]: any} = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

const serializeToHash = (obj: {[key: string]: any}): string => {
  const params = new URLSearchParams()
  Object.entries(obj).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      params.set(key, String(val))
    }
  })
  const str = params.toString()
  return str ? '#' + str : ''
}

const updateIn = (obj: {[key: string]: any}, [head, ...rest]: string[], val: any) => {
  if (!head) {
    // noop
  } else if (!rest || rest.length == 0) {
    obj[head] = val
  } else {
    if (obj[head] === undefined || typeof obj[head] !== 'object' || obj[head] === null) {
      obj[head] = {}
    }
    updateIn(obj[head], rest, val)
  }
  return obj
}

export function useUrlSettings(onLoad: (data: any) => void) {
  const [urlLoaded, setUrlLoaded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const debouncingEnabled = useRef(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdates = useRef<{[key: string]: any}>({})
  const lastChangeTime = useRef<number>(Date.now())

  useEffect(() => {
    if (urlLoaded) return

    const hashData = parseHash(location.hash)
    onLoad(hashData)
    debouncingEnabled.current = true
    setUrlLoaded(true)
  }, [location, urlLoaded, onLoad])

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
      pendingUpdates.current = {}
    }
  }, [])

  const updateInUrl = useCallback(
    (vals: {[key: string]: any}) => {
      const currentHashData = parseHash(location.hash)

      if (!debouncingEnabled.current) {
        const newHashData = {...currentHashData, ...vals}
        const newHash = serializeToHash(newHashData)
        navigate(location.pathname + newHash, {replace: true})
        return
      }

      pendingUpdates.current = {...pendingUpdates.current, ...vals}
      const now = Date.now()
      const timeSinceLastChange = now - lastChangeTime.current

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
        debounceTimeout.current = null
      }

      if (timeSinceLastChange > 2500) {
        lastChangeTime.current = now
        const updatesToApply = {...pendingUpdates.current}
        pendingUpdates.current = {}

        const newHashData = {...currentHashData, ...updatesToApply}
        const newHash = serializeToHash(newHashData)

        navigate(location.pathname + newHash, {replace: true})
      } else {
        lastChangeTime.current = now

        debounceTimeout.current = setTimeout(() => {
          const updatesToApply = {...pendingUpdates.current}
          pendingUpdates.current = {}
          debounceTimeout.current = null
          lastChangeTime.current = 0

          const currentHashData = parseHash(location.hash)
          const newHashData = {...currentHashData, ...updatesToApply}
          const newHash = serializeToHash(newHashData)

          navigate(location.pathname + newHash, {replace: true})
        }, 5000)
      }
    },
    [location, navigate]
  )

  return updateInUrl
}

export function usePlaygroundSettings(defaultSettings: ChatSettings) {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings)

  const updateInUrl = useUrlSettings((hashData: any) => {
    const updates: Partial<ChatSettings> = {}

    Object.entries(hashData).forEach(([key, value]) => {
      const path = key.split('.')
      updateIn(updates as any, path, value)
    })

    setSettings((s) => ({...s, ...updates}))
  })

  const changeSetting = (path: string[], value: any) => {
    updateInUrl({[path.join('.')]: value})
    setSettings((s) => ({...updateIn(s, path, value)}))
  }

  const changeSettings = (...items: [string[], any][]) => {
    const urlUpdates = items.reduce((acc, [path, val]) => ({...acc, [path.join('.')]: val}), {})
    updateInUrl(urlUpdates)
    setSettings((s) => items.reduce((acc, [path, val]) => ({...acc, ...updateIn(s, path, val)}), s))
  }

  return {settings, changeSetting, changeSettings, setSettings}
}
