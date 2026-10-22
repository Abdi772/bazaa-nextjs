import * as Sentry from '@sentry/nextjs';

// Server errors (pages, API routes, Telegram webhook).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  sendDefaultPii: false,
});
