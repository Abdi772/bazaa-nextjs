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
      <div className="mx-auto w-full max-w-2xl">
        <div className="bazaa-card flex min-h-[180px] items-center justify-center p-5 sm:p-6">
          <p className="text-sm text-muted">
            Loading your listings...
          </p>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="bazaa-card p-5 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amberSoft text-2xl">
            🔐
          </div>

          <h1 className="bazaa-title text-2xl">
            My listings
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Log in to see and manage your listings.
          </p>

          <Link
            href="/"
            className="bazaa-primary mt-5 min-h-[48px] w-full px-5 sm:w-auto"
          >
            Go to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="bazaa-title text-2xl sm:text-3xl">
            My listings
          </h1>

          <p className="mt-1 text-sm leading-5 text-muted">
            Manage the items you are selling.
          </p>
        </div>

        <Link
          href="/post"
          className="bazaa-primary min-h-[46px] w-full px-4 py-2.5 text-sm sm:w-auto"
        >
          + New listing
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-card border border-danger/20 bg-dangerSoft px-4 py-3 text-sm leading-5 text-danger">
          {error}
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="bazaa-card p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amberSoft text-2xl">
            📦
          </div>

          <h2 className="bazaa-title text-xl">
            No listings yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Start selling by creating your first listing.
          </p>

          <Link
            href="/post"
            className="bazaa-primary mt-5 min-h-[48px] w-full px-5 sm:w-auto"
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
              className="bazaa-card overflow-hidden p-3 sm:p-4"
            >
              <div className="flex min-w-0 gap-3 sm:gap-4">
                {/* Image */}
                <Link
                  href={`/products/${listingSlug(i)}`}
                  className="shrink-0"
                >
                  {i.image_url ? (
                    <img
                      src={i.image_url}
                      alt=""
                      className="h-[88px] w-[88px] rounded-bazaa object-cover sm:h-24 sm:w-24"
                    />
                  ) : (
                    <div className="flex h-[88px] w-[88px] items-center justify-center rounded-bazaa bg-paper text-2xl sm:h-24 sm:w-24">
                      📦
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${listingSlug(i)}`}
                    className="block line-clamp-2 text-sm font-bold leading-5 text-ink hover:text-amberDeep sm:text-base"
                  >
                    {i.title}
                  </Link>

                  <div className="mt-1.5 font-serif text-base font-bold leading-5 text-amberDeep sm:text-lg">
                    ETB {Number(i.price).toLocaleString()}
                  </div>

                  <div className="mt-1 flex min-w-0 items-center gap-1 text-xs leading-4 text-muted">
                    <span aria-hidden="true">📍</span>

                    <span className="min-w-0 truncate">
                      {i.location}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/edit/${i.id}`}
                      className="bazaa-secondary min-h-[42px] flex-1 px-3 py-2 text-xs sm:flex-none"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => remove(i.id)}
                      className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-bazaa border border-danger/25 bg-dangerSoft px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/10 sm:flex-none"
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
