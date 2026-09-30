import Link from 'next/link';
import Image from 'next/image';
import { getListings, getCategoryCounts, listingSlug } from '@/lib/listings';
import { CATEGORY_CONFIG } from '@/lib/categories';

export const revalidate = 60; // re-fetch fresh data at most once a minute

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = searchParams.q || '';
  const category = searchParams.category || '';

  const [listings, counts] = await Promise.all([
    getListings({ query, category, limit: 24 }),
    getCategoryCounts(),
  ]);

  const showHome = !query && !category;

  return (
    <div>
      {showHome && (
        <>
          <div className="bg-gradient-to-br from-ink via-[#2A2850] to-amberDeep rounded-xl p-8 text-paper mb-6">
            <h1 className="text-2xl font-serif font-bold mb-1">
              Buy and sell anything, right in your area
            </h1>
            <p className="text-sm text-paper/85 mb-4">
              Find what you need nearby, or list something in minutes.
            </p>
            <form action="/" className="flex flex-wrap gap-2">
              <input
                name="q"
                type="text"
                placeholder="What are you looking for?"
                className="flex-1 min-w-[140px] rounded px-3 py-2.5 text-sm text-ink"
              />
              <button
                type="submit"
                className="bg-amber hover:bg-amberDeep text-ink font-bold px-5 py-2.5 rounded text-sm"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mb-2 font-serif text-xl font-bold">Popular categories</div>
          <div className="text-sm text-muted mb-4">Browse by what you&apos;re looking for</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
            {Object.entries(CATEGORY_CONFIG).map(([name, config]) => (
              <Link
                key={name}
                href={`/?category=${encodeURIComponent(name)}`}
                className="bg-white border border-line rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-2">{config.icon}</div>
                <div className="text-sm font-semibold">{name}</div>
                <div className="text-xs text-muted">{counts[name] || 0} listings</div>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="font-serif text-xl font-bold">
            {category || (query ? `Results for "${query}"` : 'All listings')}
          </div>
          <div className="text-sm text-muted">
            {listings.length} listing{listings.length === 1 ? '' : 's'} found
          </div>
        </div>
        {!showHome && (
          <Link href="/" className="text-amber text-sm font-semibold underline">
            Back to all categories
          </Link>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <h3 className="text-ink font-semibold mb-2">No listings match</h3>
          <p>Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/products/${listingSlug(listing)}`}
              className="bg-white border border-line rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-[#EDE7D9] flex items-center justify-center relative">
                {listing.image_url ? (
                  <Image
                    src={listing.image_url}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl">{CATEGORY_CONFIG[listing.category]?.icon || '📦'}</span>
                )}
              </div>
              <div className="p-3">
                <div className="font-serif font-bold text-amberDeep">
                  ETB {Number(listing.price).toLocaleString()}
                </div>
                <div className="text-sm font-semibold mt-1 line-clamp-1">{listing.title}</div>
                <div className="text-xs text-muted flex justify-between mt-1">
                  <span>{listing.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
