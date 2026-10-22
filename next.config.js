 /** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : 'okxmpkrokqihhfdwtnmx.supabase.co';

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Listing photos never change once uploaded, so cache them for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
