// simplified implementation of HTTP Cache for fetch on cloudflare workers
// based on https://developer.mozilla.org/en-US/docs/Web/API/Cache
// see also https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
// used while debugging an external API with max-age: 0 responses from localhost

const supportedRequestCache: RequestCache[] = ['default', 'force-cache']

const fetchWithCache = async (url: string, init?: RequestInit): Promise<Response> => {
  if (
    (init?.method ?? 'GET') === 'GET' &&
    supportedRequestCache.includes(init?.cache ?? 'default')
  ) {
    const cached = await STAMPY_KV.get(url)
    if (cached) {
      console.log('\nCached in STAMPY_KV:', url)

      return Promise.resolve(new Response(cached))
    } else {
      console.log('\nNew request:', url)

      const response = await fetch(url, init)
      const body = response.clone().body ?? ''
      STAMPY_KV.put(url, body, {expirationTtl: 600 /* seconds */})

      return response
    }
  }

  return fetch(url, init)
}

export default fetchWithCache
