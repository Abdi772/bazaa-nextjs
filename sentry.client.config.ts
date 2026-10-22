 import * as Sentry from '@sentry/nextjs';

// Browser errors. Only runs if NEXT_PUBLIC_SENTRY_DSN is set.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Errors only. No performance tracing and no session replay, which keeps
  // the free plan quota and the page size small.
  tracesSampleRate: 0,
  sendDefaultPii: false,
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications.',
  ],
});
