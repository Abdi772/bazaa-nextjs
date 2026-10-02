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
import ListingActions from '../../ListingActions';

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
      images: listing.image_url ? [listing.image_url] : [],
    },
  };
}

function intlPhone(raw: string) {
  let d = raw.replace(/\D/g, '');

  if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('0')) d = '251' + d.slice(1);
  else if (d.length === 9) d = '251' + d;

  return d;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';

  return `${days} days ago`;
}

export default async function ProductPage({ params }: Props) {
  const listing = await loadListing(params.id);

  if (!listing) notFound();

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
    (listing as unknown as { user_id?: string | null }).user_id ?? null;

  return (
    <div className="mx-auto max-w-2xl">

      {/* Top actions */}
      <div className="mb-4">
        <ListingActions
          listingId={listing.id}
          title={listing.title}
        />
      </div>

      {/* Product gallery */}
      {images.length > 0 && (
        <div className="mb-5 overflow-hidden rounded-card">
          <Gallery
            images={images}
            title={listing.title}
          />
        </div>
      )}

      {/* Product information */}
      <section className="bazaa-card mb-4 p-5">

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="bazaa-title text-2xl leading-tight">
              {listing.title}
            </h1>

            <div className="mt-2 text-2xl font-serif font-bold text-amberDeep">
              ETB {Number(listing.price).toLocaleString()}
            </div>
          </div>

          {listing.condition && (
            <span className="shrink-0 rounded-full border border-green/20 bg-greenSoft px-3 py-1 text-xs font-semibold text-green">
              {listing.condition}
            </span>
          )}
        </div>

        {/* Category / location / date */}
        <div className="mt-4 border-t border-line pt-3 text-xs leading-5 text-muted">
          <span>{listing.category}</span>

          {listing.subcategory && (
            <>
              <span className="mx-1.5">·</span>
              <span>{listing.subcategory}</span>
            </>
          )}

          {listing.brand && (
            <>
              <span className="mx-1.5">·</span>
              <span>{listing.brand}</span>
            </>
          )}

          <span className="mx-1.5">·</span>
          <span>{listing.location}</span>

          {listing.region && (
            <>
              <span className="mx-1.5">·</span>
              <span>{listing.region}</span>
            </>
          )}

          <span className="mx-1.5">·</span>
          <span>{timeAgo(listing.created_at)}</span>
        </div>
      </section>

      {/* Owner actions */}
      <div className="mb-4">
        <OwnerActions id={listing.id} />
      </div>

      {/* Description */}
      <section className="bazaa-card mb-4 p-5">
        <h2 className="bazaa-title mb-3 text-lg">
          Description
        </h2>

        <p className="whitespace-pre-wrap text-sm leading-6 text-ink/90">
          {listing.description}
        </p>
      </section>

      {/* Seller */}
      {sellerId && (
        <Link
          href={`/seller/${sellerId}`}
          className="bazaa-card mb-4 flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-lg font-bold text-paper">
            {(listing.email || '?').charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink">
              Seller
            </div>

            <div className="mt-0.5 text-xs text-muted">
              View all listings from this seller
            </div>
          </div>

          <span className="text-lg text-muted">
            →
          </span>
        </Link>
      )}

      {/* Chat */}
      <div className="mb-3">
        <ChatButton
          listingId={listing.id}
          sellerId={sellerId}
        />
      </div>

      {/* Contact buttons */}
      {listing.phone && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          <a
            href={`tel:${listing.phone.replace(/\s+/g, '')}`}
            className="flex items-center justify-center rounded-bazaa bg-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            📞 Call
          </a>

          <a
            href={`https://wa.me/${intlPhone(
              listing.phone
            )}?text=${encodeURIComponent(
              'Hi, I am interested in: ' + listing.title
            )}`}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center rounded-bazaa bg-[#1FA855] px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            WhatsApp
          </a>
        </div>
      )}

      <a
        href={`mailto:${listing.email}?subject=${encodeURIComponent(
          'Re: ' + listing.title
        )}`}
        className="mb-4 flex items-center justify-center rounded-bazaa bg-ink px-4 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink/90"
      >
        ✉️ Email seller
      </a>

      {/* Favorite */}
      <div className="mb-4 bazaa-card p-3">
        <FavoriteButton listingId={listing.id} />
      </div>

      {/* Report */}
      <div className="mb-5 text-center">
        <ReportButton
          listingId={listing.id}
          title={listing.title}
          ownerId={sellerId}
        />
      </div>

      {/* Safety tips */}
      <section className="mb-6 rounded-card border border-amber/30 bg-amberSoft p-4">
        <h2 className="mb-2 text-sm font-semibold text-ink">
          Safety tips
        </h2>

        <ul className="ml-4 list-disc space-y-1 text-xs leading-5 text-muted">
          <li>
            Meet in a public place and inspect the item before paying.
          </li>

          <li>
            Don&apos;t send money in advance to someone you haven&apos;t met.
          </li>

          <li>
            Be cautious of requests to move the conversation off this site.
          </li>
        </ul>
      </section>

      {/* Similar listings */}
      {similar.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="bazaa-title text-xl">
              Similar listings
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {similar.map((s) => (
              <Link
                key={s.id}
                href={`/products/${listingSlug(s)}`}
                className="bazaa-card overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center bg-paper">
                  {s.image_url ? (
                    <Image
                      src={s.image_url}
                      alt={s.title}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl">
                      {CATEGORY_CONFIG[s.category]?.icon || '📦'}
                    </span>
                  )}
                </div>

                <div className="px-3 pt-2">
                  <div className="text-sm font-bold text-amberDeep">
                    ETB {Number(s.price).toLocaleString()}
                  </div>

                  <div className="truncate pb-3 pt-1 text-xs text-ink">
                    {s.title}
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
