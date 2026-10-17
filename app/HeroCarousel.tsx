 'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

const SLIDE_MS = 6500;

// Where each picture is anchored when the hero is narrower than the photo.
const POSITIONS = ['center', 'center', 'center top', 'center', 'center'];

// Text colors, one per slide. All are bright enough on the dark hero.
const ACCENTS = [
  '#f0b452', // amber
  '#5fd38d', // green
  '#6ec3f4', // sky blue
  '#ff8a7a', // coral
  '#b9a4f5', // lilac
];

// Shown behind each picture. If a picture file is missing, this soft
// gradient stays visible instead.
const FALLBACKS = [
  'linear-gradient(135deg, #5a4220 0%, #2a2540 100%)',
  'linear-gradient(135deg, #1f5a3d 0%, #2a2540 100%)',
  'linear-gradient(135deg, #1f4a66 0%, #2a2540 100%)',
  'linear-gradient(135deg, #6a3328 0%, #2a2540 100%)',
  'linear-gradient(135deg, #3f3470 0%, #2a2540 100%)',
];

export default function HeroCarousel() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const titleClass =
    'mb-1.5 font-sans text-[22px] font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[32px]';
  const textClass =
    'mb-2.5 text-[13px] leading-5 text-paper/90 sm:text-[15px] sm:leading-6';

  const slides = [
    {
      id: 'main',
      eyebrow: 'Bazaa Marketplace',
      title: t('buyAndSell'),
      text: t('findWhatYouNeed'),
      extra: (_active: boolean, _color: string) => null,
      isMain: true,
    },
    {
      id: 'about',
      eyebrow: t('heroEyebrowAbout'),
      title: t('heroAboutTitle'),
      text: t('heroAboutText'),
      extra: (_active: boolean, _color: string) => null,
    },
    {
      id: 'sell',
      eyebrow: t('heroEyebrowSell'),
      title: t('heroSellTitle'),
      text: '',
      extra: (active: boolean, color: string) => (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {['heroStep1', 'heroStep2', 'heroStep3'].map((k, i) => (
              <span
                key={k}
                className="inline-flex items-center gap-1.5 rounded-full bg-paper/10 px-3 py-1.5 text-xs font-medium text-paper sm:text-sm"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-ink"
                  style={{ backgroundColor: color }}
                >
                  {i + 1}
                </span>
                {t(k)}
              </span>
            ))}
          </div>
          <Link
            href="/post"
            tabIndex={active ? 0 : -1}
            className="inline-flex w-fit items-center gap-1 text-sm font-semibold hover:underline"
            style={{ color }}
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
      extra: (active: boolean, color: string) => (
        <Link
          href="/safety"
          tabIndex={active ? 0 : -1}
          className="inline-flex w-fit items-center gap-1 text-sm font-semibold hover:underline"
          style={{ color }}
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
      extra: (_active: boolean, _color: string) => null,
    },
  ];

  // Respect "reduce motion" settings: no auto-advance, no zoom.
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
      className="mb-3 sm:mb-4"
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
      {/* Full-hero pictures. These sit behind everything in the hero card
          (including the search box), so the hero section must be
          "relative isolate". They cross-fade as the slides change. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-out ${
                active ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ background: FALLBACKS[i] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/hero/slide-${i + 1}.jpg`}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className={`h-full w-full object-cover ${
                  active && !reduceMotion ? 'bazaa-zoom' : ''
                }`}
                style={{
                  objectPosition: POSITIONS[i],
                  animationDuration: `${SLIDE_MS + 1500}ms`,
                }}
              />
            </div>
          );
        })}
        {/* Dark shade so the text and search box stay easy to read. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14132a] from-35% via-[#14132a]/80 via-65% to-[#14132a]/10" />
      </div>

      {/* All slides share one grid cell, so the box is as tall as the
          tallest slide and the search box below never jumps. */}
      <div className="grid" aria-roledescription="carousel">
        {slides.map((s, i) => {
          const active = i === index;
          const color = ACCENTS[i];
          return (
            <div
              key={s.id}
              aria-hidden={!active}
              className={`[grid-area:1/1] pt-28 transition-all duration-700 ease-out sm:pt-32 ${
                active
                  ? 'visible translate-x-0 opacity-100'
                  : 'pointer-events-none invisible translate-x-6 opacity-0'
              }`}
            >
              <div className="min-w-0">
                <div
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm sm:text-xs"
                  style={{ color }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {s.eyebrow}
                </div>

                {s.isMain ? (
                  <h1 className={titleClass} style={{ color }}>
                    {s.title}
                  </h1>
                ) : (
                  <div className={titleClass} style={{ color }}>
                    {s.title}
                  </div>
                )}

                {s.text ? <p className={textClass}>{s.text}</p> : null}

                {s.extra(active, color)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-center gap-1" role="tablist">
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
                i === index ? 'w-6' : 'w-1.5 bg-paper/35'
              }`}
              style={i === index ? { backgroundColor: ACCENTS[i] } : undefined}
            />
          </button>
        ))}
      </div>
    </div>
  );
               }
                 
