import {json} from '@remix-run/cloudflare'

export const jsonCORS = <T>(data: T) =>
  json(data, {
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Origin': ALLOW_ORIGINS,
    },
  })
