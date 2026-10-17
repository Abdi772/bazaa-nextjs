'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

const SLIDE_MS = 6000;

// Small round category pictures that float gently under the text.
// All files already exist in /public/categories.
const PICTURES = {
  main: ['electronics', 'vehicles', 'property', 'fashion'],
  about: ['home-living', 'beauty-personal-care', 'food-groceries', 'sports-fitness'],
  why: ['agriculture', 'baby-kids', 'books-education', 'animals-pets'],
};

function Pictures({
  names,
  active,
}: {
  names: string[];
  active: boolean;
}) {
  return (
    <div className="flex gap-2.5" aria-hidden="true">
      {names.map((name, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={name}
          src={`/categories/${name}.jpg`}
          alt=""
          width={44}
          height={44}
          loading={active ? 'eager' : 'lazy'}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          className="bazaa-float h-11 w-11 rounded-xl border border-paper/20 object-cover shadow-soft"
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </div>
  );
}

export default function HeroCarousel() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const eyebrow =
    'mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber sm:text-xs';
  const title =
    'mb-3 max-w-xl font-serif text-[28px] font-bold leading-[1.15] tracking-tight sm:text-4xl';
  const text =
    'mb-4 max-w-xl text-sm leading-6 text-paper/75 sm:text-base';

  const slides = [
    {
      id: 'main',
      eyebrow: 'Bazaa Marketplace',
      title: t('buyAndSell'),
      text: t('findWhatYouNeed'),
      extra: (active: boolean) => (
        <Pictures names={PICTURES.main} active={active} />
      ),
      isMain: true,
    },
    {
      id: 'about',
      eyebrow: t('heroEyebrowAbout'),
      title: t('heroAboutTitle'),
      text: t('heroAboutText'),
      extra: (active: boolean) => (
        <Pictures names={PICTURES.about} active={active} />
      ),
    },
    {
      id: 'sell',
      eyebrow: t('heroEyebrowSell'),
      title: t('heroSellTitle'),
      text: '',
      extra: (active: boolean) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {['heroStep1', 'heroStep2', 'heroStep3'].map((k, i) => (
              <span
                key={k}
                className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1.5 text-xs font-medium text-paper sm:text-sm"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber text-[11px] font-bold text-ink">
                  {i + 1}
                </span>
                {t(k)}
              </span>
            ))}
          </div>
          <Link
            href="/post"
            tabIndex={active ? 0 : -1}
            className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-amber hover:underline"
          >
            {t('heroSellCta')} →
          </Link>
        </div>
      ),
    },
    {
      id: 'safe',
      eyebrow: t('heroEyebrowSafe'),
      title: t('heroSafeTitle'),
      text: t('heroSafeText'),
      extra: (active: boolean) => (
        <Link
          href="/safety"
          tabIndex={active ? 0 : -1}
          className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-amber hover:underline"
        >
          {t('heroSafeCta')} →
        </Link>
      ),
    },
    {
      id: 'why',
      eyebrow: t('heroEyebrowWhy'),
      title: t('heroWhyTitle'),
      text: t('heroWhyText'),
      extra: (active: boolean) => (
        <Pictures names={PICTURES.why} active={active} />
      ),
    },
  ];

  // Respect "reduce motion" settings: no auto-advance.
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(q.matches);
    const onChange = () => setReduceMotion(q.matches);
    q.addEventListener('change', onChange);
    return () => q.removeEventListener('change', onChange);
  }, []);

  // Auto-advance. The timer restarts whenever the slide changes,
  // so tapping a dot always gives a full reading time.
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, reduceMotion, slides.length]);

  // Pause while the browser tab is hidden.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () =>
      document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  return (
    <div
      className="mb-5 sm:mb-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      {/* All slides share one grid cell, so the box is as tall as the
          tallest slide and the search box below never jumps. */}
      <div className="grid" aria-roledescription="carousel">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.id}
              aria-hidden={!active}
              className={`[grid-area:1/1] max-w-2xl transition-all duration-700 ease-out ${
                active
                  ? 'visible translate-x-0 opacity-100'
                  : 'pointer-events-none invisible translate-x-6 opacity-0'
              }`}
            >
              <div className={eyebrow}>{s.eyebrow}</div>

              {s.isMain ? (
                <h1 className={title}>{s.title}</h1>
              ) : (
                <div className={title}>{s.title}</div>
              )}

              {s.text ? <p className={text}>{s.text}</p> : null}

              {s.extra(active)}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-1" role="tablist">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1} / ${slides.length}`}
            onClick={() => go(i)}
            className="flex h-6 items-center px-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-6 bg-amber'
                  : 'w-1.5 bg-paper/35'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
    }
        
