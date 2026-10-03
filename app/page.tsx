 import Link from 'next/link';
import Image from 'next/image';

import {
  getListings,
  getCategoryCounts,
  getSubcategoryCounts,
  getBrandCounts,
  listingSlug,
} from '@/lib/listings';

import {
  CATEGORY_CONFIG,
  subcategoryImage,
} from '@/lib/categories';

import { getBrandLogo } from '@/lib/brandLogos';

import CategorySidebar from './CategorySidebar';
import FilterBar from './FilterBar';
import LanguageText from './LanguageText';
import SearchInput from './SearchInput';

export const revalidate = 60;

function buildUrl(
  category?: string,
  subcategory?: string,
  brand?: string,
) {
  const params = new URLSearchParams();

  if (category) {
    params.set('category', category);
  }

  if (subcategory) {
    params.set('subcategory', subcategory);
  }

  if (brand) {
    params.set('brand', brand);
  }

  const qs = params.toString();

  return qs ? `/?${qs}` : '/';
}

function categoryTranslationKey(
  category: string,
): string {
  switch (category) {
    case 'Electronics':
      return 'electronicsCategory';

    case 'Vehicles':
      return 'vehiclesCategory';

    case 'Furniture':
      return 'furnitureCategory';

    case 'Fashion':
      return 'fashionCategory';

    case 'Property':
      return 'propertyCategory';

    case 'Other':
      return 'otherCategory';

    default:
      return category;
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    model?: string;
    condition?: string;
    budget?: string;
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

  const model = searchParams.model || '';
  const condition = searchParams.condition || '';
  const budget = searchParams.budget || '';

  const showAll = searchParams.all === '1';

  const region = searchParams.region || '';
  const minPrice = searchParams.minPrice || '';
  const maxPrice = searchParams.maxPrice || '';

  const categoryConfig = category
    ? CATEGORY_CONFIG[category]
    : undefined;

  const subNames = categoryConfig
    ? Object.keys(categoryConfig.subcategories)
    : [];

  const brandNames =
    categoryConfig && subcategory
      ? categoryConfig.subcategories[subcategory] || []
      : [];

  const showHome =
    !query &&
    !category &&
    !subcategory &&
    !brand;

  const showSubList =
    !query &&
    !!category &&
    !subcategory &&
    !brand &&
    !showAll &&
    subNames.length > 0;

  const showBrandTiles =
    !query &&
    !!subcategory &&
    !brand &&
    brandNames.length > 0;

  const showListings = !showSubList;

  const [
    rawListings,
    counts,
    subCounts,
    brandCounts,
  ] = await Promise.all([
    showListings
      ? getListings({
          query,
          category,
          subcategory,
          brand,
          region,
          minPrice: minPrice
            ? Number(minPrice)
            : undefined,
          maxPrice: maxPrice
            ? Number(maxPrice)
            : undefined,
          limit: 24,
        })
      : Promise.resolve([]),

    showHome
      ? getCategoryCounts()
      : Promise.resolve(
          {} as Record<string, number>,
        ),

    category
      ? getSubcategoryCounts(category)
      : Promise.resolve(
          {} as Record<string, number>,
        ),

    showListings &&
    category &&
    subcategory
      ? getBrandCounts(
          category,
          subcategory,
        )
      : Promise.resolve(
          {} as Record<string, number>,
        ),
  ]);

  let listings = rawListings;

  if (model) {
    listings = listings.filter((listing) => {
      const listingModel = String(
        (
          listing as {
            model?: string | null;
          }
        ).model || '',
      )
        .trim()
        .toLowerCase();

      return (
        listingModel ===
        model.trim().toLowerCase()
      );
    });
  }

  if (condition) {
    listings = listings.filter((listing) => {
      const listingCondition = String(
        (
          listing as {
            condition?: string | null;
          }
        ).condition || '',
      )
        .trim()
        .toLowerCase();

      return (
        listingCondition ===
        condition.trim().toLowerCase()
      );
    });
  }

  if (budget) {
    listings = listings.filter((listing) => {
      const price = Number(listing.price);

      if (!Number.isFinite(price)) {
        return false;
      }

      switch (budget) {
        case 'Under ETB 10,000':
          return price < 10000;

        case 'ETB 10,000 – 25,000':
          return (
            price >= 10000 &&
            price <= 25000
          );

        case 'ETB 25,000 – 50,000':
          return (
            price >= 25000 &&
            price <= 50000
          );

        case 'ETB 50,000 – 100,000':
          return (
            price >= 50000 &&
            price <= 100000
          );

        case 'Over ETB 100,000':
          return price > 100000;

        default:
          return true;
      }
    });
  }

  const typeOptions =
    categoryConfig && subNames.length > 1
      ? subNames.map((name) => ({
          name,
          count: subCounts[name] || 0,
        }))
      : [];

  const brandOptions = brandNames.map(
    (name) => ({
      name,
      count: brandCounts[name] || 0,
    }),
  );

  let backHref = '/';

  if (brand) {
    backHref = buildUrl(
      category,
      subcategory,
    );
  } else if (subcategory) {
    backHref = buildUrl(category);
  } else if (showAll) {
    backHref = buildUrl(category);
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="hidden md:block">
        <CategorySidebar
          currentCategory={category}
          currentSubcategory={subcategory}
          currentBrand={brand}
        />
      </div>

      <div className="min-w-0 flex-1">
        {showHome && (
          <>
            <section className="mb-8 overflow-hidden rounded-card bg-ink px-6 py-8 text-paper shadow-soft sm:px-8 sm:py-10">
              <div className="max-w-2xl">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                  Bazaa Marketplace
                </div>

                <h1 className="mb-3 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  <LanguageText k="buyAndSell" />
                </h1>

                <p className="mb-6 max-w-xl text-sm leading-6 text-paper/75 sm:text-base">
                  <LanguageText k="findWhatYouNeed" />
                </p>

                <form
                  action="/"
                  method="get"
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <SearchInput />

                  <button
                    type="submit"
                    className="bazaa-primary min-h-[46px] px-6"
                  >
                    <LanguageText k="search" />
                  </button>
                </form>
              </div>
            </section>

            <div className="mb-4">
              <h2 className="bazaa-title text-2xl">
                <LanguageText k="popularCategories" />
              </h2>

              <p className="bazaa-muted mt-1">
                <LanguageText k="browseBy" />
              </p>
            </div>

            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {Object.entries(
                CATEGORY_CONFIG,
              ).map(([name]) => (
                <Link
                  key={name}
                  href={buildUrl(name)}
                  className="group overflow-hidden rounded-card border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="relative aspect-square overflow-hidden bg-paper">
                    <Image
                      src={`/categories/${name.toLowerCase()}.jpg`}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3">
                    <div className="text-sm font-semibold text-ink">
                      <LanguageText
                        k={categoryTranslationKey(
                          name,
                        )}
                      />
                    </div>

                    <div className="mt-0.5 text-xs text-muted">
                      {counts[name] || 0}{' '}
                      <LanguageText k="listings" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="bazaa-title text-2xl">
              {model ||
                brand ||
                subcategory ||
                (category ? (
                  <LanguageText
                    k={categoryTranslationKey(
                      category,
                    )}
                  />
                ) : query ? (
                  <>
                    <LanguageText k="resultsFor" />{' '}
                    "{query}"
                  </>
                ) : (
                  <LanguageText k="allListings" />
                ))}
            </h2>

            {showListings && (
              <p className="bazaa-muted mt-1">
                {listings.length}{' '}
                {listings.length === 1 ? (
                  <LanguageText k="listing" />
                ) : (
                  <LanguageText k="listings" />
                )}{' '}
                <LanguageText k="found" />
              </p>
            )}
          </div>

          {!showHome && (
            <Link
              href={backHref}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-amber hover:bg-amberSoft"
            >
              ← <LanguageText k="backTo" />{' '}
              {subcategory ? (
                subcategory
              ) : category ? (
                <LanguageText
                  k={categoryTranslationKey(
                    category,
                  )}
                />
              ) : (
                <LanguageText k="allListings" />
              )}
            </Link>
          )}
        </div>
               {showSubList && categoryConfig && (
          <div className="mb-6 overflow-hidden rounded-card border border-line bg-white shadow-card">
            {subNames.map((subName) => {
              const img =
                subcategoryImage(subName);

              return (
                <Link
                  key={subName}
                  href={buildUrl(
                    category,
                    subName,
                  )}
                  className="group flex items-center gap-3 border-b border-line px-4 py-3.5 transition-colors last:border-b-0 hover:bg-amberSoft"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-bazaa bg-paper">
                    {img && (
                      <Image
                        src={img}
                        alt={subName}
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-ink">
                      {subName}
                    </span>

                    <span className="mt-0.5 block text-xs text-muted">
                      {subCounts[subName] || 0}{' '}
                      {(subCounts[subName] || 0) ===
                      1 ? (
                        <LanguageText k="ad" />
                      ) : (
                        <LanguageText k="ads" />
                      )}
                    </span>
                  </span>

                  <span className="text-lg text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-amberDeep">
                    →
                  </span>
                </Link>
              );
            })}

            <Link
              href={`${buildUrl(category)}&all=1`}
              className="flex items-center justify-between bg-paper px-4 py-4 transition-colors hover:bg-amberSoft"
            >
              <span className="text-sm font-semibold text-amberDeep">
                <LanguageText k="seeAllIn" />{' '}
                {category ? (
                  <LanguageText
                    k={categoryTranslationKey(
                      category,
                    )}
                  />
                ) : null}
              </span>

              <span className="text-muted">
                →
              </span>
            </Link>
          </div>
        )}

        {showBrandTiles && (
          <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {brandNames.map((b) => {
              const logo = getBrandLogo(b);

              return (
                <Link
                  key={b}
                  href={buildUrl(
                    category,
                    subcategory,
                    b,
                  )}
                  className="group flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-card border border-line bg-white p-3 text-center shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-amber hover:shadow-soft"
                >
                  <div className="flex h-9 items-center justify-center">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo}
                        alt=""
                        className="max-h-9 max-w-[64px] object-contain"
                      />
                    ) : (
                      <span className="text-xl text-muted">
                        •••
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-ink">
                    {b}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {showListings && (
          <div className="mb-5">
            <FilterBar
              region={region}
              minPrice={minPrice}
              maxPrice={maxPrice}
              brand={brand}
              subcategory={subcategory}
              brandOptions={brandOptions}
              typeOptions={typeOptions}
            />
          </div>
        )}

        {showListings &&
          (listings.length === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
              <div className="mb-3 text-3xl">
                ⌕
              </div>

              <h3 className="mb-1 font-semibold text-ink">
                <LanguageText k="noListingsMatch" />
              </h3>

              <p className="text-sm text-muted">
                <LanguageText k="tryDifferent" />
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/products/${listingSlug(
                    listing,
                  )}`}
                  className="group overflow-hidden rounded-card border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-line bg-paper">
                    {listing.image_url ? (
                      <Image
                        src={listing.image_url}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-4xl">
                        {CATEGORY_CONFIG[
                          listing.category
                        ]?.icon || '📦'}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5">
                    <div className="font-serif text-lg font-bold text-amberDeep">
                      ETB{' '}
                      {Number(
                        listing.price,
                      ).toLocaleString()}
                    </div>

                    <div className="mt-1 line-clamp-1 text-sm font-semibold text-ink">
                      {listing.title}
                    </div>

                    <div className="mt-1 flex min-w-0 flex-wrap gap-x-1.5 gap-y-1 text-xs text-muted">
                      {listing.brand && (
                        <span>
                          {listing.brand}
                        </span>
                      )}

                      {listing.model && (
                        <>
                          {listing.brand && (
                            <span>•</span>
                          )}

                          <span>
                            {listing.model}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {listing.condition && (
                        <span className="rounded-full bg-amberSoft px-2 py-1 text-[11px] font-semibold text-amberDeep">
                          {listing.condition}
                        </span>
                      )}

                      {listing.location && (
                        <span className="line-clamp-1 text-xs text-muted">
                          {listing.location}
                        </span>
                      )}
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
