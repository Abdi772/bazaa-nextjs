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
  subcategoryImages,
  getOtherBrands,
  getModels,
} from '@/lib/categories';

import { getBrandLogo } from '@/lib/brandLogos';
import { cardLine } from '@/lib/cardLine';
import { supabase } from '@/lib/supabaseClient';

import CategorySidebar from './CategorySidebar';
import FilterBar from './FilterBar';
import LanguageText from './LanguageText';
import SearchInput from './SearchInput';
import FavoriteButton from './FavoriteButton';
import ModelRow from './ModelRow';
import OnlineDot from './OnlineDot';
import Avatar from './Avatar';
import { adjustedRating, MIN_REVIEWS } from '../lib/rating';
import CategoryTiles from './CategoryTiles';
import HeroCarousel from './HeroCarousel';
import FallbackImage from './FallbackImage';

export const revalidate = 60;

function buildUrl(
  category?: string,
  subcategory?: string,
  brand?: string,
  more?: boolean,
  model?: string,
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

  if (more) {
    params.set('more', '1');
  }

  if (model) {
    params.set('model', model);
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
    more?: string;
    model?: string;
    condition?: string;
    budget?: string;
    all?: string;
    region?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}) {
  const query = searchParams.q || '';
  const category = searchParams.category || '';
  const subcategory = searchParams.subcategory || '';
  const brand = searchParams.brand || '';
  const showMoreBrands = searchParams.more === '1';

  const model = searchParams.model || '';
  const condition = searchParams.condition || '';
  const budget = searchParams.budget || '';

  const showAll = searchParams.all === '1';

  const region = searchParams.region || '';
  const minPrice = searchParams.minPrice || '';
  const maxPrice = searchParams.maxPrice || '';

  const PAGE_SIZE = 24;
  const page = Math.max(
    1,
    Math.min(200, parseInt(searchParams.page || '1', 10) || 1),
  );

  // Turn the budget dropdown into a real price range so the
  // database filters it (not the browser after the fact).
  const BUDGETS: Record<string, [number | undefined, number | undefined]> = {
    'Under ETB 10,000': [undefined, 9999],
    'ETB 10,000 – 25,000': [10000, 25000],
    'ETB 25,000 – 50,000': [25000, 50000],
    'ETB 50,000 – 100,000': [50000, 100000],
    'Over ETB 100,000': [100001, undefined],
  };
  const budgetRange = BUDGETS[budget];

  const categoryConfig = category
    ? CATEGORY_CONFIG[category]
    : undefined;

  const subNames = categoryConfig
    ? Object.keys(categoryConfig.subcategories)
    : [];

  const mainBrandNames =
    categoryConfig && subcategory
      ? categoryConfig.subcategories[subcategory] || []
      : [];

  // Brands shown after tapping "Other"
  const otherBrandNames = subcategory
    ? getOtherBrands(subcategory)
    : [];

  // true while the row at the top shows the "Other" brands
  const inMore =
    otherBrandNames.length > 0 &&
    (showMoreBrands ||
      (!!brand && otherBrandNames.includes(brand)));

  const brandNames = inMore
    ? otherBrandNames
    : mainBrandNames;

  // Models for the chosen brand (shown as a row, not a long list)
  const modelNames =
    subcategory && brand && brand !== 'Other'
      ? getModels(subcategory, brand).filter(
          (m) => m !== 'Other',
        )
      : [];

  // Everything, for the filter dropdown
  const allBrandNames = Array.from(
    new Set([
      ...mainBrandNames,
      ...otherBrandNames,
    ]),
  );

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
          model,
          condition,
          minPrice: minPrice
            ? Number(minPrice)
            : budgetRange?.[0],
          maxPrice: maxPrice
            ? Number(maxPrice)
            : budgetRange?.[1],
          limit: PAGE_SIZE + 1,
          offset: (page - 1) * PAGE_SIZE,
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

  // We ask for one extra row to know if another page exists.
  const hasMore = rawListings.length > PAGE_SIZE;
  const listings = rawListings.slice(0, PAGE_SIZE);

  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== 'page') p.set(key, value);
    }
    if (n > 1) p.set('page', String(n));
    const qs = p.toString();
    return qs ? `/?${qs}` : '/';
  };
  const nextPageHref = pageHref(page + 1);
  const prevPageHref = pageHref(page - 1);

  // Seller feedback summary for the cards (one query for the whole page)
  const sellerIds = Array.from(
    new Set(
      listings
        .map((l) => (l as unknown as { user_id?: string | null }).user_id)
        .filter((v): v is string => !!v),
    ),
  );

  const ratingStats: Record<string, { sum: number; total: number }> = {};

  if (sellerIds.length > 0) {
    const { data: rvRows } = await supabase
      .from('reviews')
      .select('seller_id, rating')
      .in('seller_id', sellerIds);

    (rvRows ?? []).forEach((r) => {
      if (!ratingStats[r.seller_id]) {
        ratingStats[r.seller_id] = { sum: 0, total: 0 };
      }
      ratingStats[r.seller_id].total += 1;
      ratingStats[r.seller_id].sum += Number(r.rating) || 0;
    });
  }

  // Seller names for the cards (one query for the whole page)
  const sellerNames: Record<string, string> = {};
  const sellerAvatars: Record<string, string> = {};

  if (sellerIds.length > 0) {
    const { data: nameRows } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', sellerIds);

    (nameRows ?? []).forEach((r) => {
      if (r.name) sellerNames[r.id as string] = String(r.name);
      if (r.avatar_url) sellerAvatars[r.id as string] = String(r.avatar_url);
    });
  }

  const sellerNameOf = (listing: unknown): string | null => {
    const uid = (listing as { user_id?: string | null }).user_id;
    return uid ? sellerNames[uid] ?? null : null;
  };

  const sellerAvatarOf = (listing: unknown): string | null => {
    const uid = (listing as { user_id?: string | null }).user_id;
    return uid ? sellerAvatars[uid] ?? null : null;
  };

  const ratingOf = (listing: unknown) => {
    const uid = (listing as { user_id?: string | null }).user_id;
    const s = uid ? ratingStats[uid] : undefined;
    if (!s || s.total === 0) return null;
    return { avg: adjustedRating(s.sum, s.total), total: s.total };
  };

  const typeOptions =
    categoryConfig && subNames.length > 1
      ? subNames.map((name) => ({
          name,
          count: subCounts[name] || 0,
        }))
      : [];

  const brandOptions = allBrandNames.map(
    (name) => ({
      name,
      count: brandCounts[name] || 0,
    }),
  );

  let backHref = '/';

  if (model) {
    backHref = buildUrl(
      category,
      subcategory,
      brand,
      inMore,
    );
  } else if (brand) {
    backHref = buildUrl(
      category,
      subcategory,
      undefined,
      inMore,
    );
  } else if (subcategory && showMoreBrands) {
    backHref = buildUrl(category, subcategory);
  } else if (subcategory) {
    backHref = buildUrl(category);
  } else if (showAll) {
    backHref = buildUrl(category);
  }

  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-6">
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
            <section className="mb-7 overflow-hidden rounded-card bazaa-hero px-5 py-7 text-paper shadow-soft sm:px-8 sm:py-10">
              <div className="max-w-2xl">
                <HeroCarousel />

                <form
                  action="/"
                  method="get"
                  className="flex flex-col gap-2.5 sm:flex-row"
                >
                  <div className="min-w-0 flex-1">
                    <SearchInput />
                  </div>

                  <button
                    type="submit"
                    className="bazaa-primary min-h-[48px] w-full px-6 sm:w-auto"
                  >
                    <LanguageText k="search" />
                  </button>
                </form>
              </div>
            </section>

            <div className="mb-4">
              <h2 className="bazaa-title text-xl sm:text-2xl">
                <LanguageText k="popularCategories" />
              </h2>

              <p className="bazaa-muted mt-1">
                <LanguageText k="browseBy" />
              </p>
            </div>

            <CategoryTiles
              items={Object.keys(CATEGORY_CONFIG).map((name) => ({
                name,
                href: buildUrl(name),
                count: counts[name] || 0,
                labelKey: categoryTranslationKey(name),
                icon: (CATEGORY_CONFIG[name] as { icon?: string })?.icon,
              }))}
            />
          </>
        )}

        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="bazaa-title break-words text-xl sm:text-2xl">
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
              className="inline-flex min-h-[40px] w-fit items-center rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-fg transition-colors hover:border-amber hover:bg-amberSoft"
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
          <div className="mb-6 overflow-hidden rounded-card border border-line bg-surface shadow-card">
            {subNames.map((subName) => {
              return (
                <Link
                  key={subName}
                  href={buildUrl(
                    category,
                    subName,
                  )}
                  className="group flex min-h-[76px] items-center gap-3 border-b border-line px-3.5 py-3.5 transition-colors last:border-b-0 hover:bg-amberSoft sm:px-4"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-bazaa bg-panel sm:h-15 sm:w-15">
                    <FallbackImage
                      srcs={subcategoryImages(subName)}
                      alt={subName}
                      sizes="60px"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold leading-5 text-fg sm:text-base">
                      {subName}
                    </span>

                    <span className="mt-1 block text-xs text-muted">
                      {subCounts[subName] || 0}{' '}
                      {(subCounts[subName] || 0) ===
                      1 ? (
                        <LanguageText k="ad" />
                      ) : (
                        <LanguageText k="ads" />
                      )}
                    </span>
                  </span>

                  <span className="shrink-0 text-lg text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-amberText">
                    →
                  </span>
                </Link>
              );
            })}

            <Link
              href={`${buildUrl(category)}&all=1`}
              className="flex min-h-[52px] items-center justify-between bg-panel px-3.5 py-3.5 transition-colors hover:bg-amberSoft sm:px-4"
            >
              <span className="text-sm font-semibold text-amberText">
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
          <div className="mb-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2.5">
              {inMore && (
                <Link
                  href={buildUrl(category, subcategory)}
                  className="flex min-h-[96px] w-[88px] shrink-0 flex-col items-center justify-center gap-2 rounded-card border border-line bg-surface p-2.5 text-center shadow-card"
                >
                  <span className="text-xl text-muted">
                    ‹
                  </span>

                  <span className="text-[11px] font-semibold leading-4 text-fg sm:text-xs">
                    All brands
                  </span>
                </Link>
              )}

              {brandNames.map((b) => {
                const logo = getBrandLogo(b);

                const opensMore =
                  b === 'Other' &&
                  !inMore &&
                  otherBrandNames.length > 0;

                const selected = brand === b;

                const href = opensMore
                  ? buildUrl(
                      category,
                      subcategory,
                      undefined,
                      true,
                    )
                  : selected
                    ? buildUrl(
                        category,
                        subcategory,
                        undefined,
                        inMore,
                      )
                    : buildUrl(
                        category,
                        subcategory,
                        b,
                        inMore,
                      );

                return (
                  <Link
                    key={b}
                    href={href}
                    className={`group flex min-h-[96px] w-[88px] shrink-0 flex-col items-center justify-center gap-2 rounded-card border bg-surface p-2.5 text-center shadow-card transition-all duration-200 hover:border-amber hover:shadow-soft ${
                      selected
                        ? 'border-amber ring-2 ring-amber'
                        : 'border-line'
                    }`}
                  >
                    <div className="flex h-9 w-full items-center justify-center">
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt=""
                          className="max-h-9 max-w-[58px] object-contain"
                        />
                      ) : b === 'Other' ? (
                        <span className="text-xl text-muted">
                          •••
                        </span>
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-panel text-base font-bold text-muted">
                          {b.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="line-clamp-2 text-[11px] font-semibold leading-4 text-fg sm:text-xs">
                      {b}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {showBrandTiles && modelNames.length > 0 && (
          <ModelRow
            items={modelNames.map((m) => ({
              name: m,
              selected: model === m,
              href:
                model === m
                  ? buildUrl(
                      category,
                      subcategory,
                      brand,
                      inMore,
                    )
                  : buildUrl(
                      category,
                      subcategory,
                      brand,
                      inMore,
                      m,
                    ),
            }))}
          />
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
            <div className="rounded-card border border-dashed border-line bazaa-surface px-5 py-14 text-center sm:px-6 sm:py-16">
              <div className="mb-3 text-3xl">
                ⌕
              </div>

              <h3 className="mb-1 text-sm font-semibold bazaa-text sm:text-base">
                <LanguageText k="noListingsMatch" />
              </h3>

              <p className="text-sm leading-5 bazaa-muted-text">
                <LanguageText k="tryDifferent" />
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/products/${listingSlug(
                      listing,
                    )}`}
                    className="group min-w-0 overflow-hidden rounded-card border border-line bazaa-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-line bazaa-image-bg">
                      {listing.image_url ? (
                        <Image
                          src={listing.image_url}
                          alt={listing.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl">
                          {CATEGORY_CONFIG[
                            listing.category
                          ]?.icon || '📦'}
                        </span>
                      )}

                      <OnlineDot
                        sellerId={
                          (listing as unknown as { user_id?: string | null })
                            .user_id
                        }
                      />

                      <div className="absolute right-2 top-2 z-10 sm:right-2.5 sm:top-2.5">
                        <FavoriteButton
                          listingId={listing.id}
                        />
                      </div>

                      {sellerNameOf(listing) && (
                        <div className="absolute bottom-2 right-2 z-10 sm:bottom-2.5 sm:right-2.5">
                          <Avatar
                            name={sellerNameOf(listing)}
                            url={sellerAvatarOf(listing)}
                            className="h-9 w-9 border-2 border-surface text-base shadow-card"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 sm:p-3.5">
                      <div className="font-serif text-base font-bold leading-5 bazaa-price sm:text-lg">
                        ETB{' '}
                        {Number(
                          listing.price,
                        ).toLocaleString()}
                      </div>

                      <div className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-5 bazaa-text sm:text-sm">
                        {listing.title}
                      </div>

                      {cardLine(
                        listing.brand,
                        listing.model,
                        listing.title,
                      ) && (
                        <div className="mt-1 min-w-0 truncate text-[11px] leading-4 bazaa-muted-text sm:text-xs">
                          {cardLine(
                            listing.brand,
                            listing.model,
                            listing.title,
                          )}
                        </div>
                      )}

                      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5">
                        {listing.condition && (
                          <span className="max-w-full truncate rounded-full bazaa-soft-bg px-2 py-1 text-[10px] font-semibold leading-4 bazaa-price sm:text-[11px]">
                            {listing.condition}
                          </span>
                        )}

                        {listing.location && (
                          <span className="min-w-0 max-w-full truncate text-[11px] leading-4 bazaa-muted-text sm:text-xs">
                            {listing.location}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] leading-4 sm:text-xs">
                        {sellerNameOf(listing) && (
                          <span className="min-w-0 truncate font-semibold text-fg">
                            {sellerNameOf(listing)}
                          </span>
                        )}

                        {ratingOf(listing) &&
                        ratingOf(listing)!.total >= MIN_REVIEWS ? (
                          <span className="shrink-0 font-semibold text-fg">
                            <span className="text-amberText">★</span>{' '}
                            {ratingOf(listing)!.avg.toFixed(1)}{' '}
                            <span className="font-normal bazaa-muted-text">
                              ({ratingOf(listing)!.total})
                            </span>
                          </span>
                        ) : (
                          <span className="shrink-0 bazaa-muted-text">
                            {sellerNameOf(listing)
                              ? '· New seller'
                              : 'New seller'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {(hasMore || page > 1) && (
                <div className="mt-5 flex items-center justify-center gap-3">
                  {page > 1 && (
                    <Link
                      href={prevPageHref}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-card border border-line px-5 text-sm font-bold bazaa-surface"
                    >
                      ← Previous
                    </Link>
                  )}
                  <span className="text-sm bazaa-muted-text">
                    Page {page}
                  </span>
                  {hasMore && (
                    <Link
                      href={nextPageHref}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-card border border-line px-5 text-sm font-bold bazaa-surface"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          ))}
      </div>
    </div>
  );
                      }
