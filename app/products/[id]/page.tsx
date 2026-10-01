 import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getListingById, getSimilarListings, idFromSlug, listingSlug } from '@/lib/listings';
import { CATEGORY_CONFIG } from '@/lib/categories';
import Gallery from './Gallery';
import OwnerActions from './OwnerActions';
import ReportButton from '../../ReportButton';

type Props = { params: { id: string } };

async function loadListing(slug: string) {
  const id = idFromSlug(slug);
  if (id == null) return null;
  return getListingById(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await loadListing(params.id);
  if (!listing) return { title: 'Listing not found — Bazaa' };
  return {
    title: `${listing.title} — ETB ${Number(listing.price).toLocaleString()} — Bazaa`,
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

  const images = listing.image_urls?.length ? listing.image_urls : listing.image_url ? [listing.image_url] : [];
  const similar = await getSimilarListings(listing.category, listing.id);

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-muted underline">
        ← Back
      </Link>

      {images.length > 0 && <Gallery images={images} title={listing.title} />}

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-serif font-bold flex-1">{listing.title}</h1>
        {listing.condition && (
          <span className="bg-[#EAF5EC] text-[#2F6B3E] border border-[#B9DDC1] rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap">
            {listing.condition}
          </span>
        )}
      </div>
      <div className="text-2xl font-serif font-bold text-amberDeep mt-1">
        ETB {Number(listing.price).toLocaleString()}
      </div>

      <OwnerActions id={listing.id} />

      <div className="text-xs text-muted border-b border-line pb-3 mb-3">
        {listing.category}
        {listing.subcategory ? ` · ${listing.subcategory}` : ''}
        {listing.brand ? ` · ${listing.brand}` : ''} · {listing.location}
        {listing.region ? `, ${listing.region}` : ''} · {timeAgo(listing.created_at)}
      </div>
      <p className="text-sm whitespace-pre-wrap mb-5">{listing.description}</p>

      {listing.phone && (
        <div className="flex gap-2 mb-2">
          <a href={`tel:${listing.phone.replace(/\s+/g, '')}`} className="flex-1 text-center bg-green text-white rounded py-3 text-sm font-semibold">
            📞 Call
          </a>
          <a
            href={`https://wa.me/${intlPhone(listing.phone)}?text=${encodeURIComponent('Hi, I am interested in: ' + listing.title)}`}
            target="_blank"
            rel="noopener"
            className="flex-1 text-center bg-[#1FA855] text-white rounded py-3 text-sm font-semibold"
          >
            WhatsApp
          </a>
        </div>
      )}
      <a
        href={`mailto:${listing.email}?subject=${encodeURIComponent('Re: ' + listing.title)}`}
        className="block text-center bg-ink text-paper rounded py-3 text-sm font-semibold mb-5"
      >
        ✉️ Email seller
      </a>

      <div className="mb-5 text-center">
        <ReportButton
          listingId={listing.id}
          title={listing.title}
          ownerId={(listing as unknown as { user_id?: string | null }).user_id ?? null}
        />
      </div>

      <div className="bg-[#FFF6E8] border border-[#F0D9A8] rounded-lg p-3 text-xs text-[#6E5620] mb-6">
        <strong>Safety tips</strong>
        <ul className="list-disc ml-4 mt-1 space-y-0.5">
          <li>Meet in a public place and inspect the item before paying.</li>
          <li>Don&apos;t send money in advance to someone you haven&apos;t met.</li>
          <li>Be cautious of requests to move the conversation off this site.</li>
        </ul>
      </div>

      {similar.length > 0 && (
        <div>
          <div className="font-serif font-bold mb-2">Similar listings</div>
          <div className="grid grid-cols-2 gap-3">
            {similar.map((s) => (
              <Link key={s.id} href={`/products/${listingSlug(s)}`} className="bg-white border border-line rounded overflow-hidden">
                <div className="aspect-[4/3] bg-[#EDE7D9] flex items-center justify-center relative">
                  {s.image_url ? (
                    <Image src={s.image_url} alt={s.title} fill sizes="200px" className="object-cover" />
                  ) : (
                    <span className="text-2xl">{CATEGORY_CONFIG[s.category]?.icon || '📦'}</span>
                  )}
                </div>
                <div className="px-2 pt-1.5 font-bold text-amberDeep text-sm">ETB {Number(s.price).toLocaleString()}</div>
                <div className="px-2 pb-2 text-xs truncate">{s.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
