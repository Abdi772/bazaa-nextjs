'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

const LONG: Record<string, string> = {
  English: 'Post an ad',
  Amharic: 'ማስታወቂያ ይለጥፉ',
  Oromo: 'Beeksisa maxxansi',
};

// Shorter words for small phone screens, so the header still fits.
const SHORT: Record<string, string> = {
  English: 'Post ad',
  Amharic: 'ይለጥፉ',
  Oromo: 'Maxxansi',
};

// A clear "Post an ad" button for the header, on phones and bigger screens.
export default function PostAdButton() {
  const { language } = useLanguage();

  return (
    <Link
      href="/post"
      className="inline-flex min-h-[44px] shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-amber px-3 text-sm font-bold text-amber transition-colors hover:bg-amber hover:text-ink sm:gap-1.5 sm:px-4"
    >
      <span aria-hidden="true" className="text-lg leading-none">
        +
      </span>
      <span className="sm:hidden">{SHORT[language] ?? SHORT.English}</span>
      <span className="hidden sm:inline">{LONG[language] ?? LONG.English}</span>
    </Link>
  );
}
