import {getAssetFromKV} from '@cloudflare/kv-asset-handler'
import type {AppLoadContext} from '@remix-run/cloudflare'
import {createRequestHandler, logDevReady} from '@remix-run/cloudflare'
import * as Sentry from '@sentry/remix'
import * as build from '@remix-run/dev/server-build'
// @ts-expect-error TODO
import __STATIC_CONTENT_MANIFEST from '__STATIC_CONTENT_MANIFEST'

const MANIFEST = JSON.parse(__STATIC_CONTENT_MANIFEST)
const handleRemixRequest = createRequestHandler(build, process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
  logDevReady(build)
}

export default {
  async fetch(
    request: Request,
    env: {
      __STATIC_CONTENT: Fetcher
      SENTRY_DSN?: string
    },
    ctx: ExecutionContext
  ): Promise<Response> {
    // Initialize Sentry with DSN from environment
    if (env.SENTRY_DSN && !(global as any).__sentryInitialized) {
      ;(global as any).SENTRY_DSN = env.SENTRY_DSN
      await import('~/sentry.server.config')
      ;(global as any).__sentryInitialized = true
    }

    try {
      const url = new URL(request.url)
      const ttl = url.pathname.startsWith('/build/')
        ? 60 * 60 * 24 * 365 // 1 year
        : 60 * 5 // 5 minutes

      for (const [k, v] of Object.entries(env)) {
        // @ts-expect-error new wrangler doesn't load global variables any more => let's do it manually
        global[k] = v
      }

      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        } as FetchEvent,
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: MANIFEST,
          cacheControl: {
            browserTTL: ttl,
            edgeTTL: ttl,
          },
        }
      )
    } catch (error) {
      // ignore errors about API routes like:
      // NotFoundError [KVError]: could not find questions/glossary/index.html in your content namespace
    }

    try {
      const loadContext: AppLoadContext = {
        env,
      }
      return await handleRemixRequest(request, loadContext)
    } catch (error) {
      console.log(error)
      // Capture error with Sentry
      if ((global as any).__sentryInitialized) {
        Sentry.captureException(error)
      }
      return new Response('An unexpected error occurred', {status: 500})
    }
  },
}
