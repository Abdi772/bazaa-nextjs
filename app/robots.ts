import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/messages',
        '/profile',
        '/settings',
        '/post',
        '/edit',
        '/my-listings',
        '/saved',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
