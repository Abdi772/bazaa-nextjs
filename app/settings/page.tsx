 'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeButton from '../ThemeButton';

type SettingKey =
  | 'business'
  | 'phone'
  | 'email'
  | 'language'
  | 'chats'
  | 'feedback'
  | 'notifications'
  | 'password'
  | 'delete';

const row =
  'flex w-full min-h-[68px] items-center justify-between border-b-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-ink transition-colors hover:bg-amberSoft active:bg-amberSoft';

const section =
  'border-y-[2px] border-line bg-white';

export default function SettingsPage() {
  const router = useRouter();
  const [active, setActive] = useState<SettingKey | null>(null);

  function openSetting(setting: SettingKey) {
    setActive(setting);
  }

  function closeSetting() {
    setActive(null);
  }

  const settingInfo: Record<
    SettingKey,
    { title: string; description: string }
  > = {
    business: {
      title: 'Business details',
      description:
        'Business profile settings will be available here.',
    },
    phone: {
      title: 'Add phone number',
      description:
        'Add your phone number to your Bazaa account.',
    },
    email: {
      title: 'Change email',
      description:
        'Your email address can be changed here.',
    },
    language: {
      title: 'Change language',
      description:
        'Choose the language you want to use on Bazaa.',
    },
    chats: {
      title: 'Disable chats',
      description:
        'Control whether other users can contact you through Bazaa chats.',
    },
    feedback: {
      title: 'Disable feedback',
      description:
        'Control feedback and communication preferences.',
    },
    notifications: {
      title: 'Manage notifications',
      description:
        'Choose which Bazaa notifications you want to receive.',
    },
    password: {
      title: 'Change password',
      description:
        'Change the password used to sign in to your Bazaa account.',
    },
    delete: {
      title: 'Delete my account permanently',
      description:
        'This action is permanent. We will add the account deletion process here before allowing it.',
    },
  };

  return (
    <div className="mx-auto max-w-xl">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3 border-b-[2px] border-line bg-white px-2 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-11 w-11 items-center justify-center rounded-full text-3xl font-bold text-amber transition-colors hover:bg-amberSoft active:bg-amberSoft"
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

        <button
          type="button"
          onClick={() => openSetting('business')}
          className={row}
        >
          <span>Business details</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>
      </div>

      {/* Contact */}
      <div className="my-5">
        <div className={section}>
          <button
            type="button"
            onClick={() => openSetting('phone')}
            className={row}
          >
            <span>Add phone number</span>
            <span className="text-3xl font-normal text-muted">›</span>
          </button>

          <button
            type="button"
            onClick={() => openSetting('email')}
            className={row}
          >
            <span>Change email</span>
            <span className="text-3xl font-normal text-muted">›</span>
          </button>

          <button
            type="button"
            onClick={() => openSetting('language')}
            className={row}
          >
            <span>Change language</span>
            <span className="text-3xl font-normal text-muted">›</span>
          </button>
        </div>
      </div>

      {/* Communication */}
      <div className={section}>
        <button
          type="button"
          onClick={() => openSetting('chats')}
          className={row}
        >
          <span>Disable chats</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>

        <button
          type="button"
          onClick={() => openSetting('feedback')}
          className={row}
        >
          <span>Disable feedback</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>

        <button
          type="button"
          onClick={() => openSetting('notifications')}
          className={row}
        >
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
        <button
          type="button"
          onClick={() => openSetting('password')}
          className={row}
        >
          <span>Change password</span>
          <span className="text-3xl font-normal text-muted">›</span>
        </button>

        <button
          type="button"
          onClick={() => openSetting('delete')}
          className="flex min-h-[68px] w-full items-center justify-between border-b-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-red-700 transition-colors hover:bg-red-50 active:bg-red-50"
        >
          <span>Delete my account permanently</span>
          <span className="text-3xl font-normal text-red-400">›</span>
        </button>
      </div>

      {/* Log out */}
      <button
        type="button"
        onClick={() => router.push('/profile')}
        className="mt-5 flex min-h-[68px] w-full items-center justify-between border-y-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-ink transition-colors hover:bg-amberSoft active:bg-amberSoft"
      >
        <span>Log out</span>
        <span className="text-3xl font-normal text-muted">›</span>
      </button>

      <p className="px-4 py-6 text-center text-xs font-semibold text-muted">
        Bazaa Marketplace
      </p>

      {/* Setting panel */}
      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={closeSetting}
        >
          <div
            className="w-full max-w-xl rounded-card border-[2px] border-line bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-ink">
                {settingInfo[active].title}
              </h2>

              <button
                type="button"
                onClick={closeSetting}
                className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-muted hover:bg-paper"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="text-sm font-semibold leading-6 text-muted">
              {settingInfo[active].description}
            </p>

            <button
              type="button"
              onClick={closeSetting}
              className="bazaa-primary mt-5 w-full border-[2px] border-amberDeep font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
        }
