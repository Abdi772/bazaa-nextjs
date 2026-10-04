import type { MetadataRoute } from 'next';
import { getListings, listingSlug } from '@/lib/listings';
import { SITE_URL } from '@/lib/siteUrl';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/safety', '/terms', '/privacy', '/contact'].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    })
  );

  const listings = await getListings({ limit: 1000 });

  const items = listings.map((l) => ({
    url: `${SITE_URL}/products/${listingSlug(l)}`,
    lastModified: new Date(l.created_at),
  }));

  return [...pages, ...items];
}
