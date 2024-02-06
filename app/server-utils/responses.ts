import {LoaderFunctionArgs, json} from '@remix-run/cloudflare'

export const jsonCORS = <T>(data: T) =>
  json(data, {
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Origin': ALLOW_ORIGINS,
    },
  })

const allowedOrigins = (request: Request) => {
  const origin = request.headers.get('origin') || ''
  const allowedOrigins = ALLOW_ORIGINS.split(',')

  // always allow localhost
  try {
    if (['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) {
      return origin
    }
  } catch (e) {
    // ignore errors
  }

  return ALLOW_ORIGINS == '*' || allowedOrigins.includes(origin) ? origin : ''
}

export const CORSOptions = (request: Request) => {
  return json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': allowedOrigins(request),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, allow-control-allow-origin',
      },
    }
  )
}

type Handler = (args: LoaderFunctionArgs) => any
export const wrapCORS = (fn: Handler) => async (args: LoaderFunctionArgs) => {
  if (args.request.method == 'OPTIONS') {
    return CORSOptions(args.request)
  }
  const data = await fn(args)
  return jsonCORS<typeof data>(data)
}
