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
    <footer className="mx-auto max-w-5xl px-4 pb-28 pt-2 text-center sm:px-5 md:pb-8">
      <nav
        aria-label="Footer"
        className="bazaa-muted-text flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm font-semibold"
      >
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="underline hover:opacity-70">
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="bazaa-muted-text mt-3 text-xs">© Bazaa</p>
    </footer>
  );
}
