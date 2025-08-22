import * as Sentry from '@sentry/remix'

const environment = (typeof process !== 'undefined' && process.env?.NODE_ENV) || 'development'

Sentry.init({
  dsn: (window as any).SENTRY_DSN,
  environment,

  // Performance Monitoring
  tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Filter out certain errors
  beforeSend(event, hint) {
    // Filter out non-error events in development
    if (environment === 'development' && !hint.originalException) {
      return null
    }

    // Filter out certain known errors that aren't actionable
    const error = hint.originalException
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message)

      // Filter out network errors that are likely user connection issues
      if (message.includes('NetworkError') || message.includes('Failed to fetch')) {
        return null
      }

      // Filter out errors from browser extensions
      if (message.includes('Extension context')) {
        return null
      }
    }

    return event
  },
})
