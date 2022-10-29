import type {DataFunctionArgs} from '@remix-run/cloudflare'

const RELOAD = '?reload'

export function withCache<Fn extends (...args: string[]) => Promise<any>>(
  defaultKey: string,
  fn: Fn
): (request: DataFunctionArgs['request'], ...args: Parameters<Fn>) => ReturnType<Fn> {
  return (async (request: DataFunctionArgs['request'], ...args: Parameters<Fn>) => {
    const key = args[0] ?? defaultKey

    const shouldReload = request.url.includes(RELOAD)
    if (!shouldReload) {
      const {value: cached, metadata} = await STAMPY_KV.getWithMetadata<{timestamp: string}>(key)

      if (cached) {
        const ageInMilliseconds =
          new Date().getTime() -
          new Date(metadata?.timestamp ?? '1999-01-01T00:00:00.000Z').getTime()
        const isLongAge = ageInMilliseconds > 10 * 60 * 1000 // 10 minutes
        console.debug(
          `Cached data for: ${key} since ${metadata?.timestamp} ${
            isLongAge ? '(will reload)' : '(still fresh)'
          }`
        )
        if (isLongAge) {
          // fire and forget a new request in the background
          const reloadUrl = `${request.url.replace(/\?.*$/, '')}${RELOAD}`
          fetch(reloadUrl)
        }

        return JSON.parse(cached)
      }
    }

    console.debug(`Fetching data for: ${key}`)
    const data = await fn(...args)
    await STAMPY_KV.put(key, JSON.stringify(data), {metadata: {timestamp: new Date()}})

    return data
  }) as any
}

export async function loadCache() {
  const all = await STAMPY_KV.list()
  return all
}
