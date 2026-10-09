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
  'flex w-full min-h-[68px] items-center justify-between border-b border-line bg-surface px-5 py-4 text-left text-[16px] font-bold text-fg transition-colors hover:bg-amberSoft active:bg-amberSoft';

const section =
  'border-y border-line bg-surface';

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

  const [chatsDisabled, setChatsDisabled] =
    useState(false);
  const [feedbackDisabled, setFeedbackDisabled] =
    useState(false);

  const [notifications, setNotifications] =
    useState({
      messages: true,
      listingActivity: true,
      marketing: false,
    });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [passwordLoading, setPasswordLoading] =
    useState(false);
  const [passwordMessage, setPasswordMessage] =
    useState('');

  const [deleteText, setDeleteText] =
    useState('');
  const [deleteLoading, setDeleteLoading] =
    useState(false);
  const [deleteMessage, setDeleteMessage] =
    useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const metadata =
        (data.user?.user_metadata || {}) as {
          business_name?: string;
          business_description?: string;
        };

      setBusinessName(metadata.business_name || '');
      setBusinessDescription(
        metadata.business_description || ''
      );
    });

    const savedChats = localStorage.getItem(
      'bazaa-disable-chats'
    );
    const savedFeedback = localStorage.getItem(
      'bazaa-disable-feedback'
    );
    const savedNotifications = localStorage.getItem(
      'bazaa-notifications'
    );

    setChatsDisabled(savedChats === 'true');
    setFeedbackDisabled(savedFeedback === 'true');

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        if (parsed) {
          setNotifications({
            messages: parsed.messages !== false,
            listingActivity: parsed.listingActivity !== false,
            marketing: parsed.marketing === true,
          });
        }
      } catch {
        // Keep defaults.
      }
    }
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
    setPasswordMessage('');
    setDeleteMessage('');
    setNewEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setDeleteText('');
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

    const { error } =
      await supabase.auth.updateUser({ email });

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

    const { error } =
      await supabase.auth.updateUser({
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
      'Phone number submitted successfully. Complete the verification code if Supabase asks you to verify it.'
    );
  }

  async function saveBusinessDetails() {
    const name = businessName.trim();
    const description =
      businessDescription.trim();

    setBusinessLoading(true);
    setBusinessMessage('');

    const { error } =
      await supabase.auth.updateUser({
        data: {
          business_name: name,
          business_description: description,
        },
      });

    setBusinessLoading(false);

    if (error) {
      setBusinessMessage(
        `Could not save business details: ${error.message}`
      );
      return;
    }

    window.dispatchEvent(
      new Event('bazaa-business-change')
    );

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

  function toggleChats() {
    const next = !chatsDisabled;
    setChatsDisabled(next);
    localStorage.setItem(
      'bazaa-disable-chats',
      String(next)
    );
  }

  function toggleFeedback() {
    const next = !feedbackDisabled;
    setFeedbackDisabled(next);
    localStorage.setItem(
      'bazaa-disable-feedback',
      String(next)
    );
  }

  function updateNotification(
    key: 'messages' | 'listingActivity' | 'marketing'
  ) {
    const next = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(next);
    localStorage.setItem(
      'bazaa-notifications',
      JSON.stringify(next)
    );
  }

  async function changePassword() {
    if (password.length < 6) {
      setPasswordMessage(
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage('');

    const { error } =
      await supabase.auth.updateUser({ password });

    setPasswordLoading(false);

    if (error) {
      setPasswordMessage(error.message);
      return;
    }

    setPasswordMessage(
      'Your password was changed successfully.'
    );
    setPassword('');
    setConfirmPassword('');
  }

  async function requestAccountDeletion() {
    if (deleteText !== 'DELETE') {
      setDeleteMessage(
        'Type DELETE exactly to continue.'
      );
      return;
    }

    setDeleteLoading(true);
    setDeleteMessage('');

    // A permanent Supabase auth deletion needs a secure
    // server-side function/RPC. Never expose a service-role key here.
    setDeleteLoading(false);
    setDeleteMessage(
      'Account deletion requires the secure account-deletion service to be connected. Your account has not been deleted.'
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5 flex items-center gap-3 border-b border-line bg-surface px-2 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-11 w-11 items-center justify-center rounded-full text-3xl font-bold text-amber transition-colors hover:bg-amberSoft active:bg-amberSoft"
        >
          ‹
        </button>

        <h1 className="font-serif text-2xl font-bold text-fg">
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
        <div className="flex min-h-[68px] items-center justify-between border-y border-line bg-surface px-5 py-4">
          <div>
            <div className="font-bold text-fg">
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
          className="flex min-h-[68px] w-full items-center justify-between border-b border-line bg-surface px-5 py-4 text-left text-[16px] font-bold text-red-700 transition-colors hover:bg-red-50 active:bg-red-50"
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
        className="mt-5 flex min-h-[68px] w-full items-center justify-between border-y border-line bg-surface px-5 py-4 text-left text-[16px] font-bold text-fg transition-colors hover:bg-amberSoft active:bg-amberSoft"
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
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            {active === 'business' ? (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-fg">
                    Business details
                  </h2>

                  <button
                    type="button"
                    onClick={closeSetting}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-muted hover:bg-panel"
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
                  className="mb-2 block text-sm font-bold text-fg"
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
                  className="mb-2 mt-4 block text-sm font-bold text-fg"
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
                  <div className="mt-4 rounded-xl border border-green/20 bg-greenSoft px-4 py-3 text-sm font-semibold leading-6 text-greenText">
                    {businessMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary min-h-[48px] flex-1 border font-bold"
                    disabled={businessLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveBusinessDetails}
                    disabled={businessLoading}
                    className="bazaa-primary min-h-[48px] flex-1 border border-amberDeep font-bold disabled:opacity-60"
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
                  <h2 className="font-serif text-xl font-bold text-fg">
                    Add phone number
                  </h2>

                  <button
                    type="button"
                    onClick={closeSetting}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-muted hover:bg-panel"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {currentPhone && (
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-bold text-fg">
                      Current phone number
                    </label>

                    <div className="rounded-xl border border-line bg-panel px-4 py-3 text-sm font-semibold text-muted">
                      {currentPhone}
                    </div>
                  </div>
                )}

                <label
                  htmlFor="phone-number"
                  className="mb-2 block text-sm font-bold text-fg"
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
                  <div className="mt-4 rounded-xl border border-line bg-amberSoft px-4 py-3 text-sm font-semibold leading-6 text-fg">
                    {phoneMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary min-h-[48px] flex-1 border font-bold"
                    disabled={phoneLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={addPhone}
                    disabled={phoneLoading}
                    className="bazaa-primary min-h-[48px] flex-1 border border-amberDeep font-bold disabled:opacity-60"
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
                  <h2 className="font-serif text-xl font-bold text-fg">
                    Change email
                  </h2>

                  <button
                    type="button"
                    onClick={closeSetting}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-muted hover:bg-panel"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <label className="mb-2 block text-sm font-bold text-fg">
                  Current email
                </label>

                <div className="mb-4 rounded-xl border border-line bg-panel px-4 py-3 text-sm font-semibold text-muted">
                  {currentEmail || 'Loading...'}
                </div>

                <label
                  htmlFor="new-email"
                  className="mb-2 block text-sm font-bold text-fg"
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
                  <div className="mt-4 rounded-xl border border-line bg-amberSoft px-4 py-3 text-sm font-semibold leading-6 text-fg">
                    {emailMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary min-h-[48px] flex-1 border font-bold"
                    disabled={emailLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={changeEmail}
                    disabled={emailLoading}
                    className="bazaa-primary min-h-[48px] flex-1 border border-amberDeep font-bold disabled:opacity-60"
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
                  <h2 className="font-serif text-xl font-bold text-fg">
                    Change language
                  </h2>

                  <button
                    type="button"
                    onClick={closeSetting}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-muted hover:bg-panel"
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
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-4 text-[15px] font-bold transition-colors ${
                        language === option
                          ? 'border-amber bg-amberSoft text-amberText'
                          : 'border-line bg-surface text-fg hover:bg-panel'
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
                  <div className="mt-4 rounded-xl border border-line bg-greenSoft px-4 py-3 text-sm font-semibold leading-6 text-greenText">
                    {languageMessage}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={closeSetting}
                    className="bazaa-secondary min-h-[48px] flex-1 border font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveLanguage}
                    className="bazaa-primary min-h-[48px] flex-1 border border-amberDeep font-bold"
                  >
                    Save language
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-fg">
                    {active === 'chats' && 'Disable chats'}
                    {active === 'feedback' && 'Disable feedback'}
                    {active === 'notifications' && 'Manage notifications'}
                    {active === 'password' && 'Change password'}
                    {active === 'delete' && 'Delete my account permanently'}
                  </h2>

                  <button
                    type="button"
                    onClick={closeSetting}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-muted hover:bg-panel"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {active === 'chats' && (
                  <>
                    <div className="rounded-card border border-line bg-panel p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-fg">Buyer messages</div>
                          <p className="mt-1 text-sm leading-5 text-muted">
                            {chatsDisabled
                              ? 'Buyers cannot start new chats with you.'
                              : 'Buyers can contact you through Bazaa.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={toggleChats}
                          aria-pressed={!chatsDisabled}
                          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
                            chatsDisabled ? 'bg-muted' : 'bg-green'
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-6 w-6 rounded-full bg-surface shadow transition-transform ${
                              chatsDisabled ? 'left-1' : 'left-7'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeSetting}
                      className="bazaa-primary mt-5 min-h-[50px] w-full border border-amberDeep font-bold"
                    >
                      Done
                    </button>
                  </>
                )}

                {active === 'feedback' && (
                  <>
                    <div className="rounded-card border border-line bg-panel p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-fg">Feedback messages</div>
                          <p className="mt-1 text-sm leading-5 text-muted">
                            {feedbackDisabled
                              ? 'Feedback messages are disabled.'
                              : 'Feedback messages are enabled.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={toggleFeedback}
                          aria-pressed={!feedbackDisabled}
                          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
                            feedbackDisabled ? 'bg-muted' : 'bg-green'
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-6 w-6 rounded-full bg-surface shadow transition-transform ${
                              feedbackDisabled ? 'left-1' : 'left-7'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeSetting}
                      className="bazaa-primary mt-5 min-h-[50px] w-full border border-amberDeep font-bold"
                    >
                      Done
                    </button>
                  </>
                )}

                {active === 'notifications' && (
                  <>
                    <p className="mb-4 text-sm font-semibold leading-6 text-muted">
                      Choose the notifications you want to receive.
                    </p>
                    <div className="overflow-hidden rounded-card border border-line">
                      <NotificationRow
                        title="Messages"
                        description="New messages from buyers and sellers."
                        checked={notifications.messages}
                        onChange={() => updateNotification('messages')}
                      />
                      <NotificationRow
                        title="Listing activity"
                        description="Updates related to your listings."
                        checked={notifications.listingActivity}
                        onChange={() => updateNotification('listingActivity')}
                      />
                      <NotificationRow
                        title="Bazaa updates"
                        description="Occasional news and marketplace updates."
                        checked={notifications.marketing}
                        onChange={() => updateNotification('marketing')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={closeSetting}
                      className="bazaa-primary mt-5 min-h-[50px] w-full border border-amberDeep font-bold"
                    >
                      Done
                    </button>
                  </>
                )}

                {active === 'password' && (
                  <>
                    <div className="mb-5 rounded-card border border-amber/20 bg-amberSoft p-4">
                      <p className="text-sm font-semibold leading-6 text-fg">
                        Choose a strong password with at least 6 characters.
                      </p>
                    </div>
                    <label htmlFor="new-password" className="mb-2 block text-sm font-bold text-fg">New password</label>
                    <input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" autoComplete="new-password" className="bazaa-input min-h-[50px] font-semibold" />
                    <label htmlFor="confirm-password" className="mb-2 mt-4 block text-sm font-bold text-fg">Confirm new password</label>
                    <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Enter password again" autoComplete="new-password" className="bazaa-input min-h-[50px] font-semibold" />
                    {passwordMessage && (
                      <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold leading-6 ${passwordMessage.includes('successfully') ? 'border-green/20 bg-greenSoft text-greenText' : 'border-danger/20 bg-dangerSoft text-dangerText'}`}>
                        {passwordMessage}
                      </div>
                    )}
                    <div className="mt-5 flex gap-3">
                      <button type="button" onClick={closeSetting} disabled={passwordLoading} className="bazaa-secondary min-h-[50px] flex-1 border font-bold disabled:opacity-50">Cancel</button>
                      <button type="button" onClick={changePassword} disabled={passwordLoading} className="bazaa-primary min-h-[50px] flex-1 border border-amberDeep font-bold disabled:opacity-50">
                        {passwordLoading ? 'Changing...' : 'Change password'}
                      </button>
                    </div>
                  </>
                )}

                {active === 'delete' && (
                  <>
                    <div className="rounded-card border border-danger/25 bg-dangerSoft p-4">
                      <div className="font-bold text-dangerText">This action is permanent.</div>
                      <p className="mt-1 text-sm leading-6 text-dangerText/80">
                        Make sure you really want to continue.
                      </p>
                    </div>
                    <label htmlFor="delete-confirmation" className="mb-2 mt-5 block text-sm font-bold text-fg">Type DELETE to continue</label>
                    <input id="delete-confirmation" type="text" value={deleteText} onChange={(e) => setDeleteText(e.target.value.toUpperCase())} placeholder="DELETE" autoComplete="off" className="bazaa-input min-h-[50px] border-danger/30 font-bold uppercase" />
                    {deleteMessage && (
                      <div className="mt-4 rounded-xl border border-danger/20 bg-dangerSoft px-4 py-3 text-sm font-semibold leading-6 text-dangerText">
                        {deleteMessage}
                      </div>
                    )}
                    <button type="button" onClick={requestAccountDeletion} disabled={deleteLoading || deleteText !== 'DELETE'} className="mt-5 min-h-[52px] w-full rounded-bazaa border border-danger bg-danger px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-40">
                      {deleteLoading ? 'Processing...' : 'Delete my account'}
                    </button>
                    <button type="button" onClick={closeSetting} className="bazaa-secondary mt-2 min-h-[50px] w-full border font-bold">Cancel</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function NotificationRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex min-h-[78px] items-center justify-between gap-4 border-b border-line bg-surface px-4 py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm font-bold text-fg">{title}</div>
        <div className="mt-1 text-xs leading-5 text-muted">{description}</div>
      </div>
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        aria-label={`${title}: ${checked ? 'on' : 'off'}`}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${checked ? 'bg-green' : 'bg-muted'}`}
      >
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-surface shadow transition-transform ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
