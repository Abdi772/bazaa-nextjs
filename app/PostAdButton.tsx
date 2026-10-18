'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

const LABEL: Record<string, string> = {
  English: 'Post an ad',
  Amharic: 'ማስታወቂያ ይለጥፉ',
  Oromo: 'Beeksisa maxxansi',
};

// A clear "Post an ad" button for the header. It shows from tablet size up.
// On small phones the bottom bar already has a Sell button.
export default function PostAdButton() {
  const { language } = useLanguage();

  return (
    <Link
      href="/post"
      className="hidden min-h-[44px] items-center gap-1.5 rounded-full border border-amber px-4 text-sm font-bold text-amber transition-colors hover:bg-amber hover:text-ink sm:inline-flex"
    >
      <span aria-hidden="true" className="text-lg leading-none">
        +
      </span>
      {LABEL[language] ?? LABEL.English}
    </Link>
  );
        }
