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

    if (err) {
      setError(err.message);
    }

    setItems((data as Listing[]) || []);
    setReady(true);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: number) {
    if (!confirm('Delete this listing permanently?')) return;

    const { error: err } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (err) {
      setError(err.message);
      return;
    }

    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="bazaa-card flex min-h-40 items-center justify-center p-6">
          <p className="text-sm text-muted">
            Loading your listings...
          </p>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="bazaa-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amberSoft text-2xl">
            🔐
          </div>

          <h1 className="bazaa-title text-2xl">
            My listings
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Log in to see and manage your listings.
          </p>

          <Link
            href="/"
            className="bazaa-primary mt-5"
          >
            Go to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="bazaa-title text-2xl">
            My listings
          </h1>

          <p className="mt-1 text-sm text-muted">
            Manage the items you are selling.
          </p>
        </div>

        <Link
          href="/post"
          className="bazaa-primary shrink-0 px-4 py-2.5 text-sm"
        >
          + New listing
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-card border border-danger/20 bg-dangerSoft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bazaa-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amberSoft text-2xl">
            📦
          </div>

          <h2 className="bazaa-title text-xl">
            No listings yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            Start selling by creating your first listing.
          </p>

          <Link
            href="/post"
            className="bazaa-primary mt-5"
          >
            Create a listing
          </Link>
        </div>
      )}

      {/* Listings */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((i) => (
            <div
              key={i.id}
              className="bazaa-card overflow-hidden p-3"
            >
              <div className="flex gap-3">

                {/* Image */}
                <Link
                  href={`/products/${listingSlug(i)}`}
                  className="shrink-0"
                >
                  {i.image_url ? (
                    <img
                      src={i.image_url}
                      alt=""
                      className="h-24 w-24 rounded-bazaa object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-bazaa bg-paper text-2xl">
                      📦
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="min-w-0 flex-1">

                  <Link
                    href={`/products/${listingSlug(i)}`}
                    className="block truncate font-semibold text-ink hover:text-amberDeep"
                  >
                    {i.title}
                  </Link>

                  <div className="mt-1 text-sm font-bold text-amberDeep">
                    ETB {Number(i.price).toLocaleString()}
                  </div>

                  <div className="mt-1 truncate text-xs text-muted">
                    📍 {i.location}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/edit/${i.id}`}
                      className="bazaa-secondary px-3 py-1.5 text-xs"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => remove(i.id)}
                      className="inline-flex items-center justify-center rounded-bazaa border border-danger/25 bg-dangerSoft px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
                      }
