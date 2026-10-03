'use client';

import Link from 'next/link';
import ThemeButton from '../ThemeButton';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl">
      {/* Header */}
      <div className="mb-6 border-b-[2px] border-line bg-white px-4 py-5">
        <h1 className="text-2xl font-bold text-ink">
          Settings
        </h1>

        <p className="mt-1 text-sm font-semibold text-muted">
          Manage your Bazaa preferences.
        </p>
      </div>

      {/* Settings menu */}
      <div className="overflow-hidden border-y-[2px] border-line bg-white">

        {/* Theme */}
        <div className="flex min-h-[72px] items-center justify-between border-b-[2px] border-line px-4 py-4">
          <div>
            <div className="font-bold text-ink">
              Appearance
            </div>

            <div className="mt-1 text-sm font-semibold text-muted">
              Change between light and dark mode
            </div>
          </div>

          <ThemeButton />
        </div>

        {/* Account */}
        <Link
          href="/profile"
          className="flex min-h-[64px] items-center justify-between border-b-[2px] border-line px-4 py-4 font-bold text-ink transition-colors hover:bg-amberSoft"
        >
          <span>Account</span>
          <span aria-hidden="true">›</span>
        </Link>

        {/* My adverts */}
        <Link
          href="/my-listings"
          className="flex min-h-[64px] items-center justify-between border-b-[2px] border-line px-4 py-4 font-bold text-ink transition-colors hover:bg-amberSoft"
        >
          <span>My adverts</span>
          <span aria-hidden="true">›</span>
        </Link>

        {/* Saved */}
        <Link
          href="/favorites"
          className="flex min-h-[64px] items-center justify-between border-b-[2px] border-line px-4 py-4 font-bold text-ink transition-colors hover:bg-amberSoft"
        >
          <span>Saved items</span>
          <span aria-hidden="true">›</span>
        </Link>

      </div>

      {/* About */}
      <div className="mt-6 border-y-[2px] border-line bg-white px-4 py-5">
        <h2 className="font-bold text-ink">
          About Bazaa
        </h2>

        <p className="mt-2 text-sm font-semibold leading-6 text-muted">
          Bazaa is a marketplace for buying and selling items in your area.
        </p>
      </div>
    </div>
  );
}
