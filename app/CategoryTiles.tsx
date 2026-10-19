    'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LanguageText from './LanguageText';
import { useLanguage } from './LanguageProvider';
import { categoryImages } from '../lib/categories';

export type CategoryTile = {
  name: string;
  href: string;
  count: number;
  labelKey: string;
  icon?: string;
};

type View = 'large' | 'compact';

const STORAGE_KEY = 'bazaa-category-view';

// Only this many main categories are shown, in one row.
// The last tile ("All categories") shows the rest of them in the same row.
const MAIN_COUNT = 7;

const ALL_LABEL: Record<string, string> = {
  English: 'All categories',
  Amharic: 'ሁሉም ምድቦች',
  Oromo: 'Ramaddii hunda',
};

const POST_LABEL: Record<string, string> = {
  English: 'Post ad',
  Amharic: 'ማስታወቂያ ይለጥፉ',
  Oromo: 'Beeksisa maxxansi',
};

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const SHOW_LESS_LABEL: Record<string, string> = {
  English: 'Show less',
  Amharic: 'አሳንስ',
  Oromo: 'Xiqqeessi',
};

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}

function TileImage({
  tile,
  sizes,
}: {
  tile: CategoryTile;
  sizes: string;
}) {
  const [index, setIndex] = useState(0);
  const srcs = categoryImages(tile.name);

  // If no picture file exists, show the category icon instead
  // of a broken image.
  if (index >= srcs.length) {
    return (
      <span className="flex h-full w-full items-center justify-center text-3xl">
        {tile.icon || '📦'}
      </span>
    );
  }

  return (
    <Image
      key={srcs[index]}
      src={srcs[index]}
      alt={tile.name}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

export default function CategoryTiles({
  items,
}: {
  items: CategoryTile[];
}) {
  const [view, setView] = useState<View>('compact');
  const { language } = useLanguage();
  const allLabel = ALL_LABEL[language] ?? ALL_LABEL.English;
  const postLabel = POST_LABEL[language] ?? POST_LABEL.English;
  const main = items.slice(0, MAIN_COUNT);
  const rest = items.slice(MAIN_COUNT);
  const showLessLabel = SHOW_LESS_LABEL[language] ?? SHOW_LESS_LABEL.English;

  // "All categories" shows the remaining categories in the same row.
  const [expanded, setExpanded] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Slide the row so the newly shown tiles are in view (and back again).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const row = rowRef.current;
    if (!row) return;
    if (expanded) {
      const el = row.querySelector<HTMLElement>('[data-rest-first]');
      if (el) {
        row.scrollTo({
          left: el.offsetLeft - row.offsetLeft - 8,
          behavior: 'smooth',
        });
      }
    } else {
      row.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [expanded]);

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
    `flex h-11 min-w-[44px] items-center justify-center rounded-full px-3.5 text-xs font-bold transition-colors ${
      active
        ? 'bg-amber text-ink'
        : 'text-muted hover:bg-amberSoft'
    }`;

  return (
    <>
      {/* Size control */}
      <div className="mb-3 flex justify-end">
        <div
          className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-card"
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
        <div ref={rowRef} className="mb-8 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:mb-10 md:grid md:grid-cols-8 md:gap-x-2 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          <Link
            href="/post"
            className="group flex w-[76px] shrink-0 snap-start flex-col items-center text-center md:w-auto md:min-w-0"
          >
            <div className="flex aspect-square w-full items-center justify-center rounded-bazaa bg-amber shadow-card">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-amber">
                <PlusIcon className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-1.5 line-clamp-2 text-xs font-bold leading-4 bazaa-text">
              {postLabel}
            </div>
          </Link>

          {main.map((tile, i) => (
            <Link
              key={tile.name}
              href={tile.href}
              className={`group flex w-[76px] shrink-0 snap-start flex-col items-center text-center md:w-auto md:min-w-0 ${
                i >= 6 && !expanded ? 'md:hidden' : ''
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-bazaa border border-line bg-panel shadow-card transition-colors group-hover:border-amber/50">
                <TileImage
                  tile={tile}
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </div>

              <div className="mt-1.5 line-clamp-2 text-xs font-semibold leading-4 bazaa-text">
                <LanguageText k={tile.labelKey} />
              </div>
            </Link>
          ))}

          {expanded &&
            rest.map((tile, i) => (
              <Link
                key={tile.name}
                href={tile.href}
                data-rest-first={i === 0 ? '' : undefined}
                className="group flex w-[76px] shrink-0 snap-start flex-col items-center text-center md:w-auto md:min-w-0"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-bazaa border border-line bg-panel shadow-card transition-colors group-hover:border-amber/50">
                  <TileImage
                    tile={tile}
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </div>

                <div className="mt-1.5 line-clamp-2 text-xs font-semibold leading-4 bazaa-text">
                  <LanguageText k={tile.labelKey} />
                </div>
              </Link>
            ))}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="group flex w-[76px] shrink-0 snap-start flex-col items-center text-center md:w-auto md:min-w-0"
          >
            <div className="flex aspect-square w-full items-center justify-center rounded-bazaa border border-line bg-amberSoft text-amberText shadow-card">
              {expanded ? (
                <CloseIcon className="h-7 w-7" />
              ) : (
                <GridIcon className="h-8 w-8" />
              )}
            </div>

            <div className="mt-1.5 line-clamp-2 text-xs font-semibold leading-4 bazaa-text">
              {expanded ? showLessLabel : allLabel}
            </div>
          </button>
        </div>
      ) : (
        <div ref={rowRef} className="mb-8 flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:mb-10 md:grid md:grid-cols-6 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          <Link
            href="/post"
            className="group flex w-[132px] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-amber bg-amber shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft md:w-auto md:min-w-0"
          >
            <div className="flex aspect-square w-full items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-amber shadow-card">
                <PlusIcon className="h-8 w-8" />
              </span>
            </div>

            <div className="p-2.5 sm:p-3">
              <div className="text-[13px] font-bold leading-5 text-ink sm:text-sm">
                {postLabel}
              </div>
            </div>
          </Link>

          {main.map((tile, i) => (
            <Link
              key={tile.name}
              href={tile.href}
              className={`group w-[132px] shrink-0 snap-start overflow-hidden rounded-card border border-line bazaa-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-soft md:w-auto md:min-w-0 ${
                i >= 4 && !expanded ? 'md:hidden' : ''
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-panel">
                <TileImage
                  tile={tile}
                  sizes="(max-width: 768px) 132px, 16vw"
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

          {expanded &&
            rest.map((tile, i) => (
              <Link
                key={tile.name}
                href={tile.href}
                data-rest-first={i === 0 ? '' : undefined}
                className="group w-[132px] shrink-0 snap-start overflow-hidden rounded-card border border-line bazaa-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-soft md:w-auto md:min-w-0"
              >
                <div className="relative aspect-square overflow-hidden bg-panel">
                  <TileImage
                    tile={tile}
                    sizes="(max-width: 768px) 132px, 16vw"
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

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="group flex w-[132px] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-line bazaa-surface text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-soft md:w-auto md:min-w-0"
          >
            <div className="flex aspect-square w-full items-center justify-center bg-amberSoft text-amberText">
              {expanded ? (
                <CloseIcon className="h-10 w-10" />
              ) : (
                <GridIcon className="h-12 w-12" />
              )}
            </div>

            <div className="p-2.5 sm:p-3">
              <div className="text-[13px] font-semibold leading-5 bazaa-text sm:text-sm">
                {expanded ? showLessLabel : allLabel}
              </div>

              <div className="mt-0.5 text-[11px] text-muted sm:text-xs">
                {items.length}
              </div>
            </div>
          </button>
        </div>
      )}
    </>
  );
}
