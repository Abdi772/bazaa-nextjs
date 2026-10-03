 'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import AuthButton from './AuthButton';
import BottomNav from './BottomNav';
import BackButton from './BackButton';
import ThemeButton from './ThemeButton';

export type BazaaLanguage = 'English' | 'Amharic' | 'Oromo';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<BazaaLanguage>('English');

  useEffect(() => {
    const saved = localStorage.getItem('bazaa-language');

    if (
      saved === 'English' ||
      saved === 'Amharic' ||
      saved === 'Oromo'
    ) {
      setLanguage(saved);
    }

    function handleLanguageChange() {
      const current = localStorage.getItem('bazaa-language');

      if (
        current === 'English' ||
        current === 'Amharic' ||
        current === 'Oromo'
      ) {
        setLanguage(current);
      }
    }

    window.addEventListener('bazaa-language-change', handleLanguageChange);

    return () => {
      window.removeEventListener(
        'bazaa-language-change',
        handleLanguageChange
      );
    };
  }, []);

  return (
    <html lang={language === 'Amharic' ? 'am' : language === 'Oromo' ? 'om' : 'en'}>
      <body className="bazaa-page min-h-screen antialiased">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-paper">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <div className="flex min-w-0 items-center gap-2">
              <BackButton />

              <Link
                href="/"
                aria-label="Bazaa home"
                className="font-serif text-2xl font-bold tracking-tight"
              >
                Baz<span className="text-amber">aa</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeButton />
              <AuthButton />
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-72px)] max-w-5xl px-5 py-6 pb-24 md:pb-8">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
