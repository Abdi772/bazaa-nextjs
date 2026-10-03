 'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeButton from '../ThemeButton';

const row =
  'flex w-full min-h-[68px] items-center justify-between border-b-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-ink transition-colors hover:bg-amberSoft';
const section =
  'border-y-[2px] border-line bg-white';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-xl">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3 border-b-[2px] border-line bg-white px-2 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-11 w-11 items-center justify-center rounded-full text-3xl font-bold text-amber transition-colors hover:bg-amberSoft"
        >
          ‹
        </button>

        <h1 className="font-serif text-2xl font-bold text-ink">
          Settings
        </h1>
      </div>

      {/* Account */}
      <div className={section}>
        <Link href="/profile" className={row}>
          <span>Personal details</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </Link>

        <button type="button" className={row}>
          <span>Business details</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>
      </div>

      {/* Contact */}
      <div className="my-5">
        <div className={section}>
          <button type="button" className={row}>
            <span>Add phone number</span>
            <span className="text-3xl font-normal text-muted">›</span>
          </button>

          <button type="button" className={row}>
            <span>Change email</span>
            <span className="text-3xl font-normal text-muted">›</span>
          </button>

          <button type="button" className={row}>
            <span>Change language</span>
            <span className="text-3xl font-normal text-muted">›</span>
          </button>
        </div>
      </div>

      {/* Communication */}
      <div className={section}>
        <button type="button" className={row}>
          <span>Disable chats</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>

        <button type="button" className={row}>
          <span>Disable feedback</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>

        <button type="button" className={row}>
          <span>Manage notifications</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>
      </div>

      {/* Appearance */}
      <div className="my-5">
        <div className="flex min-h-[68px] items-center justify-between border-y-[2px] border-line bg-white px-5 py-4">
          <div>
            <div className="font-bold text-ink">
              Appearance
            </div>

            <div className="mt-1 text-sm font-semibold text-muted">
              Light or dark theme
            </div>
          </div>

          <ThemeButton />
        </div>
      </div>

      {/* Security */}
      <div className={section}>
        <button type="button" className={row}>
          <span>Change password</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>

        <button
          type="button"
          className="flex min-h-[68px] w-full items-center justify-between border-b-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-red-700 transition-colors hover:bg-red-50"
        >
          <span>Delete my account permanently</span>
          <span className="text-3xl font-normal text-red-400">›</span>
        </button>
      </div>

      {/* Log out */}
      <button
        type="button"
        onClick={() => router.push('/profile')}
        className="mt-5 flex min-h-[68px] w-full items-center justify-between border-y-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-ink transition-colors hover:bg-amberSoft"
      >
        <span>Log out</span>
        <span className="text-3xl font-normal text-muted">›</span>
      </button>

      <p className="px-4 py-6 text-center text-xs font-semibold text-muted">
        Bazaa Marketplace
      </p>
    </div>
  );
}
