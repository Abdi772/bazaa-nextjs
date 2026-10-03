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
import FavoriteButton from './FavoriteButton';

export const revalidate = 60;

function buildUrl(
  category?: string,
  subcategory?: string,
  brand?: string,
) {
  const params = new URLSearchParams();

  if (category) params.set('category', category);
  if (subcategory) params.set('subcategory', subcategory);
  if (brand) params.set('brand', brand);

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
    categoryConfig &&
    subNames.length > 1
      ? subNames.map((name) => ({
          name,
          count: subCounts[name] || 0,
        }))
      : [];

  const brandOptions =
    brandNames.map((name) => ({
      name,
      count: brandCounts[name] || 0,
    }));

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
            {/* HERO */}
            <section className="relative mb-10 overflow-hidden rounded-[22px] bg-ink px-6 py-10 text-paper shadow-soft sm:px-10 sm:py-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber/20 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amberDeep/20 blur-3xl"
              />

              <div className="relative z-10 max-w-3xl">
                <div className="mb-3 inline-flex rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber">
                  Bazaa Marketplace
                </div>

                <h1 className="max-w-2xl font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                  <LanguageText k="buyAndSell" />
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-paper/70 sm:text-base">
                  <LanguageText k="findWhatYouNeed" />
                </p>

                {/* SEARCH */}
                <form
                  action="/"
                  method="get"
                  className="mt-7 max-w-2xl"
                >
                  <div className="flex flex-col gap-2 rounded-[18px] bg-white p-2 shadow-soft sm:flex-row">
                    <div className="min-w-0 flex-1">
                      <SearchInput
                        defaultValue={query}
                      />
                    </div>

                    <button
                      type="submit"
                      className="bazaa-primary min-h-[48px] px-7"
                    >
                      <span className="mr-2">
                        🔍
                      </span>

                      <LanguageText k="search" />
                    </button>
                  </div>
                </form>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-paper/60">
                  <span>
                    ✓ Easy buying
                  </span>

                  <span>
                    ✓ Local sellers
                  </span>

                  <span>
                    ✓ New listings
                  </span>
                </div>
              </div>
            </section>

            {/* CATEGORY HEADING */}
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="bazaa-title text-2xl sm:text-3xl">
                  <LanguageText k="popularCategories" />
                </h2>

                <p className="bazaa-muted mt-1">
                  <LanguageText k="browseBy" />
                </p>
              </div>

              <Link
                href="/?all=1"
                className="shrink-0 text-sm font-semibold text-amberDeep hover:underline"
              >
                <LanguageText k="seeAllIn" />
              </Link>
            </div>

            {/* CATEGORY CARDS */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {Object.entries(
                CATEGORY_CONFIG,
              ).map(([name, config]) => (
                <Link
                  key={name}
                  href={buildUrl(name)}
                  className="group overflow-hidden rounded-card border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-amber hover:shadow-soft"
                >
                  <div className="relative aspect-[1.15/1] overflow-hidden bg-paper">
                    <Image
                      src={`/categories/${name.toLowerCase()}.jpg`}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                    <div className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-base shadow-sm backdrop-blur-sm">
                      {config.icon}
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="text-sm font-semibold text-ink">
                      <LanguageText
                        k={categoryTranslationKey(
                          name,
                        )}
                      />
                    </div>

                    <div className="mt-1 text-xs text-muted">
                      {counts[name] || 0}{' '}
                      <LanguageText k="listings" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* FEATURED HEADING */}
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="bazaa-title text-2xl sm:text-3xl">
                  Featured Listings
                </h2>

                <p className="bazaa-muted mt-1">
                  Discover products available from local sellers
                </p>
              </div>

              <Link
                href="/?all=1"
                className="shrink-0 text-sm font-semibold text-amberDeep hover:underline"
              >
                See all
              </Link>
            </div>
          </>
        )}

        {/* PAGE TITLE */}
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
          <div className="mb-7 overflow-hidden rounded-card border border-line bg-white shadow-card">
            <div className="border-b border-line bg-surfaceSoft px-4 py-3">
              <div className="text-sm font-semibold text-ink">
                Browse {category}
              </div>

              <div className="mt-0.5 text-xs text-muted">
                Choose a category to continue
              </div>
            </div>

            {subNames.map((subName) => {
              const img = subcategoryImage(subName);

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
                      {(subCounts[subName] || 0) === 1 ? (
                        <LanguageText k="ad" />
                      ) : (
                        <LanguageText k="ads" />
                      )}
                    </span>
                  </span>

                  <span className="text-lg text-muted transition-transform group-hover:translate-x-1 group-hover:text-amberDeep">
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
          <div className="mb-7">
            <div className="mb-3">
              <h3 className="text-base font-bold text-ink">
                Choose a brand
              </h3>

              <p className="mt-0.5 text-xs text-muted">
                Browse available brands
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
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
                    className="group flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-card border border-line bg-white p-3 text-center shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-amber hover:bg-amberSoft hover:shadow-soft"
                  >
                    <div className="flex h-10 items-center justify-center">
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt=""
                          className="max-h-10 max-w-[68px] object-contain"
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
          </div>
        )}

        {showListings && (
          <div className="mb-6">
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
            <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center shadow-card">
              <div className="mb-4 text-4xl">
                🔎
              </div>

              <h3 className="mb-1 text-base font-bold text-ink">
                <LanguageText k="noListingsMatch" />
              </h3>

              <p className="text-sm text-muted">
                <LanguageText k="tryDifferent" />
              </p>

              <Link
                href="/"
                className="bazaa-primary mt-5"
              >
                Browse all listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/products/${listingSlug(
                    listing,
                  )}`}
                  className="group overflow-hidden rounded-card border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-amber hover:shadow-soft"
                >
                  {/* PRODUCT IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-paper">
                    {listing.image_url ? (
                      <Image
                        src={listing.image_url}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-5xl">
                          {CATEGORY_CONFIG[
                            listing.category
                          ]?.icon || '📦'}
                        </span>
                      </div>
                    )}

                    {/* CONDITION BADGE */}
                    {listing.condition && (
                      <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-ink shadow-sm backdrop-blur-sm">
                        {listing.condition}
                      </div>
                    )}

                    {/* LOCATION */}
                    {listing.location && (
                      <div className="absolute bottom-2 left-2 max-w-[75%] truncate rounded-full bg-ink/85 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        📍 {listing.location}
                      </div>
                    )}

                    {/* FAVORITE */}
                    <div
                      className="absolute right-2 top-2 z-10"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                    >
                      <FavoriteButton
                        listingId={listing.id}
                      />
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="p-3.5">
                    <div className="font-serif text-lg font-bold leading-tight text-amberDeep">
                      ETB{' '}
                      {Number(
                        listing.price,
                      ).toLocaleString()}
                    </div>

                    <div className="mt-1.5 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-ink">
                      {listing.title}
                    </div>

                    {(listing.brand ||
                      listing.model) && (
                      <div className="mt-1.5 flex min-w-0 flex-wrap gap-x-1.5 gap-y-1 text-xs text-muted">
                        {listing.brand && (
                          <span>
                            {listing.brand}
                          </span>
                        )}

                        {listing.model &&
                          listing.brand && (
                            <span>•</span>
                          )}

                        {listing.model && (
                          <span>
                            {listing.model}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
           }
