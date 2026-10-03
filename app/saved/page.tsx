 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { supabase } from '../../lib/supabaseClient';
import { CATEGORY_CONFIG } from '../../lib/categories';
import { listingSlug, type Listing } from '../../lib/listings';
import FavoriteButton from '../FavoriteButton';

export default function SavedPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSavedListings();

    function handleFavoriteRemoved(event: Event) {
      const customEvent =
        event as CustomEvent<{ listingId: number }>;

      const removedId = Number(
        customEvent.detail?.listingId
      );

      if (!Number.isFinite(removedId)) {
        return;
      }

      setListings((current) =>
        current.filter(
          (listing) =>
            Number(listing.id) !== removedId
        )
      );
    }

    window.addEventListener(
      'bazaa-favorite-removed',
      handleFavoriteRemoved
    );

    return () => {
      window.removeEventListener(
        'bazaa-favorite-removed',
        handleFavoriteRemoved
      );
    };
  }, []);

  async function loadSavedListings() {
    setLoading(true);
    setError('');

    const { data: sessionData } =
      await supabase.auth.getSession();

    const user = sessionData.session?.user;

    if (!user) {
      setLoggedIn(false);
      setListings([]);
      setLoading(false);
      return;
    }

    setLoggedIn(true);

    const { data: favorites, error: favoritesError } =
      await supabase
        .from('favorites')
        .select('listing_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', {
          ascending: false,
        });

    if (favoritesError) {
      setError(favoritesError.message);
      setLoading(false);
      return;
    }

    if (!favorites || favorites.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }

    const ids = favorites
      .map((favorite) => Number(favorite.listing_id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }

    const { data: listingData, error: listingsError } =
      await supabase
        .from('listings')
        .select('*')
        .in('id', ids);

    if (listingsError) {
      setError(listingsError.message);
      setLoading(false);
      return;
    }

    const listingMap = new Map(
      (listingData || []).map((listing) => [
        Number(listing.id),
        listing as Listing,
      ])
    );

    const orderedListings = ids
      .map((id) => listingMap.get(id))
      .filter(
        (listing): listing is Listing =>
          Boolean(listing)
      );

    setListings(orderedListings);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="bazaa-title text-2xl">
            Saved
          </h1>

          <p className="bazaa-muted mt-1">
            Loading your saved listings...
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-card border border-line bg-white shadow-card"
            >
              <div className="aspect-[4/3] animate-pulse bg-paper" />

              <div className="space-y-2 p-3.5">
                <div className="h-5 w-24 animate-pulse rounded bg-paper" />
                <div className="h-4 w-32 animate-pulse rounded bg-paper" />
                <div className="h-3 w-20 animate-pulse rounded bg-paper" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <div className="rounded-card border border-line bg-white px-6 py-12 text-center shadow-card">
          <div className="mb-4 text-5xl text-amberDeep">
            ♡
          </div>

          <h1 className="bazaa-title text-2xl">
            Saved listings
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Log in to save listings and see them here
            later.
          </p>

          <Link
            href="/"
            className="bazaa-primary mt-6"
          >
            Browse listings
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <div className="rounded-card border border-line bg-white px-6 py-12 text-center shadow-card">
          <div className="mb-3 text-3xl">
            ⚠️
          </div>

          <h1 className="bazaa-title text-xl">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-muted">
            {error}
          </p>

          <button
            type="button"
            onClick={loadSavedListings}
            className="bazaa-primary mt-6"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="bazaa-title text-2xl">
            Saved listings
          </h1>

          <p className="bazaa-muted mt-1">
            {listings.length}{' '}
            {listings.length === 1
              ? 'saved listing'
              : 'saved listings'}
          </p>
        </div>

        <Link
          href="/"
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-amber hover:bg-amberSoft"
        >
          Browse
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
          <div className="mb-4 text-5xl text-amberDeep">
            ♡
          </div>

          <h2 className="font-serif text-xl font-bold text-ink">
            No saved listings yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Tap the heart on a listing you like and
            it will appear here.
          </p>

          <Link
            href="/"
            className="bazaa-primary mt-6"
          >
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/products/${listingSlug(
                listing
              )}`}
              className="group overflow-hidden rounded-card border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-line bg-paper">
                {listing.image_url ? (
                  <Image
                    src={listing.image_url}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-4xl">
                    {CATEGORY_CONFIG[
                      listing.category
                    ]?.icon || '📦'}
                  </span>
                )}

                <div className="absolute right-2.5 top-2.5 z-10">
                  <FavoriteButton
                    listingId={listing.id}
                  />
                </div>
              </div>

              <div className="p-3.5">
                <div className="font-serif text-lg font-bold text-amberDeep">
                  ETB{' '}
                  {Number(
                    listing.price
                  ).toLocaleString()}
                </div>

                <div className="mt-1 line-clamp-1 text-sm font-semibold text-ink">
                  {listing.title}
                </div>

                <div className="mt-1 flex min-w-0 flex-wrap gap-x-1.5 gap-y-1 text-xs text-muted">
                  {listing.brand && (
                    <span>
                      {listing.brand}
                    </span>
                  )}

                  {listing.model && (
                    <>
                      {listing.brand && (
                        <span>•</span>
                      )}

                      <span>
                        {listing.model}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {listing.condition && (
                    <span className="rounded-full bg-amberSoft px-2 py-1 text-[11px] font-semibold text-amberDeep">
                      {listing.condition}
                    </span>
                  )}

                  {listing.location && (
                    <span className="line-clamp-1 text-xs text-muted">
                      {listing.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
