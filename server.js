import url from 'url'
import {createEventHandler, handleAsset} from '@remix-run/cloudflare-workers'
import * as build from '@remix-run/dev/server-build'

const CORS_ASSETS = ['/tfWorker.js']

const isCorsEnabledAsset = (event) => {
  const parsedUrl = url.parse(event.request.url)
  const pathname = parsedUrl.pathname

  return CORS_ASSETS.includes(pathname)
}

const fetchCorsAsset = (event) => {
  const resp = handleAsset(event, build)
  return event.respondWith(
    resp.then((res) => {
      const headers = new Headers(res.headers)
      headers.set('Access-Control-Allow-Origin', ALLOW_ORIGINS || '')
      headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
      return new Response(res.body, {headers})
    })
  )
}

const handler = createEventHandler({build, mode: process.env.NODE_ENV})
addEventListener('fetch', async (event) =>
  isCorsEnabledAsset(event) ? fetchCorsAsset(event) : handler(event)
)
