'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { listingSlug } from '@/lib/listings';

type Fav = {
  id: number;
  title: string;
  price: number;
  image_url: string | null;
};

export default function FavoritesPage() {
  const [state, setState] = useState<'loading' | 'login' | 'ok'>('loading');
  const [items, setItems] = useState<Fav[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) return setState('login');
      const { data, error } = await supabase
        .from('favorites')
        .select('created_at, listings(id, title, price, image_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setError('Could not load favorites: ' + error.message);
        return setState('ok');
      }
      const rows: Fav[] = [];
      (data ?? []).forEach((r: any) => {
        const l = Array.isArray(r.listings) ? r.listings[0] : r.listings;
        if (l) rows.push({ id: l.id, title: l.title, price: l.price, image_url: l.image_url });
      });
      setItems(rows);
      setState('ok');
    })();
  }, []);

  if (state === 'loading') return <p>Loading...</p>;
  if (state === 'login')
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold mb-2">Saved listings</h1>
        <p>Please log in to see your saved listings.</p>
      </div>
    );

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-3">Saved listings</h1>
      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
      {items.length === 0 && !error && (
        <p>You have not saved anything yet. Open a listing and tap Save.</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {items.map((l) => (
          <Link
            key={l.id}
            href={`/products/${listingSlug(l as unknown as Parameters<typeof listingSlug>[0])}`}
            className="bg-white border border-line rounded overflow-hidden"
          >
            <div className="aspect-[4/3] bg-[#EDE7D9] flex items-center justify-center">
              {l.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">📦</span>
              )}
            </div>
            <div className="px-2 pt-1.5 font-bold text-amberDeep text-sm">
              ETB {Number(l.price).toLocaleString()}
            </div>
            <div className="px-2 pb-2 text-xs truncate">{l.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
