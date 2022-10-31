import type {DataFunctionArgs} from '@remix-run/cloudflare'

const RELOAD = '?reload'

export function withCache<Fn extends (...args: string[]) => Promise<any>>(
  defaultKey: string,
  fn: Fn
): (
  request: DataFunctionArgs['request'],
  ...args: Parameters<Fn>
) => Promise<{data: Awaited<ReturnType<Fn>>; timestamp: string}> {
  return (async (request: DataFunctionArgs['request'], ...args: Parameters<Fn>) => {
    const key = args[0] ?? defaultKey

    const shouldReload = request.url.includes(RELOAD)
    if (!shouldReload) {
      const cached = await STAMPY_KV.get(key)

      if (cached) {
        const data = JSON.parse(cached)
        const dataWithTimestamp = 'timestamp' in data ? data : {data, timestamp: '1970'}

        return dataWithTimestamp
      }
    }

    console.debug(`Fetching data for: ${key}`)
    const data = await fn(...args)
    const dataWithTimestamp = {data, timestamp: new Date()}

    await STAMPY_KV.put(key, JSON.stringify(dataWithTimestamp))

    return dataWithTimestamp
  }) as any
}

export async function reloadInBackgroundIfNeeded(url: string, timestamp: string) {
  const ageInMilliseconds = new Date().getTime() - new Date(timestamp).getTime()
  if (ageInMilliseconds > 10 * 60 * 1000) {
    fetch(`${url.replace(/\?.*$/, '')}${RELOAD}`)
  }
}

export async function loadCache() {
  const {keys} = await STAMPY_KV.list()
  const all = []
  for (const {name, metadata} of keys) {
    const value = await STAMPY_KV.get(name)
    if (!value) continue // KV list can be outdated few seconds after cleaning cache
    all.push({name, metadata, value})
  }

  return all
}

export async function cleanCache() {
  const {keys} = await STAMPY_KV.list()
  for (const {name} of keys) {
    await STAMPY_KV.delete(name)
  }

  return null
}
