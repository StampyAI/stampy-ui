import * as Sentry from '@sentry/cloudflare'
import type {AppLoadContext, EntryContext} from '@remix-run/cloudflare'
import {RemixServer} from '@remix-run/react'
import {isbot} from 'isbot'
import {renderToReadableStream} from 'react-dom/server'

// this file is inlined from https://github.com/remix-run/remix/blob/release-v2/packages/remix-dev/config/defaults/entry.server.cloudflare.tsx
// so we can add sentry to it

export const handleError = (error: unknown, {request: _request}: {request: Request}) => {
  Sentry.captureException(error)
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext
) {
  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      // If you wish to abort the rendering process, you can pass a signal here.
      // Please refer to the templates for example son how to configure this.
      // signal: controller.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error)
        responseStatusCode = 500
      },
    }
  )

  if (isBotRequest(request.headers.get('user-agent'))) {
    await body.allReady
  }

  responseHeaders.set('Content-Type', 'text/html')
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}

function isBotRequest(userAgent: string | null) {
  if (!userAgent) {
    return false
  }
  return isbot(userAgent)
}
