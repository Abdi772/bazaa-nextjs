 import Link from 'next/link';
import Image from 'next/image';
import { getListings, getCategoryCounts, getSubcategoryCounts, listingSlug } from '@/lib/listings';
import { CATEGORY_CONFIG, subcategoryImage } from '@/lib/categories';
import { getBrandLogo } from '@/lib/brandLogos';
import CategorySidebar from './CategorySidebar';
import FilterBar from './FilterBar';

export const revalidate = 60; // re-fetch fresh data at most once a minute

function buildUrl(category?: string, subcategory?: string, brand?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (subcategory) params.set('subcategory', subcategory);
  if (brand) params.set('brand', brand);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    all?: string;
    region?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) {
  const query = searchParams.q || '';
  const category = searchParams.category || '';
  const subcategory = searchParams.subcategory || '';
  const brand = searchParams.brand || '';
  const showAll = searchParams.all === '1';
  const region = searchParams.region || '';
  const minPrice = searchParams.minPrice || '';
  const maxPrice = searchParams.maxPrice || '';

  const categoryConfig = category ? CATEGORY_CONFIG[category] : undefined;
  const subNames = categoryConfig ? Object.keys(categoryConfig.subcategories) : [];
  const brandNames =
    categoryConfig && subcategory ? categoryConfig.subcategories[subcategory] || [] : [];

  // Step 1: home (category grid)
  const showHome = !query && !category && !subcategory && !brand;
  // Step 2: a category is chosen -> show its sub-categories first, no listings yet
  const showSubList =
    !query && !!category && !subcategory && !brand && !showAll && subNames.length > 0;
  // Step 3: sub-category chosen -> brand tiles + listings
  const showBrandTiles = !query && !!subcategory && !brand && brandNames.length > 0;
  // Listings are shown on home and from step 3 onwards
  const showListings = !showSubList;

  const [listings, counts, subCounts] = await Promise.all([
    showListings
      ? getListings({
          query,
          category,
          subcategory,
          brand,
          region,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          limit: 24,
        })
      : Promise.resolve([]),
    showHome ? getCategoryCounts() : Promise.resolve({} as Record<string, number>),
    showSubList ? getSubcategoryCounts(category) : Promise.resolve({} as Record<string, number>),
  ]);

  // Back link goes up one level
  let backHref = '/';
  let backLabel = 'Back to all categories';
  if (brand) {
    backHref = buildUrl(category, subcategory);
    backLabel = `Back to ${subcategory}`;
  } else if (subcategory) {
    backHref = buildUrl(category);
    backLabel = `Back to ${category}`;
  } else if (showAll) {
    backHref = buildUrl(category);
    backLabel = `Back to ${category}`;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar is for big screens only; on phones we drill down page by page */}
      <div className="hidden md:block">
        <CategorySidebar currentCategory={category} currentSubcategory={subcategory} currentBrand={brand} />
      </div>

      <div className="flex-1 min-w-0">
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
              {Object.entries(CATEGORY_CONFIG).map(([name]) => (
                <Link
                  key={name}
                  href={buildUrl(name)}
                  className="bg-white border border-line rounded-lg overflow-hidden text-center hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square bg-[#E8EEF5]">
                    <Image
                      src={`/categories/${name.toLowerCase()}.jpg`}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                      className="object-cover mix-blend-multiply"
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-xs text-muted">{counts[name] || 0} listings</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Page heading + back link */}
        <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="font-serif text-xl font-bold">
              {brand || subcategory || category || (query ? `Results for "${query}"` : 'All listings')}
            </div>
            {showListings && (
              <div className="text-sm text-muted">
                {listings.length} listing{listings.length === 1 ? '' : 's'} found
              </div>
            )}
          </div>
          {!showHome && (
            <Link href={backHref} className="text-amber text-sm font-semibold underline">
              {backLabel}
            </Link>
          )}
        </div>

        {/* Step 2: sub-category list (with pictures) */}
        {showSubList && categoryConfig && (
          <div className="bg-white border border-line rounded-lg divide-y divide-line mb-6">
            {subNames.map((subName) => {
              const img = subcategoryImage(subName);
              return (
                <Link
                  key={subName}
                  href={buildUrl(category, subName)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-amber/10"
                >
                  <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-[#E8EEF5]">
                    {img && (
                      <Image
                        src={img}
                        alt={subName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="flex-1 min-w-0">
                    <span className="block text-base font-semibold">{subName}</span>
                    <span className="block text-xs text-muted">
                      {subCounts[subName] || 0} {(subCounts[subName] || 0) === 1 ? 'ad' : 'ads'}
                    </span>
                  </span>
                  <span className="text-muted">›</span>
                </Link>
              );
            })}
            <Link
              href={`${buildUrl(category)}&all=1`}
              className="flex items-center justify-between px-4 py-4 hover:bg-amber/10"
            >
              <span className="text-base font-semibold text-amberDeep">See all in {category}</span>
              <span className="text-muted">›</span>
            </Link>
          </div>
        )}

        {/* Step 3: brand tiles */}
        {showBrandTiles && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
            {brandNames.map((b) => {
              const logo = getBrandLogo(b);
              return (
                <Link
                  key={b}
                  href={buildUrl(category, subcategory, b)}
                  className="bg-white border border-line rounded-lg p-3 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                >
                  <div className="h-8 flex items-center justify-center">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt="" className="max-h-8 max-w-[56px] object-contain" />
                    ) : (
                      <span className="text-xl">•••</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-center">{b}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Filters */}
        {showListings && (
          <FilterBar
            region={region}
            minPrice={minPrice}
            maxPrice={maxPrice}
            brand={brand}
            availableBrands={brandNames}
          />
        )}

        {/* Listings */}
        {showListings &&
          (listings.length === 0 ? (
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
                  <div className="aspect-[4/3] bg-[#E8EEF5] flex items-center justify-center relative border-b border-line">
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
          ))}
      </div>
    </div>
  );
            }
