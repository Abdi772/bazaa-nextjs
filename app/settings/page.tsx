 'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeButton from '../ThemeButton';
import { supabase } from '../../lib/supabaseClient';

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

  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  const [phone, setPhone] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState('');

  function openSetting(setting: SettingKey) {
    setActive(setting);
    setEmailMessage('');
    setPhoneMessage('');

    if (setting === 'email') {
      supabase.auth.getUser().then(({ data }) => {
        setCurrentEmail(data.user?.email ?? '');
        setNewEmail('');
      });
    }

    if (setting === 'phone') {
      supabase.auth.getUser().then(({ data }) => {
        setCurrentPhone(data.user?.phone ?? '');
        setPhone('');
      });
    }
  }

  function closeSetting() {
    setActive(null);
    setEmailMessage('');
    setPhoneMessage('');
    setNewEmail('');
    setPhone('');
  }

  async function changeEmail() {
    const email = newEmail.trim();

    if (!email) {
      setEmailMessage('Please enter your new email address.');
      return;
    }

    if (email === currentEmail) {
      setEmailMessage('Please enter a different email address.');
      return;
    }

    setEmailLoading(true);
    setEmailMessage('');

    const { error } = await supabase.auth.updateUser({
      email,
    });

    setEmailLoading(false);

    if (error) {
      setEmailMessage(error.message);
      return;
    }

    setEmailMessage(
      'Check your email for a confirmation link to complete the change.'
    );
  }

  async function addPhone() {
    const value = phone.trim();

    if (!value) {
      setPhoneMessage('Please enter your phone number.');
      return;
    }

    if (value === currentPhone) {
      setPhoneMessage('Please enter a different phone number.');
      return;
    }

    setPhoneLoading(true);
    setPhoneMessage('');

    const { error } = await supabase.auth.updateUser({
      phone: value,
    });

    setPhoneLoading(false);

    if (error) {
      setPhoneMessage(error.message);
      return;
    }

    setPhoneMessage(
      'Your phone number was submitted. If phone verification is enabled, check for the verification code.'
    );

    setCurrentPhone(value);
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
            {/* Add phone number */}
            {active === 'phone' ? (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-ink">
                    Add phone number
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

                {currentPhone && (
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-bold text-ink">
                      Current phone number
                    </label>

                    <div className="rounded-xl border-[2px] border-line bg-paper px-4 py-3 text-sm font-semibold text-muted">
                      {currentPhone}
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="phone-number"
                    className="mb-2 block text-sm font-bold text-ink"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone-number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 9XX XXX XXX"
                    autoComplete="tel"
                    inputMode="tel"
                    className="bazaa-input font-semibold"
                  />
                </div>

                <p className="mt-2 text-xs font-semibold leading-5 text-muted">
                  Use your full international phone number, for example
                  +251 9XX XXX XXX.
                </p>

                {phoneMessage && (
                  <div className="mt-4 rounded-xl border-[2px] border-line bg-amberSoft px-4 py-3 text-sm font-semibold leading-6 text-ink">
                    {phoneMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary flex-1 border-[2px] font-bold"
                    disabled={phoneLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={addPhone}
                    disabled={phoneLoading}
                    className="bazaa-primary flex-1 border-[2px] border-amberDeep font-bold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {phoneLoading ? 'Saving...' : 'Save number'}
                  </button>
                </div>
              </>
            ) : active === 'email' ? (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-ink">
                    Change email
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

                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold text-ink">
                    Current email
                  </label>

                  <div className="rounded-xl border-[2px] border-line bg-paper px-4 py-3 text-sm font-semibold text-muted">
                    {currentEmail || 'Loading...'}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="new-email"
                    className="mb-2 block text-sm font-bold text-ink"
                  >
                    New email address
                  </label>

                  <input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter your new email"
                    autoComplete="email"
                    className="bazaa-input font-semibold"
                  />
                </div>

                {emailMessage && (
                  <div className="mt-4 rounded-xl border-[2px] border-line bg-amberSoft px-4 py-3 text-sm font-semibold leading-6 text-ink">
                    {emailMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary flex-1 border-[2px] font-bold"
                    disabled={emailLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={changeEmail}
                    disabled={emailLoading}
                    className="bazaa-primary flex-1 border-[2px] border-amberDeep font-bold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {emailLoading ? 'Updating...' : 'Update email'}
                  </button>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
             }
