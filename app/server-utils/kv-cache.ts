import type {DataFunctionArgs} from '@remix-run/cloudflare'
type RequestForReload = DataFunctionArgs['request'] | 'NEVER_RELOAD'
export function withCache<Fn extends (...args: string[]) => Promise<any>>(
  defaultKey: string,
  fn: Fn
): (
  // pass the real Request object when possible, 'NEVER_RELOAD' is an escape hatch for nested withCache(),
  // it's used for detection of `?reload` in url, to invalidate cache in a background request
  request: RequestForReload,
  ...args: Parameters<Fn>
) => Promise<{data: Awaited<ReturnType<Fn>>; timestamp: string}> {
  return async (request: RequestForReload, ...args: Parameters<Fn>) => {
    const key = args[0] ?? defaultKey

    const shouldReload = request === 'NEVER_RELOAD' ? false : request.url.match(/[?&]reload/)
    if (!shouldReload) {
      const cached = await STAMPY_KV.get(key)

      if (cached) {
        const data = JSON.parse(cached)
        const dataWithTimestamp = 'timestamp' in data ? data : {timestamp: '1970', data}

        return dataWithTimestamp
      }
    }

    console.debug(`Fetching data for: ${key}`)
    const data = await fn(...args)
    const dataWithTimestamp = {timestamp: new Date(), data}

    if (data) await STAMPY_KV.put(key, JSON.stringify(dataWithTimestamp))

    return dataWithTimestamp
  }
}

export async function reloadInBackgroundIfNeeded(url: string, timestamp: string) {
  const ageInMilliseconds = new Date().getTime() - new Date(timestamp).getTime()
  // TODO: #228 keep debug for a few day after fixing cache invalidation, can be deleted later
  console.debug('Reload needed', ageInMilliseconds > 10 * 60 * 1000, url || '/', timestamp)
  if (ageInMilliseconds > 10 * 60 * 1000) {
    const text = await (await fetch(`${url}${url.includes('?') ? '&' : '?'}reload`)).text()
    try {
      const json = JSON.parse(text)
      return json
    } catch (e) {
      return text
    }
  }
}

const byNoNumberOnTop = (a: string, b: string) => {
  const aNoNumber = !a.match(/\d/)
  const bNoNumber = !b.match(/\d/)
  if (aNoNumber === bNoNumber) return 0
  return aNoNumber ? -1 : 1
}
export async function loadCacheKeys() {
  const keys = (await STAMPY_KV.list()).keys.map(({name}) => name).sort(byNoNumberOnTop)
  return keys
}

export async function loadCacheValue(key: string) {
  const value = await STAMPY_KV.get(key)
  return value
}

export async function cleanCache(keys?: string[] | string) {
  if (!keys) {
    keys = (await STAMPY_KV.list()).keys.map(({name}) => name)
  } else if (typeof keys === 'string') {
    keys = [keys]
  }
  for (const key of keys) {
    await STAMPY_KV.delete(key)
  }

  return null
}
