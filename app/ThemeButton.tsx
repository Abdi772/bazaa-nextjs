  
'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeButton() {
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.bazaaTheme;
    const initial: Theme = current === 'dark' ? 'dark' : 'light';

    setTheme(initial);
    setReady(true);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';

    document.documentElement.dataset.bazaaTheme = next;
    localStorage.setItem('bazaa-theme', next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!ready}
      aria-label={
        theme === 'light'
          ? 'Switch to dark theme'
          : 'Switch to light theme'
      }
      title="Change website theme"
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-paper transition-colors hover:border-amber/60 hover:bg-white/10 disabled:opacity-60 sm:w-auto sm:px-4"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        {theme === 'light' ? (
          <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
      <span className="hidden sm:inline">
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  );
}
