'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { listingSlug, type Listing } from '../../lib/listings';

export default function MyListingsPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setLoggedIn(false);
      setReady(true);
      return;
    }
    const { data, error: err } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', u.user.id)
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    setItems((data as Listing[]) || []);
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: number) {
    if (!confirm('Delete this listing permanently?')) return;
    const { error: err } = await supabase.from('listings').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (!ready) return <p className="py-10 text-center text-gray-500">Loading...</p>;

  if (!loggedIn) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-semibold mb-2">My adverts</h1>
        <p className="text-gray-600">Log in to see your listings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My adverts</h1>
        <Link href="/post" className="bg-amber text-ink font-semibold rounded-lg px-3 py-2 text-sm">
          + New
        </Link>
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {items.length === 0 && (
        <p className="text-muted py-6 text-center">You have no listings yet.</p>
      )}

      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.id} className="bg-white border border-line rounded-xl p-3 flex gap-3">
            <Link href={`/products/${listingSlug(i)}`} className="shrink-0">
              {i.image_url ? (
                <img src={i.image_url} alt="" className="w-20 h-20 object-cover rounded-lg" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100" />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${listingSlug(i)}`}
                className="font-semibold block truncate"
              >
                {i.title}
              </Link>
              <div className="text-amberDeep font-semibold text-sm">
                ETB {Number(i.price).toLocaleString()}
              </div>
              <div className="text-xs text-muted mb-2">{i.location}</div>
              <div className="flex gap-2 text-sm">
                <Link href={`/edit/${i.id}`} className="border border-line rounded-lg px-3 py-1">
                  Edit
                </Link>
                <button
                  onClick={() => remove(i.id)}
                  className="border border-red-300 text-red-700 rounded-lg px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
            }
