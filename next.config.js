  const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'okxmpkrokqihhfdwtnmx.supabase.co';

const nextConfig = {
  // Lets Next.js 14 load instrumentation.ts (needed for Sentry on the server).
  experimental: {
    instrumentationHook: true,
  },
  images: {
    // Vercel resizes and compresses listing photos for each screen size.
    // Photos from other hosts are shown as-is by app/ListingImage.tsx.
    // Listing photo file names are unique, so they can be cached for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'okxmpkrokqihhfdwtnmx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

// Sentry error monitoring. Does nothing until NEXT_PUBLIC_SENTRY_DSN is set.
module.exports = withSentryConfig(nextConfig, {
  silent: true,
  telemetry: false,
  disableLogger: true,
  // No source map upload (that needs an auth token). Errors still arrive,
  // with minified stack traces.
  sourcemaps: { disable: true },
});
