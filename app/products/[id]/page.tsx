import { cache } from 'react';
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

// Works on Next 14 (plain object) and Next 15+ (Promise).
type Props = {
  params: Promise<{ id: string }> | { id: string };
};

// Listing type inferred from the data layer, plus optional seller fields.
type Listing = NonNullable<Awaited<ReturnType<typeof getListingById>>> & {
  user_id?: string | null;
  seller_name?: string | null;
};

// cache() so generateMetadata and the page share one DB call per request.
const loadListing = cache(async (slug: string): Promise<Listing | null> => {
  const id = idFromSlug(slug);

  if (id == null) return null;

  return (await getListingById(id)) as Listing | null;
});

function formatPrice(price: unknown) {
  const n = Number(price);
  return `ETB ${Number.isFinite(n) ? n.toLocaleString() : '—'}`;
}

function timeAgo(iso: string) {
  const time = new Date(iso).getTime();

  if (Number.isNaN(time)) return '—';

  // Clamp to 0 so small clock differences never give "-1 days ago".
  const days = Math.max(0, Math.floor((Date.now() - time) / 86400000));

  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';

  return `${days} days ago`;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await loadListing(id);

  if (!listing) {
    return { title: 'Listing not found — Bazaa' };
  }

  const description = listing.description?.slice(0, 160);

  return {
    title: `${listing.title} — ${formatPrice(listing.price)} — Bazaa`,
    description,
    openGraph: {
      title: listing.title,
      description,
      images: listing.image_url ? [listing.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const listing = await loadListing(id);

  if (!listing) {
    notFound();
  }

  const images = listing.image_urls?.length
    ? listing.image_urls
    : listing.image_url
      ? [listing.image_url]
      : [];

  const similar = await getSimilarListings(listing.category, listing.id);

  const sellerId = listing.user_id ?? null;

  // Seller avatar: first letter of the seller's name, or a neutral icon.
  const sellerInitial = listing.seller_name?.trim()
    ? listing.seller_name.trim().charAt(0).toUpperCase()
    : '👤';

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Top navigation / actions */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[42px] items-center rounded-full border-[2px] border-line bg-white px-4 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-amberSoft"
        >
          ← Back
        </Link>

        <ListingActions listingId={listing.id} title={listing.title} />
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <section className="mb-5 overflow-hidden rounded-card border-[2px] border-line bg-white shadow-soft">
          <Gallery images={images} title={listing.title} />
        </section>
      )}

      {/* Main product information */}
      <section className="mb-4 overflow-hidden rounded-card border-[2px] border-line bg-white shadow-card">
        <div className="p-5 sm:p-6">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-amberDeep">
            Bazaa Marketplace
          </div>

          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              {listing.status === 'sold' && (
                <span className="mb-2 inline-flex rounded-full bg-danger px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Sold
                </span>
              )}

              <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                {listing.title}
              </h1>

              <div className="mt-3 font-serif text-3xl font-bold leading-none text-amberDeep sm:text-4xl">
                {formatPrice(listing.price)}
              </div>
            </div>

            {listing.condition && (
              <div>
                <span className="inline-flex items-center rounded-full border-[2px] border-green/20 bg-greenSoft px-3 py-1.5 text-xs font-bold text-green">
                  ✓ {listing.condition}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="mt-5 grid grid-cols-2 gap-2 border-t-[2px] border-line pt-4 sm:grid-cols-4">
            <Detail label="Category" value={listing.category} />
            {listing.subcategory && (
              <Detail label="Type" value={listing.subcategory} />
            )}
            {listing.brand && <Detail label="Brand" value={listing.brand} />}
            <Detail label="Posted" value={timeAgo(listing.created_at)} />
          </div>

          {/* Location */}
          <div className="mt-3 flex items-start gap-3 rounded-bazaa border-[2px] border-line bg-white p-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amberSoft text-base"
            >
              📍
            </span>

            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wide text-muted">
                Location
              </div>

              <div className="mt-0.5 text-sm font-bold text-ink">
                {[listing.area, listing.location].filter(Boolean).join(', ')}
              </div>

              {listing.region && (
                <div className="mt-0.5 text-xs text-muted">
                  {listing.region}
                </div>
              )}

              {listing.location_note && (
                <div className="mt-1 text-xs leading-5 text-muted">
                  {listing.location_note}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save area */}
        <div className="flex items-center justify-between gap-3 border-t-[2px] border-line bg-paper px-5 py-3 sm:px-6">
          <div>
            <div className="text-sm font-bold text-ink">
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
      <section className="mb-4 rounded-card border-[2px] border-line bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amberSoft text-lg">
            📝
          </div>

          <h2 className="font-serif text-xl font-bold text-ink">
            Description
          </h2>
        </div>

        <div className="rounded-bazaa bg-paper p-4">
          <p className="whitespace-pre-wrap text-sm leading-7 text-ink/90 sm:text-base">
            {listing.description || 'No description provided.'}
          </p>
        </div>
      </section>

      {/* Seller */}
      {sellerId && (
        <Link
          href={`/seller/${sellerId}`}
          className="mb-4 flex min-h-[82px] items-center gap-3 rounded-card border-[2px] border-line bg-white p-4 shadow-card transition-colors hover:bg-amberSoft sm:p-5"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-xl font-bold text-paper">
            {sellerInitial}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wide text-muted">
              Seller
            </div>

            <div className="mt-1 text-base font-bold text-ink">
              {listing.seller_name || 'View seller'}
            </div>

            <div className="mt-0.5 text-xs text-muted">
              See other listings from this seller
            </div>

            <SellerRating sellerId={sellerId} />
          </div>

          <span
            aria-hidden="true"
            className="text-xl font-bold text-amberDeep"
          >
            →
          </span>
        </Link>
      )}

      {/* Contact / Chat */}
      <section className="mb-5 overflow-hidden rounded-card border-[2px] border-line bg-white shadow-card">
        <div className="bg-ink px-5 py-4 text-paper sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-amber">
            Contact seller
          </div>

          <h2 className="mt-1 font-serif text-xl font-bold">Ready to buy?</h2>

          <p className="mt-1 text-xs leading-5 text-paper/70">
            Contact the seller directly about this listing.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3">
            <ChatButton listingId={listing.id} sellerId={sellerId} />
          </div>

          <ContactButtons listingId={listing.id} title={listing.title} />
        </div>
      </section>

      {/* Safety */}
      <section className="mb-6 overflow-hidden rounded-card border-[2px] border-amber/30 bg-amberSoft">
        <div className="flex items-center gap-3 border-b border-amber/20 px-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg">
            🛡️
          </div>

          <div>
            <h2 className="text-sm font-bold text-ink">Stay safe on Bazaa</h2>
            <p className="mt-0.5 text-xs text-muted">
              Simple steps for safer transactions.
            </p>
          </div>
        </div>

        <ul className="space-y-3 px-5 py-4 text-xs leading-5 text-muted">
          {SAFETY_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="font-bold text-amberDeep">✓</span>
              <span>{tip}</span>
            </li>
          ))}
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
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amberDeep">
                You may also like
              </div>

              <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
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
                className="group overflow-hidden rounded-card border-[2px] border-line bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b-[2px] border-line bg-paper">
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
                      {CATEGORY_CONFIG[s.category]?.icon || '📦'}
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <div className="font-serif text-base font-bold text-amberDeep sm:text-lg">
                    {formatPrice(s.price)}
                  </div>

                  <div className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-ink sm:text-sm">
                    {s.title}
                  </div>

                  <div className="mt-2 text-[10px] font-medium text-muted">
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

const SAFETY_TIPS = [
  'Meet in a public place and inspect the item before paying.',
  "Don't send money in advance to someone you haven't met.",
  'Be cautious of requests to move the conversation off this site.',
];

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-bazaa bg-paper p-3">
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted">
        {label}
      </div>

      <div className="mt-1 truncate text-sm font-bold text-ink">{value}</div>
    </div>
  );
} 