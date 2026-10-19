  import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
  getListingById,
  getSimilarListings,
  idFromSlug,
  listingSlug,
} from '@/lib/listings';

import {
  CATEGORY_CONFIG,
  rowLabelFor,
  itemTypeLabelFor,
} from '@/lib/categories';
import Gallery from './Gallery';
import OwnerActions from './OwnerActions';
import ReportButton from '../../ReportButton';
import FavoriteButton from '../../FavoriteButton';
import ChatButton from '../../ChatButton';
import ContactButtons from '../../ContactButtons';
import Avatar from '../../Avatar';
import VerifiedBadge from '../../VerifiedBadge';
import ListingActions from '../../ListingActions';
import SellerRating from '../../SellerRating';
import SellerStatus from '../../SellerStatus';
import SellerFeedback from '../../SellerFeedback';
import ShareButtons from '../../ShareButtons';
import Reviews from '../../Reviews';
import CollapsibleSpecs from '../../CollapsibleSpecs';
import { supabase } from '@/lib/supabaseClient';
import { SITE_URL } from '@/lib/siteUrl';

export const revalidate = 60;

type Props = {
  params: { id: string };
};

async function loadListing(slug: string) {
  const id = idFromSlug(slug);

  if (id == null) return null;

  return getListingById(id);
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const listing = await loadListing(params.id);

  if (!listing) {
    return {
      title: 'Listing not found — Bazaa',
    };
  }

  return {
    title: `${listing.title} — ETB ${Number(
      listing.price
    ).toLocaleString()} — Bazaa`,
    description: listing.description?.slice(0, 160),
    alternates: { canonical: `/products/${params.id}` },
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 160),
      images: listing.image_url
        ? [listing.image_url]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description: listing.description?.slice(0, 160),
      images: listing.image_url ? [listing.image_url] : [],
    },
  };
}

function timeAgo(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days === 1) return '1 day ago';

  return `${days} days ago`;
}

export default async function ProductPage({
  params,
}: Props) {
  const listing = await loadListing(params.id);

  if (!listing) {
    notFound();
  }

  const images = listing.image_urls?.length
    ? listing.image_urls
    : listing.image_url
      ? [listing.image_url]
      : [];

  const similar = await getSimilarListings(
    listing.category,
    listing.id
  );

  const sellerId =
    (
      listing as unknown as {
        user_id?: string | null;
      }
    ).user_id ?? null;

  // Extra fields (read safely, so this works even if the
  // Listing type does not list them yet)
  const extra = listing as unknown as {
    model?: string | null;
    item_type?: string | null;
    year?: number | null;
    trim?: string | null;
    model_number?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    size_sqm?: number | null;
    furnished?: string | null;
    negotiable?: boolean | null;
  };

  // Seller card: number of active ads and "selling since"
  let sellerAds = 0;
  let sellerSince: string | null = null;
  let sellerName: string | null = null;
  let sellerAvatar: string | null = null;
  let sellerVerified = false;

  if (sellerId) {
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('name, avatar_url, verified')
      .eq('id', sellerId)
      .maybeSingle();

    sellerName = (profileRow?.name as string | null)?.trim() || null;
    sellerAvatar = (profileRow?.avatar_url as string | null) || null;
    sellerVerified = !!profileRow?.verified;

    const { data: sellerRows } = await supabase
      .from('listings')
      .select('created_at, status')
      .eq('user_id', sellerId)
      .order('created_at', { ascending: true })
      .limit(500);

    const rows = (sellerRows ?? []) as {
      created_at: string;
      status: string | null;
    }[];

    sellerAds = rows.filter((r) => r.status !== 'sold').length;

    if (rows.length > 0) {
      sellerSince = new Date(rows[0].created_at).toLocaleDateString(
        'en-US',
        { month: 'short', year: 'numeric' },
      );
    }
  }

  const sub = listing.subcategory || '';

  const brandLabel = rowLabelFor(sub);

  const modelLabel =
    sub === 'TV'
      ? 'Size'
      : sub === 'Refrigerators & Freezers'
        ? 'Type'
        : 'Model';

  // Structured data so Google can show price and photo in search results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description?.slice(0, 300) || listing.title,
    image: images,
    url: `${SITE_URL}/products/${params.id}`,
    offers: {
      '@type': 'Offer',
      price: Number(listing.price),
      priceCurrency: 'ETB',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* Top navigation / actions */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[42px] items-center rounded-full border border-line bg-surface px-4 text-sm font-bold text-fg shadow-sm transition-colors hover:bg-amberSoft"
        >
          ← Back
        </Link>

        <ListingActions
          listingId={listing.id}
          title={listing.title}
        />
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <section className="mb-5 overflow-hidden rounded-card border border-line bg-surface shadow-soft">
          <Gallery
            images={images}
            title={listing.title}
          />
        </section>
      )}

      {/* Main product information */}
      <section className="mb-4 overflow-hidden rounded-card border border-line bg-surface shadow-card">
        <div className="p-5 sm:p-6">
          {/* Small marketplace label */}
          <div className="mb-3 text-xs font-semibold text-amberText">
            Bazaa Marketplace
          </div>

          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="min-w-0">
              {listing.status === 'sold' && (
                <span className="mb-2 inline-flex rounded-full bg-danger px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Sold
                </span>
              )}

              <div className="mb-2 flex items-center gap-1.5 text-xs text-muted sm:text-sm">
                <span aria-hidden="true">📍</span>
                <span className="min-w-0 truncate">
                  {[listing.location, listing.region]
                    .filter(Boolean)
                    .join(', ')}
                  {' · '}
                  {timeAgo(listing.created_at)}
                </span>
              </div>

              <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-fg sm:text-3xl">
                {listing.title}
              </h1>

              {/* Price */}
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <div className="font-serif text-3xl font-bold leading-none text-amberText sm:text-4xl">
                  ETB {Number(listing.price).toLocaleString()}
                </div>

                {extra.negotiable && (
                  <span className="text-sm font-semibold text-muted">
                    Negotiable
                  </span>
                )}
              </div>
            </div>

            {/* Condition */}
            {listing.condition && (
              <div>
                <span className="inline-flex items-center rounded-full border border-green/20 bg-greenSoft px-3 py-1.5 text-xs font-bold text-greenText">
                  ✓ {listing.condition}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-4 sm:grid-cols-4">
            <div className="rounded-bazaa bg-panel p-3">
              <div className="text-xs font-medium text-muted">
                Category
              </div>

              <div className="mt-1 truncate text-sm font-semibold text-fg">
                {listing.category}
              </div>
            </div>

            {listing.subcategory && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  Type
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {listing.subcategory}
                </div>
              </div>
            )}

            {extra.item_type && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  {itemTypeLabelFor(listing.subcategory ?? '')}
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.item_type}
                </div>
              </div>
            )}

            {listing.brand && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  {brandLabel}
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {listing.brand}
                </div>
              </div>
            )}

            {extra.model && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  {modelLabel}
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.model}
                </div>
              </div>
            )}

            {extra.model_number && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  Model number
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.model_number}
                </div>
              </div>
            )}

            {extra.year && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  Year
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.year}
                </div>
              </div>
            )}

            {extra.trim && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  Trim
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.trim}
                </div>
              </div>
            )}

            {extra.bedrooms != null && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  Bedrooms
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.bedrooms}
                </div>
              </div>
            )}

            {extra.bathrooms != null && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  Bathrooms
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.bathrooms}
                </div>
              </div>
            )}

            {extra.size_sqm != null && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  Size
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.size_sqm} m²
                </div>
              </div>
            )}

            {extra.furnished && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-medium text-muted">
                  Furnished
                </div>

                <div className="mt-1 truncate text-sm font-semibold text-fg">
                  {extra.furnished}
                </div>
              </div>
            )}

            <div className="rounded-bazaa bg-panel p-3">
              <div className="text-xs font-medium text-muted">
                Posted
              </div>

              <div className="mt-1 truncate text-sm font-semibold text-fg">
                {timeAgo(listing.created_at)}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mt-3 flex items-start gap-3 rounded-bazaa border border-line bg-surface p-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amberSoft text-base"
            >
              📍
            </span>

            <div className="min-w-0">
              <div className="text-xs font-medium text-muted">
                Location
              </div>

              <div className="mt-0.5 text-sm font-bold text-fg">
                {listing.location}
              </div>

              {listing.region && (
                <div className="mt-0.5 text-xs text-muted">
                  {listing.region}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save area */}
        <div className="flex items-center justify-between gap-3 border-t border-line bg-panel px-5 py-3 sm:px-6">
          <div>
            <div className="text-sm font-bold text-fg">
              Interested in this item?
            </div>

            <div className="text-xs text-muted">
              Save it so you can find it later.
            </div>
          </div>

          <div className="shrink-0">
            <FavoriteButton listingId={listing.id} />
          </div>
        </div>
      </section>

      {/* Owner actions */}
      <div className="mb-4">
        <OwnerActions id={listing.id} />
      </div>

      {/* Description */}
      <section className="mb-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amberSoft text-lg">
            📝
          </div>

          <h2 className="font-serif text-xl font-bold text-fg">
            Description
          </h2>
        </div>

        <div className="rounded-bazaa bg-panel p-4">
          <p className="whitespace-pre-wrap text-sm leading-7 text-fg/90 sm:text-base">
            {listing.description || 'No description provided.'}
          </p>
        </div>
      </section>

      {/* Specifications */}
      {Array.isArray(listing.specs) &&
        listing.specs.filter((row) => row?.label && row?.value).length >
          0 && (
          <CollapsibleSpecs
            rows={listing.specs.filter(
              (row) => row?.label && row?.value,
            )}
          />
        )}

      {/* Seller */}
      {sellerId && (
        <Link
          href={`/seller/${sellerId}`}
          className="mb-4 flex min-h-[82px] items-center gap-3 rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:bg-amberSoft sm:p-5"
        >
          <Avatar
            name={sellerName}
            url={sellerAvatar}
            className="h-14 w-14 text-xl"
          />

          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-muted">
              Seller
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-base font-bold text-fg">
              {sellerName || 'View seller'}
              {sellerVerified && <VerifiedBadge />}
            </div>

            <div className="mt-0.5 text-xs text-muted">
              {sellerAds} {sellerAds === 1 ? 'ad' : 'ads'}
              {sellerSince ? ` · Selling since ${sellerSince}` : ''}
            </div>

            <SellerRating sellerId={sellerId} />

            <div className="mt-1">
              <SellerStatus sellerId={sellerId} />
            </div>
          </div>

          <span
            aria-hidden="true"
            className="text-xl font-bold text-amberText"
          >
            →
          </span>
        </Link>
      )}

      {/* Seller feedback */}
      {sellerId && <Reviews sellerId={sellerId} />}

      {sellerId && <SellerFeedback sellerId={sellerId} />}

      {/* Contact / Chat */}
      <section className="mb-5 mt-4 overflow-hidden rounded-card border border-line bg-surface shadow-card">
        <div className="bg-ink px-5 py-4 text-paper sm:px-6">
          <div className="text-xs font-semibold text-amber">
            Contact seller
          </div>

          <h2 className="mt-1 font-serif text-xl font-bold">
            Ready to buy?
          </h2>

          <p className="mt-1 text-xs leading-5 text-paper/70">
            Contact the seller directly about this listing.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {/* Chat */}
          <div className="mb-3">
            <ChatButton
              listingId={listing.id}
              sellerId={sellerId}
            />
          </div>

          <ContactButtons listingId={listing.id} title={listing.title} />
        </div>
      </section>

      {/* Share */}
      <ShareButtons title={listing.title} price={Number(listing.price)} />

      {/* Safety */}
      <section className="mb-6 overflow-hidden rounded-card border border-amber/30 bg-amberSoft">
        <div className="flex items-center gap-3 border-b border-amber/20 px-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-lg">
            🛡️
          </div>

          <div>
            <h2 className="text-sm font-bold text-fg">
              Stay safe on Bazaa
            </h2>

            <p className="mt-0.5 text-xs text-muted">
              Simple steps for safer transactions.
            </p>
          </div>
        </div>

        <ul className="space-y-3 px-5 py-4 text-xs leading-5 text-muted">
          <li className="flex gap-2">
            <span className="font-bold text-amberText">
              ✓
            </span>
            <span>
              Meet in a public place and inspect the item
              before paying.
            </span>
          </li>

          <li className="flex gap-2">
            <span className="font-bold text-amberText">
              ✓
            </span>
            <span>
              Don&apos;t send money in advance to someone
              you haven&apos;t met.
            </span>
          </li>

          <li className="flex gap-2">
            <span className="font-bold text-amberText">
              ✓
            </span>
            <span>
              Be cautious of requests to move the
            conversation off this site.
            </span>
          </li>
        </ul>
      </section>

      {/* Report */}
      <div className="mb-7 text-center">
        <ReportButton
          listingId={listing.id}
          title={listing.title}
          ownerId={sellerId}
        />
      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercas
             tracking-[0.16em] text-amberText">
                You may also like
              </div>

              <h2 className="mt-1 font-serif text-2xl font-bold text-fg">
                Similar listings
              </h2>
            </div>

            <span className="text-xs font-semibold text-muted">
              {similar.length} items
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {similar.map((s) => (
              <Link
                key={s.id}
                href={`/products/${listingSlug(s)}`}
                className="group overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-line bg-panel">
                  {s.image_url ? (
                    <Image
                      src={s.image_url}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 220px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-3xl">
                      {CATEGORY_CONFIG[s.category]
                        ?.icon || '📦'}
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <div className="font-serif text-base font-bold text-amberText sm:text-lg">
                    ETB {Number(s.price).toLocaleString()}
                  </div>

                  <div className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-fg sm:text-sm">
                    {s.title}
                  </div>

                  <div className="mt-2 text-xs font-medium text-muted">
                    View listing →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
      }
           
