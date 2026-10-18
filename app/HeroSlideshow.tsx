 'use client';

import { useEffect, useRef, useState } from 'react';

// Your pictures: public/hero/slide-1.jpg ... slide-10.jpg
const COUNT = 10;
const SLIDE_MS = 5000;
const GOLD = '#F5B041';

// One big picture at a time. The pictures cross-fade and zoom in slowly.
export default function HeroSlideshow({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [missing, setMissing] = useState<number[]>([]);
  const touchStartX = useRef<number | null>(null);

  // Only use pictures that really exist, so a missing file never shows
  // an empty slide.
  const slides = Array.from({ length: COUNT }, (_, i) => i).filter(
    (i) => !missing.includes(i),
  );
  const total = slides.length;
  const current = total > 0 ? index % total : 0;

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(q.matches);
    const onChange = () => setReduceMotion(q.matches);
    q.addEventListener('change', onChange);
    return () => q.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || total < 2) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % total);
    }, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, reduceMotion, total]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () =>
      document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  function go(next: number) {
    if (total === 0) return;
    setIndex((next + total) % total);
  }

  if (total === 0) return null;

  return (
    <div
      className="relative aspect-[2/1] w-full overflow-hidden rounded-none border-0 border-white/10 bg-ink sm:rounded-2xl sm:border shadow-soft sm:aspect-[4/3]"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 45) go(current + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((n, pos) => {
        const active = pos === current;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={n}
            src={`/hero/slide-${n + 1}.jpg`}
            alt=""
            loading={pos === 0 ? 'eager' : 'lazy'}
            decoding="async"
            aria-hidden={!active}
            onError={() => setMissing((m) => (m.includes(n) ? m : [...m, n]))}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
              active ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
            }`}
            style={{ transitionProperty: 'opacity, transform' }}
          />
        );
      })}

      {/* Anything passed in (the small feature chips on phones) */}
      {children}

      {/* Soft shade at the bottom so the dots stay readable */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
        style={{
          background:
            'linear-gradient(to top, rgba(14,17,31,0.65), transparent)',
        }}
      />

      {total > 1 && (
        <div
          className="absolute inset-x-0 bottom-1 flex items-center justify-center"
          role="tablist"
        >
          {slides.map((n, pos) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={pos === current}
              aria-label={`${pos + 1} / ${total}`}
              onClick={() => go(pos)}
              className="flex h-6 items-center px-[3px]"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  pos === current ? 'w-5' : 'w-1.5 bg-white/55'
                }`}
                style={
                  pos === current ? { backgroundColor: GOLD } : undefined
                }
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
