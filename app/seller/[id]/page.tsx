  import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { listingSlug } from '@/lib/listings';
import { CATEGORY_CONFIG } from '@/lib/categories';
import LanguageText from '../../LanguageText';
import SellerStatus from '../../SellerStatus';
import Avatar from '../../Avatar';
import SellerFeedback from '../../SellerFeedback';
import Reviews from '../../Reviews';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Seller listings — Bazaa',
};

type Props = { params: { id: string } };

type Row = {
  id: number;
  title: string;
  price: number;
  image_url: string | null;
  location: string | null;
  category: string;
  email: string | null;
  created_at: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SellerPage({ params }: Props) {
  if (!UUID.test(params.id)) notFound();

  const [{ data }, { data: profile }] = await Promise.all([
    supabase
      .from('listings')
      .select('id, title, price, image_url, location, category, created_at')
      .eq('user_id', params.id)
      .or('status.is.null,status.neq.sold')
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', params.id)
      .maybeSingle(),
  ]);

  const items = (data ?? []) as Row[];
  const sellerName = profile?.name ?? null;
  const sellerAvatar = (profile?.avatar_url as string | null) ?? null;
  const since =
    items.length > 0
      ? new Date(items[items.length - 1].created_at).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : null;

  return (
    <div>
      <Link href="/" className="text-sm text-muted underline">
        ← <LanguageText k="back" />
      </Link>

      <div className="flex items-center gap-3 my-4">
        <Avatar name={sellerName ?? 'S'} url={sellerAvatar} className="h-14 w-14 text-xl" />
        <div>
          <div className="font-serif text-xl font-bold">
            {sellerName ?? <LanguageText k="seller" />}
          </div>

          <div className="mt-0.5">
            <SellerStatus sellerId={params.id} />
          </div>

          <div className="text-sm text-muted">
            {items.length}{' '}
            <LanguageText k={items.length === 1 ? 'listing' : 'listings'} />
            {since && (
              <>
                {' · '}
                <LanguageText k="sellingSince" /> {since}
              </>
            )}
          </div>
        </div>
      </div>

      <Reviews sellerId={params.id} />

      <SellerFeedback sellerId={params.id} />

      {items.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <h3 className="text-fg font-semibold mb-2">
            <LanguageText k="noListings" />
          </h3>
          <p>
            <LanguageText k="sellerNoListings" />
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((l) => (
            <Link
              key={l.id}
              href={`/products/${listingSlug(l as unknown as Parameters<typeof listingSlug>[0])}`}
              className="bg-surface border border-line rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-panel flex items-center justify-center relative">
                {l.image_url ? (
                  <Image
                    src={l.image_url}
                    alt={l.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl">{CATEGORY_CONFIG[l.category]?.icon || '📦'}</span>
                )}
              </div>
              <div className="p-3">
                <div className="font-serif font-bold text-amberText">
                  ETB {Number(l.price).toLocaleString()}
                </div>
                <div className="text-sm font-semibold mt-1 line-clamp-1">{l.title}</div>
                <div className="text-xs text-muted mt-1">{l.location}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
