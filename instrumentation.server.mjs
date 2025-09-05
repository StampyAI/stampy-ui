import * as Sentry from "@sentry/cloudflare";

// Server-side Sentry initialization for Cloudflare Workers
// Uses global environment variables from wrangler.toml [vars] section
Sentry.init({
    dsn: SENTRY_DSN,
    environment: typeof process !== 'undefined' && process.env.NODE_ENV === 'production' ? 'production' : 'development',
    tracesSampleRate: typeof process !== 'undefined' && process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Note: enableLogs is not supported in @sentry/cloudflare
})