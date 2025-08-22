import * as Sentry from '@sentry/remix'

const environment = (typeof process !== 'undefined' && process.env?.NODE_ENV) || 'development'

Sentry.init({
  dsn: (global as any).SENTRY_DSN,
  environment,

  // Performance Monitoring
  tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

  // Capture unhandled promise rejections
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ['error'],
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

      // Filter out KV errors that are expected (like missing cache entries)
      if (message.includes('KVError') || message.includes('could not find')) {
        return null
      }
    }

    return event
  },
})
