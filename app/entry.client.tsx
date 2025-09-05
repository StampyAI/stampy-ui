import {init, replayIntegration, browserTracingIntegration} from '@sentry/remix'
import {RemixBrowser, useLocation, useMatches} from '@remix-run/react'
import {startTransition, StrictMode, useEffect} from 'react'
import {hydrateRoot} from 'react-dom/client'

// Get Sentry DSN from window object (set by server-side script)
const sentryDsn = (window as any).__SENTRY_DSN__
const nodeEnv = typeof process !== 'undefined' ? process.env.NODE_ENV : 'development'

if (sentryDsn) {
  init({
    dsn: sentryDsn,
    environment: nodeEnv,
    tracesSampleRate: nodeEnv === 'production' ? 0.1 : 1.0,

    integrations: [
      browserTracingIntegration({
        useEffect,
        useLocation,
        useMatches,
      }),
      replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    replaysSessionSampleRate: nodeEnv === 'production' ? 0.01 : 0.0,
    replaysOnErrorSampleRate: nodeEnv === 'production' ? 0.3 : 0.0,
  })
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  )
})
