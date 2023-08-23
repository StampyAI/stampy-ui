import {LoaderArgs, json} from '@remix-run/cloudflare'

export const jsonCORS = <T>(data: T) =>
  json(data, {
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Origin': ALLOW_ORIGINS,
    },
  })

export const CORSOptions = (request: Request) => {
  const origin = request.headers.get('origin') || ''
  const isOriginAllowed = ALLOW_ORIGINS == '*' || ALLOW_ORIGINS.split(',').includes(origin)
  const allowed = isOriginAllowed ? origin : ''

  return json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': allowed,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, allow-control-allow-origin',
      },
    }
  )
}

type Handler = (args: LoaderArgs) => any
export const wrapCORS = (fn: Handler) => async (args: LoaderArgs) => {
  if (args.request.method == 'OPTIONS') {
    return CORSOptions(args.request)
  }
  const data = await fn(args)
  return jsonCORS<typeof data>(data)
}
