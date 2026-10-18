'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CATEGORY_CONFIG } from '@/lib/categories';

function buildUrl(category?: string, subcategory?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (subcategory) params.set('subcategory', subcategory);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

// Two columns: the categories on the left, the sub-categories of the
// selected category on the right. Tapping a link goes to that page.
export default function CategoryTwoPane() {
  const names = Object.keys(CATEGORY_CONFIG);
  const [active, setActive] = useState(names[0]);
  const rightRef = useRef<HTMLDivElement>(null);

  // Start at the top of the right column when the category changes.
  useEffect(() => {
    rightRef.current?.scrollTo({ top: 0 });
  }, [active]);

  const config = CATEGORY_CONFIG[active];
  const subs = config ? Object.keys(config.subcategories) : [];

  return (
    <div className="flex min-h-0 flex-1">
      {/* Left: categories */}
      <nav
        aria-label="Categories"
        className="w-[96px] shrink-0 overflow-y-auto border-r border-line bg-panel sm:w-[150px]"
      >
        <Link
          href="/"
          className="flex flex-col items-center gap-1 border-b border-line px-1.5 py-3 text-center text-[11px] font-semibold leading-tight text-muted hover:bg-amberSoft sm:text-xs"
        >
          <span className="text-xl" aria-hidden="true">
            🗂️
          </span>
          All categories
        </Link>

        {names.map((name) => {
          const isActive = name === active;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setActive(name)}
              aria-current={isActive}
              className={`flex w-full flex-col items-center gap-1 border-b border-line border-l-4 px-1.5 py-3 text-center text-[11px] font-semibold leading-tight transition-colors sm:text-xs ${
                isActive
                  ? 'border-l-amber bg-surface text-fg'
                  : 'border-l-transparent text-muted hover:bg-amberSoft'
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {CATEGORY_CONFIG[name].icon}
              </span>
              {name}
            </button>
          );
        })}
      </nav>

      {/* Right: sub-categories of the selected category */}
      <div ref={rightRef} className="min-w-0 flex-1 overflow-y-auto">
        <Link
          href={buildUrl(active)}
          className="flex items-center justify-between gap-2 border-b border-line bg-amberSoft px-4 py-3.5 text-sm font-bold text-fg"
        >
          <span className="min-w-0 truncate">
            {config?.icon} All in {active}
          </span>
          <span aria-hidden="true" className="text-muted">
            ›
          </span>
        </Link>

        {subs.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted">
            No sub-categories here yet.
          </p>
        )}

        {subs.map((sub) => (
          <Link
            key={sub}
            href={buildUrl(active, sub)}
            className="flex items-center justify-between gap-2 border-b border-line px-4 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-amberSoft"
          >
            <span className="min-w-0 truncate">{sub}</span>
            <span aria-hidden="true" className="text-muted">
              ›
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
          }
