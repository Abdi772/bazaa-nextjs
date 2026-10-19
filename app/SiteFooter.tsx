'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function SiteFooter() {
  const { t } = useLanguage();

  const links = [
    { href: '/safety', label: t('safetyTips') },
    { href: '/terms', label: t('terms') },
    { href: '/privacy', label: t('privacy') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <footer className="mx-auto max-w-6xl px-4 pb-28 pt-4 sm:px-5 md:pb-10">
      <div className="flex flex-col items-center gap-4 border-t border-line pt-6 md:flex-row md:items-start md:justify-between">
        <div className="text-center md:text-left">
          <Link
            href="/"
            aria-label="Bazaa home"
            className="font-serif text-2xl font-bold tracking-tight"
          >
            Baz<span className="text-amberText">aa</span>
          </Link>
          <p className="bazaa-muted-text mt-1 max-w-xs text-sm">
            {t('buyAndSell')}
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="bazaa-muted-text flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="underline decoration-line underline-offset-4 transition-colors hover:text-fg hover:decoration-amber"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <p className="bazaa-muted-text mt-6 text-center text-xs md:text-left">
        © {new Date().getFullYear()} Bazaa. All rights reserved.
      </p>
    </footer>
  );
}
