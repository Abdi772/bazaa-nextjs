 /** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'okxmpkrokqihhfdwtnmx.supabase.co';

const nextConfig = {
  images: {
    // Show every picture straight from its source. Listing photos are already
    // compressed when they are uploaded, so this avoids broken thumbnails.
    unoptimized: true,
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

module.exports = nextConfig;
