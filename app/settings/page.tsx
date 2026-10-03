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
  'flex min-h-[68px] w-full items-center justify-between border-b-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-ink transition-colors hover:bg-amberSoft active:bg-amberSoft';

const section =
  'overflow-hidden border-y-[2px] border-line bg-white';

export default function SettingsPage() {
  const router = useRouter();

  const [active, setActive] =
    useState<SettingKey | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] =
    useState('');
  const [emailLoading, setEmailLoading] =
    useState(false);
  const [emailMessage, setEmailMessage] =
    useState('');

  const [phone, setPhone] = useState('');
  const [currentPhone, setCurrentPhone] =
    useState('');
  const [phoneLoading, setPhoneLoading] =
    useState(false);
  const [phoneMessage, setPhoneMessage] =
    useState('');

  const [language, setLanguage] =
    useState('English');
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
    const savedChats =
      localStorage.getItem(
        'bazaa-disable-chats'
      );

    const savedFeedback =
      localStorage.getItem(
        'bazaa-disable-feedback'
      );

    const savedNotifications =
      localStorage.getItem(
        'bazaa-notifications'
      );

    setChatsDisabled(savedChats === 'true');
    setFeedbackDisabled(
      savedFeedback === 'true'
    );

    if (savedNotifications) {
      try {
        const parsed =
          JSON.parse(savedNotifications);

        if (parsed) {
          setNotifications({
            messages:
              parsed.messages !== false,
            listingActivity:
              parsed.listingActivity !== false,
            marketing:
              parsed.marketing === true,
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
    setLanguageMessage('');
    setPasswordMessage('');
    setDeleteMessage('');
    setPassword('');
    setConfirmPassword('');
    setDeleteText('');

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
        localStorage.getItem(
          'bazaa-language'
        );

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
    setLanguageMessage('');
    setPasswordMessage('');
    setDeleteMessage('');
    setNewEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setDeleteText('');
  }

  async function changeEmail() {
    const email = newEmail.trim();

    if (!email) {
      setEmailMessage(
        'Please enter your new email address.'
      );
      return;
    }

    if (email === currentEmail) {
      setEmailMessage(
        'Please enter a different email address.'
      );
      return;
    }

    setEmailLoading(true);
    setEmailMessage('');

    const { error } =
      await supabase.auth.updateUser({
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
      setPhoneMessage(
        'Please enter your phone number.'
      );
      return;
    }

    if (value === currentPhone) {
      setPhoneMessage(
        'Please enter a different phone number.'
      );
      return;
    }

    setPhoneLoading(true);
    setPhoneMessage('');

    const { error } =
      await supabase.auth.updateUser({
        phone: value,
      });

    setPhoneLoading(false);

    if (error) {
      setPhoneMessage(error.message);
      return;
    }

    setPhoneMessage(
      'Your phone number was submitted. If verification is enabled, check for the verification code.'
    );

    setCurrentPhone(value);
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
    key:
      | 'messages'
      | 'listingActivity'
      | 'marketing'
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
      setPasswordMessage(
        'Passwords do not match.'
      );
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage('');

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

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

    /*
      Account deletion must be performed through a
      secure server-side Supabase function/RPC.
      We do not pretend that signing out deletes
      the account.
    */

    setDeleteLoading(false);

    setDeleteMessage(
      'Account deletion requires the secure account-deletion service to be connected. Your account has not been deleted.'
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
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

        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">
            Settings
          </h1>

          <p className="mt-0.5 text-xs font-semibold text-muted">
            Manage your Bazaa account
          </p>
        </div>
      </div>

      {/* Account */}
      <div className={section}>
        <Link
          href="/profile"
          className={row}
        >
          <div>
            <div>Personal details</div>
            <div className="mt-1 text-xs font-semibold text-muted">
              Your profile information
            </div>
          </div>

          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </Link>

        <button
          type="button"
          onClick={() =>
            openSetting('business')
          }
          className={row}
        >
          <div>
            <div>Business details</div>
            <div className="mt-1 text-xs font-semibold text-muted">
              Seller and business information
            </div>
          </div>

          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </button>
      </div>

      {/* Contact */}
      <div className="my-5">
        <div className={section}>
          <button
            type="button"
            onClick={() =>
              openSetting('phone')
            }
            className={row}
          >
            <div>
              <div>Add phone number</div>
              <div className="mt-1 text-xs font-semibold text-muted">
                Make it easier for buyers to contact you
              </div>
            </div>

            <span className="text-3xl font-normal text-muted">
              ›
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              openSetting('email')
            }
            className={row}
          >
            <div>
              <div>Change email</div>
              <div className="mt-1 text-xs font-semibold text-muted">
                Update your account email
              </div>
            </div>

            <span className="text-3xl font-normal text-muted">
              ›
            </span>
          </button>

          {/* Language intentionally kept unchanged */}
          <button
            type="button"
            onClick={() =>
              openSetting('language')
            }
            className={row}
          >
            <div>
              <div>Change language</div>
              <div className="mt-1 text-xs font-semibold text-muted">
                English, Amharic, or Oromo
              </div>
            </div>

            <span className="text-3xl font-normal text-muted">
              ›
            </span>
          </button>
        </div>
      </div>

      {/* Communication */}
      <div className={section}>
        <button
          type="button"
          onClick={() =>
            openSetting('chats')
          }
          className={row}
        >
          <div>
            <div>Disable chats</div>
            <div className="mt-1 text-xs font-semibold text-muted">
              Control whether buyers can message you
            </div>
          </div>

          <span
            className={[
              'relative h-7 w-12 shrink-0 rounded-full transition-colors',
              chatsDisabled
                ? 'bg-muted'
                : 'bg-green',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                chatsDisabled
                  ? 'left-1'
                  : 'left-6',
              ].join(' ')}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            openSetting('feedback')
          }
          className={row}
        >
          <div>
            <div>Disable feedback</div>
            <div className="mt-1 text-xs font-semibold text-muted">
              Control feedback-related messages
            </div>
          </div>

          <span
            className={[
              'relative h-7 w-12 shrink-0 rounded-full transition-colors',
              feedbackDisabled
                ? 'bg-muted'
                : 'bg-green',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                feedbackDisabled
                  ? 'left-1'
                  : 'left-6',
              ].join(' ')}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            openSetting('notifications')
          }
          className={row}
        >
          <div>
            <div>Manage notifications</div>
            <div className="mt-1 text-xs font-semibold text-muted">
              Choose what Bazaa can notify you about
            </div>
          </div>

          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </button>
      </div>

      {/* Appearance */}
      <div className="my-5 overflow-hidden border-y-[2px] border-line bg-white">
        <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 py-4">
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
          onClick={() =>
            openSetting('password')
          }
          className={row}
        >
          <div>
            <div>Change password</div>
            <div className="mt-1 text-xs font-semibold text-muted">
              Keep your account secure
            </div>
          </div>

          <span className="text-3xl font-normal text-muted">
            ›
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            openSetting('delete')
          }
          className="flex min-h-[76px] w-full items-center justify-between border-b-[2px] border-line bg-white px-5 py-4 text-left text-[16px] font-bold text-danger transition-colors hover:bg-dangerSoft active:bg-dangerSoft"
        >
          <div>
            <div>Delete my account permanently</div>
            <div className="mt-1 text-xs font-semibold text-danger/70">
              Permanently remove your account
            </div>
          </div>

          <span className="text-3xl font-normal text-danger/60">
            ›
          </span>
        </button>
      </div>

      {/* Log out intentionally unchanged */}
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

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={closeSetting}
        >
          <div
            className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-card border-[2px] border-line bg-white p-5 shadow-soft sm:p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
                       {/* Language — unchanged functionality */}
            {active === 'language' && (
              <>
                <ModalHeader
                  title="Change language"
                  onClose={closeSetting}
                />

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
                      className={[
                        'flex min-h-[58px] cursor-pointer items-center justify-between rounded-xl border-[2px] px-4 py-3 text-[15px] font-bold',
                        language === option
                          ? 'border-amber bg-amberSoft text-amberDeep'
                          : 'border-line bg-white text-ink',
                      ].join(' ')}
                    >
                      <span>{option}</span>

                      <input
                        type="radio"
                        name="bazaa-language"
                        value={option}
                        checked={
                          language === option
                        }
                        onChange={() =>
                          setLanguage(option)
                        }
                        className="h-5 w-5 accent-amber"
                      />
                    </label>
                  ))}
                </div>

                {languageMessage && (
                  <MessageBox
                    type="success"
                    text={languageMessage}
                  />
                )}

                <ModalButtons
                  onCancel={closeSetting}
                  onConfirm={saveLanguage}
                  confirmText="Save language"
                />
              </>
            )}

            {/* Chats */}
            {active === 'chats' && (
              <>
                <ModalHeader
                  title="Disable chats"
                  onClose={closeSetting}
                />

                <div className="rounded-card border-[2px] border-line bg-paper p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-ink">
                        Buyer messages
                      </div>

                      <p className="mt-1 text-sm leading-5 text-muted">
                        {chatsDisabled
                          ? 'Buyers cannot start new chats with you.'
                          : 'Buyers can contact you through Bazaa.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={toggleChats}
                      aria-pressed={
                        !chatsDisabled
                      }
                      className={[
                        'relative h-8 w-14 shrink-0 rounded-full transition-colors',
                        chatsDisabled
                          ? 'bg-muted'
                          : 'bg-green',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform',
                          chatsDisabled
                            ? 'left-1'
                            : 'left-7',
                        ].join(' ')}
                      />
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold leading-5 text-muted">
                  You can turn this back on at any time.
                </p>

                <button
                  type="button"
                  onClick={closeSetting}
                  className="bazaa-primary mt-5 w-full min-h-[50px] border-[2px] border-amberDeep font-bold"
                >
                  Done
                </button>
              </>
            )}

            {/* Feedback */}
            {active === 'feedback' && (
              <>
                <ModalHeader
                  title="Disable feedback"
                  onClose={closeSetting}
                />

                <div className="rounded-card border-[2px] border-line bg-paper p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-ink">
                        Feedback messages
                      </div>

                      <p className="mt-1 text-sm leading-5 text-muted">
                        {feedbackDisabled
                          ? 'Feedback messages are disabled.'
                          : 'Feedback messages are enabled.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={toggleFeedback}
                      aria-pressed={
                        !feedbackDisabled
                      }
                      className={[
                        'relative h-8 w-14 shrink-0 rounded-full transition-colors',
                        feedbackDisabled
                          ? 'bg-muted'
                          : 'bg-green',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform',
                          feedbackDisabled
                            ? 'left-1'
                            : 'left-7',
                        ].join(' ')}
                      />
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold leading-5 text-muted">
                  This preference is saved on this device.
                </p>

                <button
                  type="button"
                  onClick={closeSetting}
                  className="bazaa-primary mt-5 w-full min-h-[50px] border-[2px] border-amberDeep font-bold"
                >
                  Done
                </button>
              </>
            )}

            {/* Notifications */}
            {active === 'notifications' && (
              <>
                <ModalHeader
                  title="Manage notifications"
                  onClose={closeSetting}
                />

                <p className="mb-4 text-sm font-semibold leading-6 text-muted">
                  Choose the notifications you want to receive.
                </p>

                <div className="overflow-hidden rounded-card border-[2px] border-line">
                  <NotificationRow
                    title="Messages"
                    description="New messages from buyers and sellers."
                    checked={
                      notifications.messages
                    }
                    onChange={() =>
                      updateNotification(
                        'messages'
                      )
                    }
                  />

                  <NotificationRow
                    title="Listing activity"
                    description="Updates related to your listings."
                    checked={
                      notifications.listingActivity
                    }
                    onChange={() =>
                      updateNotification(
                        'listingActivity'
                      )
                    }
                  />

                  <NotificationRow
                    title="Bazaa updates"
                    description="Occasional news and marketplace updates."
                    checked={
                      notifications.marketing
                    }
                    onChange={() =>
                      updateNotification(
                        'marketing'
                      )
                    }
                  />
                </div>

                <div className="mt-5 rounded-card border-[2px] border-green/20 bg-greenSoft px-4 py-3 text-xs font-semibold leading-5 text-green">
                  Your notification preferences are saved automatically.
                </div>

                <button
                  type="button"
                  onClick={closeSetting}
                  className="bazaa-primary mt-5 w-full min-h-[50px] border-[2px] border-amberDeep font-bold"
                >
                  Done
                </button>
              </>
            )}

            {/* Password */}
            {active === 'password' && (
              <>
                <ModalHeader
                  title="Change password"
                  onClose={closeSetting}
                />

                <div className="mb-5 rounded-card border-[2px] border-amber/20 bg-amberSoft p-4">
                  <p className="text-sm font-semibold leading-6 text-ink">
                    Choose a strong password with at least 6 characters.
                  </p>
                </div>

                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-bold text-ink"
                >
                  New password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className="bazaa-input min-h-[50px] font-semibold"
                />

                <label
                  htmlFor="confirm-password"
                  className="mb-2 mt-4 block text-sm font-bold text-ink"
                >
                  Confirm new password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter password again"
                  autoComplete="new-password"
                  className="bazaa-input min-h-[50px] font-semibold"
                />

                {passwordMessage && (
                  <MessageBox
                    type={
                      passwordMessage.includes(
                        'successfully'
                      )
                        ? 'success'
                        : 'error'
                    }
                    text={passwordMessage}
                  />
                )}

                <ModalButtons
                  onCancel={closeSetting}
                  onConfirm={changePassword}
                  confirmText={
                    passwordLoading
                      ? 'Changing...'
                      : 'Change password'
                  }
                  disabled={passwordLoading}
                />
              </>
            )}

            {/* Delete */}
            {active === 'delete' && (
              <>
                <ModalHeader
                  title="Delete my account permanently"
                  onClose={closeSetting}
                />

                <div className="rounded-card border-[2px] border-danger/25 bg-dangerSoft p-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg">
                      ⚠️
                    </div>

                    <div>
                      <div className="font-bold text-danger">
                        This action is permanent.
                      </div>

                      <p className="mt-1 text-sm leading-6 text-danger/80">
                        Account deletion should remove your account and associated data. Make sure you really want to continue.
                      </p>
                    </div>
                  </div>
                </div>

                <label
                  htmlFor="delete-confirmation"
                  className="mb-2 mt-5 block text-sm font-bold text-ink"
                >
                  Type DELETE to continue
                </label>

                <input
                  id="delete-confirmation"
                  type="text"
                  value={deleteText}
                  onChange={(e) =>
                    setDeleteText(
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="DELETE"
                  autoComplete="off"
                  className="bazaa-input min-h-[50px] border-danger/30 font-bold uppercase"
                />

                {deleteMessage && (
                  <MessageBox
                    type="error"
                    text={deleteMessage}
                  />
                )}

                <button
                  type="button"
                  onClick={requestAccountDeletion}
                  disabled={
                    deleteLoading ||
                    deleteText !== 'DELETE'
                  }
                  className="mt-5 min-h-[52px] w-full rounded-bazaa border-[2px] border-danger bg-danger px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleteLoading
                    ? 'Processing...'
                    : 'Delete my account'}
                </button>

                <button
                  type="button"
                  onClick={closeSetting}
                  className="bazaa-secondary mt-2 min-h-[50px] w-full border-[2px] font-bold"
                >
                  Cancel
                </button>
              </>
            )}

            {/* Existing business placeholder */}
            {active === 'business' && (
              <>
                <ModalHeader
                  title="Business details"
                  onClose={closeSetting}
                />

                <p className="text-sm font-semibold leading-6 text-muted">
                  Business details can be added here when you are ready to support seller business profiles.
                </p>

                <button
                  type="button"
                  onClick={closeSetting}
                  className="bazaa-primary mt-5 w-full min-h-[50px] border-[2px] border-amberDeep font-bold"
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

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <h2 className="max-w-[85%] font-serif text-xl font-bold leading-7 text-ink sm:text-2xl">
        {title}
      </h2>

      <button
        type="button"
        onClick={onClose}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-muted transition-colors hover:bg-paper"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

function ModalButtons({
  onCancel,
  onConfirm,
  confirmText,
  disabled = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-5 flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="bazaa-secondary min-h-[50px] flex-1 border-[2px] font-bold disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="bazaa-primary min-h-[50px] flex-1 border-[2px] border-amberDeep font-bold disabled:opacity-50"
      >
        {confirmText}
      </button>
    </div>
  );
}

function MessageBox({
  type,
  text,
}: {
  type: 'success' | 'error';
  text: string;
}) {
  return (
    <div
      className={[
        'mt-4 rounded-xl border-[2px] px-4 py-3 text-sm font-semibold leading-6',
        type === 'success'
          ? 'border-green/20 bg-greenSoft text-green'
          : 'border-danger/20 bg-dangerSoft text-danger',
      ].join(' ')}
    >
      {text}
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
    <div className="flex min-h-[78px] items-center justify-between gap-4 border-b-[2px] border-line bg-white px-4 py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm font-bold text-ink">
          {title}
        </div>

        <div className="mt-1 text-xs leading-5 text-muted">
          {description}
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        aria-label={`${title}: ${
          checked ? 'on' : 'off'
        }`}
        className={[
          'relative h-8 w-14 shrink-0 rounded-full transition-colors',
          checked ? 'bg-green' : 'bg-muted',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform',
            checked ? 'left-7' : 'left-1',
          ].join(' ')}
        />
      </button>
    </div>
  );
                   }
