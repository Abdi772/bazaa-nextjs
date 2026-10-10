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

import { CATEGORY_CONFIG } from '@/lib/categories';
import Gallery from './Gallery';
import OwnerActions from './OwnerActions';
import ReportButton from '../../ReportButton';
import FavoriteButton from '../../FavoriteButton';
import ChatButton from '../../ChatButton';
import ContactButtons from '../../ContactButtons';
import ListingActions from '../../ListingActions';
import SellerRating from '../../SellerRating';

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
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 160),
      images: listing.image_url
        ? [listing.image_url]
        : [],
    },
  };
}

function intlPhone(raw: string) {
  let d = raw.replace(/\D/g, '');

  if (d.startsWith('00')) {
    d = d.slice(2);
  } else if (d.startsWith('0')) {
    d = '251' + d.slice(1);
  } else if (d.length === 9) {
    d = '251' + d;
  }

  return d;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) return 'Today';
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
    year?: number | null;
    trim?: string | null;
    model_number?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    size_sqm?: number | null;
    furnished?: string | null;
  };

  const sub = listing.subcategory || '';

  const brandLabel = [
    'Accessories',
    'Phone Accessories',
    'Audio',
    'Networking',
    'Security & CCTV',
  ].includes(sub)
    ? 'Type'
    : 'Brand';

  const modelLabel =
    sub === 'TV'
      ? 'Size'
      : sub === 'Refrigerators & Freezers'
        ? 'Type'
        : 'Model';

  return (
    <div className="mx-auto w-full max-w-3xl">
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
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-amberText">
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

              <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-fg sm:text-3xl">
                {listing.title}
              </h1>

              {/* Price */}
              <div className="mt-3 font-serif text-3xl font-bold leading-none text-amberText sm:text-4xl">
                ETB {Number(listing.price).toLocaleString()}
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
              <div className="text-xs font-bold uppercase tracking-wide text-muted">
                Category
              </div>

              <div className="mt-1 truncate text-sm font-bold text-fg">
                {listing.category}
              </div>
            </div>

            {listing.subcategory && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  Type
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {listing.subcategory}
                </div>
              </div>
            )}

            {listing.brand && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  {brandLabel}
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {listing.brand}
                </div>
              </div>
            )}

            {extra.model && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  {modelLabel}
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {extra.model}
                </div>
              </div>
            )}

            {extra.model_number && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  Model number
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {extra.model_number}
                </div>
              </div>
            )}

            {extra.year && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  Year
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {extra.year}
                </div>
              </div>
            )}

            {extra.trim && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  Trim
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {extra.trim}
                </div>
              </div>
            )}

            {extra.bedrooms != null && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  Bedrooms
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {extra.bedrooms}
                </div>
              </div>
            )}

            {extra.bathrooms != null && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  Bathrooms
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {extra.bathrooms}
                </div>
              </div>
            )}

            {extra.size_sqm != null && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  Size
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {extra.size_sqm} m²
                </div>
              </div>
            )}

            {extra.furnished && (
              <div className="rounded-bazaa bg-panel p-3">
                <div className="text-xs font-bold uppercase tracking-wide text-muted">
                  Furnished
                </div>

                <div className="mt-1 truncate text-sm font-bold text-fg">
                  {extra.furnished}
                </div>
              </div>
            )}

            <div className="rounded-bazaa bg-panel p-3">
              <div className="text-xs font-bold uppercase tracking-wide text-muted">
                Posted
              </div>

              <div className="mt-1 truncate text-sm font-bold text-fg">
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
              <div className="text-xs font-bold uppercase tracking-wide text-muted">
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
          <section className="mb-4 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amberSoft text-lg">
                📋
              </div>

              <h2 className="font-serif text-xl font-bold text-fg">
                Specifications
              </h2>
            </div>

            <div className="overflow-hidden rounded-bazaa border border-line">
              {listing.specs
                .filter((row) => row?.label && row?.value)
                .map((row, i) => (
                  <div
                    key={`${row.label}-${i}`}
                    className="flex items-start justify-between gap-4 border-b border-line bg-panel px-4 py-3 text-sm last:border-b-0"
                  >
                    <span className="font-semibold text-muted">
                      {row.label}
                    </span>

                    <span className="text-right font-bold text-fg">
                      {row.value}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        )}

      {/* Seller */}
      {sellerId && (
        <Link
          href={`/seller/${sellerId}`}
          className="mb-4 flex min-h-[82px] items-center gap-3 rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:bg-amberSoft sm:p-5"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-inverse font-serif text-xl font-bold text-onInverse">
            {(listing.email || '?')
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-wide text-muted">
              Seller
            </div>

            <div className="mt-1 text-base font-bold text-fg">
              View seller
            </div>

            <div className="mt-0.5 text-xs text-muted">
              See other listings from this seller
            </div>

            <SellerRating sellerId={sellerId} />
          </div>

          <span
            aria-hidden="true"
            className="text-xl font-bold text-amberText"
          >
            →
          </span>
        </Link>
      )}

      {/* Contact / Chat */}
      <section className="mb-5 overflow-hidden rounded-card border border-line bg-surface shadow-card">
        <div className="bg-ink px-5 py-4 text-paper sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-amber">
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

          {/* Phone + WhatsApp */}
          {listing.phone && (
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${listing.phone.replace(
                  /\s+/g,
                  ''
                )}`}
                className="inline-flex min-h-[50px] items-center justify-center rounded-bazaa bg-green px-3 py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
              >
                <span className="mr-2 text-base">📞</span>
                Call
              </a>

              <a
                href={`https://wa.me/${intlPhone(
                  listing.phone
                )}?text=${encodeURIComponent(
                  'Hi, I am interested in: ' +
                    listing.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[50px] items-center justify-center rounded-bazaa bg-whatsapp px-3 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                <span className="mr-2 text-base">💬</span>
                WhatsApp
              </a>
            </div>
          )}

          <ContactButtons listingId={listing.id} title={listing.title} />
        </div>
      </section>

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
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-amberText">
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
