
'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeButton() {
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bazaa-theme');

    const initial: Theme = saved === 'dark' ? 'dark' : 'light';

    setTheme(initial);
    document.documentElement.dataset.bazaaTheme = initial;
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
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-paper transition-colors hover:bg-white/20 disabled:opacity-60"
    >
      <span aria-hidden="true">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="hidden sm:inline">
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  );
}
