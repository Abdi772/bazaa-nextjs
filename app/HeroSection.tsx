 'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import HeroSlideshow from './HeroSlideshow';

const GOLD = '#F5B041';

// Small gold icons for the four feature items.
function Icon({
  name,
  size = 20,
}: {
  name: 'shield' | 'pin' | 'bolt' | 'chat';
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: GOLD,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (name === 'shield')
    return (
      <svg {...common}>
        <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </svg>
    );
  if (name === 'pin')
    return (
      <svg {...common}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    );
  if (name === 'bolt')
    return (
      <svg {...common}>
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
    </svg>
  );
}

const FEATURES: {
  icon: 'shield' | 'pin' | 'bolt' | 'chat';
  title: string;
  text: string;
}[] = [
  { icon: 'shield', title: 'heroFeat1Title', text: 'heroFeat1Text' },
  { icon: 'pin', title: 'heroFeat2Title', text: 'heroFeat2Text' },
  { icon: 'bolt', title: 'heroFeat3Title', text: 'heroFeat3Text' },
  { icon: 'chat', title: 'heroFeat4Title', text: 'heroFeat4Text' },
];

export default function HeroSection() {
  const { t } = useLanguage();

  // Phones: only a Search button shows until it is tapped, then the
  // typing box opens (bigger screens always show the box).
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // "Buy and sell anything, right in your area." -> two lines:
  // the first part in white, the rest in gold (works for all 3 languages).
  const headline = t('buyAndSell');
  const cut = headline.search(/[,፣]/);
  const first = cut > -1 ? headline.slice(0, cut + 1) : headline;
  const second = cut > -1 ? headline.slice(cut + 1).trim() : '';

  return (
    <section
      className="relative isolate mb-5 overflow-hidden rounded-card px-4 py-4 text-paper shadow-soft sm:px-8 sm:py-9 lg:px-12"
      style={{
        background:
          'radial-gradient(700px 380px at 82% 38%, rgba(245,176,65,0.12), transparent 62%), linear-gradient(135deg, #0E111F 0%, #151829 55%, #1B1A2E 100%)',
      }}
    >
      <div className="grid items-center gap-3 md:grid-cols-[1.05fr_1fr] md:gap-8">
        {/* Your 10 pictures, one at a time: on top on phones,
            on the right on bigger screens */}
        <div className="order-first -mx-4 -mt-4 sm:mx-0 sm:mt-0 md:order-last">
          <HeroSlideshow>
            {/* Phones only: the four small chips on top of the picture */}
            <div className="pointer-events-none absolute inset-x-0 top-2 grid grid-cols-2 justify-items-start gap-x-2 gap-y-1 px-2 sm:hidden">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex max-w-full items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm"
                >
                  <Icon name={f.icon} size={13} />
                  <span className="truncate text-[11px] font-semibold leading-4 text-white">
                    {t(f.title)}
                  </span>
                </div>
              ))}
            </div>
          </HeroSlideshow>
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div
            className="mb-2 hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold sm:inline-flex sm:text-sm"
            style={{
              color: GOLD,
              borderColor: 'rgba(245,176,65,0.4)',
              background: 'rgba(245,176,65,0.1)',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={GOLD}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.6 11.2a1 1 0 001 .8h8.9a1 1 0 001-.8L20 7H6" />
            </svg>
            {t('heroPill')}
          </div>

          <h1 className="sr-only mb-1.5 font-serif text-[34px] font-bold leading-[1.05] tracking-tight sm:not-sr-only sm:text-6xl">
            <span className="text-white">Bazaa </span>
            <span style={{ color: GOLD }}>Marketplace</span>
          </h1>

          <p className="sr-only mb-3 text-xl font-semibold leading-snug text-white sm:not-sr-only sm:mb-2 sm:text-3xl">
            {first}
            {second ? (
              <>
                <br />
                <span style={{ color: GOLD }}>{second}</span>
              </>
            ) : null}
          </p>

          <p className="mb-5 hidden max-w-md text-sm leading-6 text-paper/75 sm:block sm:text-base">
            {t('findWhatYouNeed')}
          </p>

          {!searchOpen && (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-5 text-base font-bold text-ink sm:hidden"
              style={{ background: GOLD }}
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
              {t('search')}
            </button>
          )}

          <form
            action="/"
            method="get"
            className={`${
              searchOpen ? 'flex' : 'hidden sm:flex'
            } items-center gap-2 rounded-full border bg-white/5 p-1.5 pl-4 backdrop-blur-sm`}
            style={{ borderColor: 'rgba(245,176,65,0.55)' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="shrink-0 text-paper/60"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>

            <input
              ref={inputRef}
              type="search"
              name="q"
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-paper outline-none placeholder:text-paper/50"
            />

            <button
              type="submit"
              className="min-h-[44px] shrink-0 rounded-full px-5 text-sm font-bold text-ink transition-colors hover:brightness-95 sm:px-7 sm:text-base"
              style={{ background: GOLD }}
            >
              {t('search')}
            </button>
          </form>
        </div>
      </div>

      {/* Four feature items. Titles only on small phones to save height. */}
      <div className="mt-4 hidden grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4 sm:grid lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
              style={{ background: 'rgba(245,176,65,0.12)' }}
            >
              <Icon name={f.icon} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight text-white sm:text-base">
                {t(f.title)}
              </span>
              <span className="hidden text-xs leading-snug text-paper/65 sm:block sm:text-sm">
                {t(f.text)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
   }
