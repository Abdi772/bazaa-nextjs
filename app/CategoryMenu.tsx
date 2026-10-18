  'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useLanguage } from './LanguageProvider';
import CategoryTwoPane from './CategoryTwoPane';

// A menu button (three horizontal lines). Tapping it opens the category
// list as a panel over the page, instead of keeping it in a side column.
export default function CategoryMenu(_props: { children?: ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  // The "All categories" tile on the home page opens this panel too.
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener('bazaa-open-categories', openIt);
    return () => window.removeEventListener('bazaa-open-categories', openIt);
  }, []);

  // Close with the Escape key, and stop the page behind from scrolling.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="mb-4 hidden items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold shadow-card hover:shadow-soft md:inline-flex"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {t('categories')}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          {/* Dark area behind the panel. Tap it to close. */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <div
            className="absolute inset-y-0 left-0 flex w-full flex-col bg-surface shadow-soft md:w-[640px]"
            // Tapping any link in the list closes the panel.
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('a')) setOpen(false);
            }}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-serif text-lg font-bold">
                {t('categories')}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-panel"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <CategoryTwoPane />
          </div>
        </div>
      )}
    </>
  );
}
