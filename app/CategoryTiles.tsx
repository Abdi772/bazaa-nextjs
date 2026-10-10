'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LanguageText from './LanguageText';

export type CategoryTile = {
  name: string;
  href: string;
  count: number;
  labelKey: string;
  icon?: string;
};

type View = 'large' | 'compact';

const STORAGE_KEY = 'bazaa-category-view';

function TileImage({
  tile,
  sizes,
}: {
  tile: CategoryTile;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);

  // If the picture file is missing, show the category icon instead
  // of a broken image.
  if (failed) {
    return (
      <span className="flex h-full w-full items-center justify-center text-3xl">
        {tile.icon || '📦'}
      </span>
    );
  }

  return (
    <Image
      src={`/categories/${tile.name.toLowerCase()}.jpg`}
      alt={tile.name}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

export default function CategoryTiles({
  items,
}: {
  items: CategoryTile[];
}) {
  const [view, setView] = useState<View>('large');

  // Load the saved choice
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved === 'compact' || saved === 'large') {
        setView(saved);
      }
    } catch {
      // storage not available: keep the default
    }
  }, []);

  function choose(next: View) {
    setView(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  const compact = view === 'compact';

  const toggleClass = (active: boolean) =>
    `flex h-9 min-w-[40px] items-center justify-center rounded-full px-3 text-xs font-bold transition-colors ${
      active
        ? 'bg-amber text-ink'
        : 'text-muted hover:bg-amberSoft'
    }`;

  return (
    <>
      {/* Size control */}
      <div className="mb-3 flex justify-end">
        <div
          className="flex items-center gap-1 rounded-full border border-line bg-surface p-1"
          role="group"
          aria-label="Category size"
        >
          <button
            type="button"
            onClick={() => choose('large')}
            aria-pressed={!compact}
            aria-label="Large cards"
            className={toggleClass(!compact)}
          >
            ▢ Large
          </button>

          <button
            type="button"
            onClick={() => choose('compact')}
            aria-pressed={compact}
            aria-label="Small tiles"
            className={toggleClass(compact)}
          >
            ▦ Small
          </button>
        </div>
      </div>

      {compact ? (
        <div className="mb-8 grid grid-cols-4 gap-x-2 gap-y-4 md:mb-10 md:grid-cols-8">
          {items.map((tile) => (
            <Link
              key={tile.name}
              href={tile.href}
              className="group flex min-w-0 flex-col items-center text-center"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-bazaa bg-panel">
                <TileImage
                  tile={tile}
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </div>

              <div className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-4 bazaa-text">
                <LanguageText k={tile.labelKey} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mb-10 md:grid-cols-6">
          {items.map((tile) => (
            <Link
              key={tile.name}
              href={tile.href}
              className="group min-w-0 overflow-hidden rounded-card border border-line bazaa-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="relative aspect-square overflow-hidden bg-panel">
                <TileImage
                  tile={tile}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                />
              </div>

              <div className="p-2.5 sm:p-3">
                <div className="text-[13px] font-semibold leading-5 bazaa-text sm:text-sm">
                  <LanguageText k={tile.labelKey} />
                </div>

                <div className="mt-0.5 text-[11px] text-muted sm:text-xs">
                  {tile.count}{' '}
                  <LanguageText k="listings" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
              }
