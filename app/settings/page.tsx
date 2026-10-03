'use client';

import { useEffect, useState } from 'react';
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

  const [active, setActive] =
    useState<SettingKey | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  const [phone, setPhone] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] =
    useState('');
  const [businessLoading, setBusinessLoading] =
    useState(false);
  const [businessMessage, setBusinessMessage] =
    useState('');

  const [language, setLanguage] = useState('English');
  const [languageMessage, setLanguageMessage] =
    useState('');

  useEffect(() => {
    const savedBusinessName =
      localStorage.getItem('bazaa-business-name') || '';

    const savedBusinessDescription =
      localStorage.getItem(
        'bazaa-business-description'
      ) || '';

    setBusinessName(savedBusinessName);
    setBusinessDescription(savedBusinessDescription);
  }, []);

  function openSetting(setting: SettingKey) {
    setActive(setting);

    setEmailMessage('');
    setPhoneMessage('');
    setBusinessMessage('');
    setLanguageMessage('');

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

    if (setting === 'language') {
      const savedLanguage =
        localStorage.getItem('bazaa-language');

      if (
        savedLanguage === 'English' ||
        savedLanguage === 'Amharic' ||
        savedLanguage === 'Oromo'
      ) {
        setLanguage(savedLanguage);
      } else {
        setLanguage('English');
      }
    }
  }

  function closeSetting() {
    setActive(null);
    setEmailMessage('');
    setPhoneMessage('');
    setBusinessMessage('');
    setLanguageMessage('');
    setNewEmail('');
    setPhone('');
  }

  function normalizePhone(value: string) {
    const cleaned = value
      .trim()
      .replace(/[\s()-]/g, '');

    if (!cleaned) return '';

    if (cleaned.startsWith('+251')) {
      return cleaned;
    }

    if (cleaned.startsWith('00251')) {
      return `+${cleaned.slice(2)}`;
    }

    if (cleaned.startsWith('09')) {
      return `+251${cleaned.slice(1)}`;
    }

    if (cleaned.startsWith('9') && cleaned.length === 9) {
      return `+251${cleaned}`;
    }

    return cleaned;
  }

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    );
  }

  async function changeEmail() {
    const email = newEmail.trim();

    if (!email) {
      setEmailMessage(
        'Please enter your new email address.'
      );
      return;
    }

    if (!isValidEmail(email)) {
      setEmailMessage(
        'Please enter a valid email address.'
      );
      return;
    }

    if (
      currentEmail &&
      email.toLowerCase() === currentEmail.toLowerCase()
    ) {
      setEmailMessage(
        'Please enter a different email address.'
      );
      return;
    }

    setEmailLoading(true);
    setEmailMessage('');

    const { error } = await supabase.auth.updateUser(
      { email },
      {
        emailRedirectTo: window.location.origin,
      }
    );

    setEmailLoading(false);

    if (error) {
      setEmailMessage(
        `Could not update email: ${error.message}`
      );
      return;
    }

    setEmailMessage(
      'Email change submitted. Check your email and open the confirmation link to finish the change.'
    );
  }

  async function addPhone() {
    const normalized = normalizePhone(phone);

    if (!normalized) {
      setPhoneMessage(
        'Please enter your phone number.'
      );
      return;
    }

    if (!/^\+2519\d{8}$/.test(normalized)) {
      setPhoneMessage(
        'Please enter a valid Ethiopian mobile number, for example +251911234567.'
      );
      return;
    }

    const normalizedCurrent =
      normalizePhone(currentPhone);

    if (
      normalizedCurrent &&
      normalized === normalizedCurrent
    ) {
      setPhoneMessage(
        'Please enter a different phone number.'
      );
      return;
    }

    setPhoneLoading(true);
    setPhoneMessage('');

    const { error } = await supabase.auth.updateUser({
      phone: normalized,
    });

    setPhoneLoading(false);

    if (error) {
      setPhoneMessage(
        `Could not update phone number: ${error.message}`
      );
      return;
    }

    setCurrentPhone(normalized);

    setPhoneMessage(
      'Phone number submitted successfully. If phone verification is enabled in Supabase, complete the verification code you receive.'
    );
  }

  function saveBusinessDetails() {
    const name = businessName.trim();
    const description =
      businessDescription.trim();

    setBusinessLoading(true);
    setBusinessMessage('');

    localStorage.setItem(
      'bazaa-business-name',
      name
    );

    localStorage.setItem(
      'bazaa-business-description',
      description
    );

    window.dispatchEvent(
      new Event('bazaa-business-change')
    );

    setBusinessLoading(false);

    setBusinessMessage(
      'Business details saved successfully.'
    );
  }

  function saveLanguage() {
    localStorage.setItem(
      'bazaa-language',
      language
    );

    window.dispatchEvent(
      new Event('bazaa-language-change')
    );

    setLanguageMessage(
      `Language changed to ${language}.`
    );
  }

  return (
    <div className="mx-auto max-w-xl">
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

      <div className={section}>
        <Link
          href="/profile"
          className={row}
        >
          <span>Personal details</span>
          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </Link>

        <button
          type="button"
          onClick={() => openSetting('business')}
          className={row}
        >
          <span>Business details</span>
          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </button>
      </div>

      <div className="my-5">
        <div className={section}>
          <button
            type="button"
            onClick={() => openSetting('phone')}
            className={row}
          >
            <span>Add phone number</span>
            <span className="text-3xl font-normal text-muted">
              ›
            </span>
          </button>

          <button
            type="button"
            onClick={() => openSetting('email')}
            className={row}
          >
            <span>Change email</span>
            <span className="text-3xl font-normal text-muted">
              ›
            </span>
          </button>

          <button
            type="button"
            onClick={() => openSetting('language')}
            className={row}
          >
            <span>Change language</span>
            <span className="text-3xl font-normal text-muted">
              ›
            </span>
          </button>
        </div>
      </div>

      <div className={section}>
        <button
          type="button"
          onClick={() => openSetting('chats')}
          className={row}
        >
          <span>Disable chats</span>
          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => openSetting('feedback')}
          className={row}
        >
          <span>Disable feedback</span>
          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => openSetting('notifications')}
          className={row}
        >
          <span>Manage notifications</span>
          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </button>
      </div>

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

      <div className={section}>
        <button
          type="button"
          onClick={() => openSetting('password')}
          className={row}
        >
          <span>Change password</span>
          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() => openSetting('delete')}
          className="flex min-h-[68px] w-full items-center justify-between border-b-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-red-700 transition-colors hover:bg-red-50 active:bg-red-50"
        >
          <span>
            Delete my account permanently
          </span>

          <span className="text-3xl font-normal text-red-400">
            ›
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/');
          router.refresh();
        }}
        className="mt-5 flex min-h-[68px] w-full items-center justify-between border-y-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-ink transition-colors hover:bg-amberSoft active:bg-amberSoft"
      >
        <span>Log out</span>

        <span className="text-3xl font-normal text-muted">
          ›
        </span>
      </button>

      <p className="px-4 py-6 text-center text-xs font-semibold text-muted">
        Bazaa Marketplace
      </p>

      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={closeSetting}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card border-[2px] border-line bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            {active === 'business' ? (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-ink">
                    Business details
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

                <p className="mb-5 text-sm font-semibold leading-6 text-muted">
                  Add your business information. You can update it anytime.
                </p>

                <label
                  htmlFor="business-name"
                  className="mb-2 block text-sm font-bold text-ink"
                >
                  Business name
                </label>

                <input
                  id="business-name"
                  type="text"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(e.target.value)
                  }
                  placeholder="Enter your business name"
                  autoComplete="organization"
                  className="bazaa-input font-semibold"
                />

                <label
                  htmlFor="business-description"
                  className="mb-2 mt-4 block text-sm font-bold text-ink"
                >
                  Business description
                </label>

                <textarea
                  id="business-description"
                  value={businessDescription}
                  onChange={(e) =>
                    setBusinessDescription(e.target.value)
                  }
                  placeholder="Tell buyers briefly about your business"
                  rows={5}
                  className="bazaa-input min-h-[130px] resize-y font-semibold"
                />

                {businessMessage && (
                  <div className="mt-4 rounded-xl border-[2px] border-green/20 bg-greenSoft px-4 py-3 text-sm font-semibold leading-6 text-green">
                    {businessMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary min-h-[48px] flex-1 border-[2px] font-bold"
                    disabled={businessLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveBusinessDetails}
                    disabled={businessLoading}
                    className="bazaa-primary min-h-[48px] flex-1 border-[2px] border-amberDeep font-bold disabled:opacity-60"
                  >
                    {businessLoading
                      ? 'Saving...'
                      : 'Save details'}
                  </button>
                </div>
              </>
            ) : active === 'phone' ? (
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
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="+251 9XX XXX XXX"
                  autoComplete="tel"
                  inputMode="tel"
                  className="bazaa-input font-semibold"
                />

                <p className="mt-2 text-xs font-semibold leading-5 text-muted">
                  Example: 0911234567 or +251911234567
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
                    className="bazaa-secondary min-h-[48px] flex-1 border-[2px] font-bold"
                    disabled={phoneLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={addPhone}
                    disabled={phoneLoading}
                    className="bazaa-primary min-h-[48px] flex-1 border-[2px] border-amberDeep font-bold disabled:opacity-60"
                  >
                    {phoneLoading
                      ? 'Saving...'
                      : 'Save number'}
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

                <label className="mb-2 block text-sm font-bold text-ink">
                  Current email
                </label>

                <div className="mb-4 rounded-xl border-[2px] border-line bg-paper px-4 py-3 text-sm font-semibold text-muted">
                  {currentEmail || 'Loading...'}
                </div>

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
                  onChange={(e) =>
                    setNewEmail(e.target.value)
                  }
                  placeholder="Enter your new email"
                  autoComplete="email"
                  className="bazaa-input font-semibold"
                />

                <p className="mt-2 text-xs font-semibold leading-5 text-muted">
                  You may need to confirm the new email from your inbox.
                </p>

                {emailMessage && (
                  <div className="mt-4 rounded-xl border-[2px] border-line bg-amberSoft px-4 py-3 text-sm font-semibold leading-6 text-ink">
                    {emailMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary min-h-[48px] flex-1 border-[2px] font-bold"
                    disabled={emailLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={changeEmail}
                    disabled={emailLoading}
                    className="bazaa-primary min-h-[48px] flex-1 border-[2px] border-amberDeep font-bold disabled:opacity-60"
                  >
                    {emailLoading
                      ? 'Updating...'
                      : 'Update email'}
                  </button>
                </div>
              </>
            ) : active === 'language' ? (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-ink">
                    Change language
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

                <p className="mb-4 text-sm font-semibold leading-6 text-muted">
                  Choose the language you want to use on Bazaa.
                </p>

                <div className="space-y-2">
                  {[
                    'English',
                    'Amharic',
                    'Oromo',
                  ].map((option) => (
                    <label
                      key={option}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl border-[2px] px-4 py-4 text-[15px] font-bold transition-colors ${
                        language === option
                          ? 'border-amber bg-amberSoft text-amberDeep'
                          : 'border-line bg-white text-ink hover:bg-paper'
                      }`}
                    >
                      <span>{option}</span>

                      <input
                        type="radio"
                        name="bazaa-language"
                        value={option}
                        checked={language === option}
                        onChange={() =>
                          setLanguage(option)
                        }
                        className="h-5 w-5 accent-amber"
                      />
                    </label>
                  ))}
                </div>

                {languageMessage && (
                  <div className="mt-4 rounded-xl border-[2px] border-line bg-greenSoft px-4 py-3 text-sm font-semibold leading-6 text-green">
                    {languageMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary min-h-[48px] flex-1 border-[2px] font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveLanguage}
                    className="bazaa-primary min-h-[48px] flex-1 border-[2px] border-amberDeep font-bold"
                  >
                    Save language
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-ink">
                    {active === 'chats' &&
                      'Disable chats'}

                    {active === 'feedback' &&
                      'Disable feedback'}

                    {active === 'notifications' &&
                      'Manage notifications'}

                    {active === 'password' &&
                      'Change password'}

                    {active === 'delete' &&
                      'Delete my account permanently'}
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
                  This setting will be available here.
                </p>

                <button
                  type="button"
                  onClick={closeSetting}
                  className="bazaa-primary mt-5 min-h-[48px] w-full border-[2px] border-amberDeep font-bold"
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
