 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';

const ICON = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    {
      href: '/',
      label: t('home'),
      icon: (
        <svg
          {...ICON}
          viewBox="0 0 24 24"
          className="h-[21px] w-[21px]"
        >
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      ),
    },
    {
      href: '/',
      label: t('browse'),
      icon: (
        <svg
          {...ICON}
          viewBox="0 0 24 24"
          className="h-[21px] w-[21px]"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      ),
    },
    {
      href: '/post',
      label: t('sell'),
      icon: (
        <svg
          {...ICON}
          viewBox="0 0 24 24"
          className="h-[21px] w-[21px]"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
          />
          <path d="M12 8v8M8 12h8" />
        </svg>
      ),
    },
    {
      href: '/messages',
      label: t('messages'),
      icon: (
        <svg
          {...ICON}
          viewBox="0 0 24 24"
          className="h-[21px] w-[21px]"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      href: '/profile',
      label: t('profile'),
      icon: (
        <svg
          {...ICON}
          viewBox="0 0 24 24"
          className="h-[21px] w-[21px]"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t-[1.5px] border-line bg-white/95 shadow-[0_-4px_16px_rgba(27,26,46,0.06)] backdrop-blur-md md:hidden"
      style={{
        paddingBottom:
          'env(safe-area-inset-bottom)',
      }}
    >
      <div className="mx-auto flex min-h-[68px] max-w-5xl">
        {items.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                active ? 'page' : undefined
              }
              className={`flex min-h-[68px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] leading-4 transition-colors active:bg-amberSoft/60 ${
                active
                  ? 'font-bold text-amberDeep'
                  : 'font-medium text-muted hover:text-ink'
              }`}
            >
              <span
                className={`flex h-9 w-11 items-center justify-center rounded-full transition-all ${
                  active
                    ? 'bg-amberSoft'
                    : 'bg-transparent'
                }`}
              >
                {item.icon}
              </span>

              <span className="max-w-full truncate px-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
