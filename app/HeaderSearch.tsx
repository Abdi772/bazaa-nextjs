'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ETHIOPIA_REGIONS } from '../lib/regions';
import { useLanguage } from './LanguageProvider';

// Region picker + search box that live inside the sticky header,
// so they stay visible while the page scrolls (like Jiji).
// Only shown on the home / listings page ("/").
export default function HeaderSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLanguage();

  const urlQ = params.get('q') ?? '';
  const urlRegion = params.get('region') ?? '';

  const [q, setQ] = useState(urlQ);

  // keep the box in sync when the URL changes (back button, clearing filters)
  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  if (pathname !== '/') return null;

  function changeRegion(value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set('region', value);
    else next.delete('region');
    next.delete('page');
    const qs = next.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = q.trim();
    // A search looks in every category, inside the chosen region.
    const next = new URLSearchParams();
    if (text) next.set('q', text);
    if (urlRegion) next.set('region', urlRegion);
    const qs = next.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

  return (
    <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 pb-3 sm:px-5">
      <div className="relative w-[34%] max-w-[200px] shrink-0">
        <select
          value={urlRegion}
          onChange={(e) => changeRegion(e.target.value)}
          aria-label="Region"
          className="h-11 w-full appearance-none truncate rounded-full border border-white/15 bg-white/10 pl-3.5 pr-8 text-sm font-semibold text-paper outline-none focus:border-amber"
        >
          <option value="" className="text-ink">
            All Ethiopia
          </option>
          {ETHIOPIA_REGIONS.map((r) => (
            <option key={r} value={r} className="text-ink">
              {r}
            </option>
          ))}
        </select>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-paper/70"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <form
        onSubmit={submit}
        role="search"
        className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-white/15 bg-white/10 pl-4 pr-1 focus-within:border-amber focus-within:ring-2 focus-within:ring-amber/40"
      >
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent text-base text-paper outline-none placeholder:text-paper/50"
        />
        <button
          type="submit"
          aria-label={t('search')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-ink transition-colors hover:bg-amberDeep"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </button>
      </form>
    </div>
  );
      }
