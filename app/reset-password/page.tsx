'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    // If the link is invalid or old, no session appears.
    const timer = setTimeout(() => setExpired(true), 4000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push('/'), 2000);
  }

  return (
    <div className="mx-auto max-w-sm py-8">
      <div className="bazaa-card p-5 sm:p-6">
        <h1 className="bazaa-title text-xl sm:text-2xl">Set a new password</h1>

        {done ? (
          <p
            role="status"
            className="mt-4 rounded-bazaa border border-green/20 bg-greenSoft p-3 text-sm font-semibold text-greenText"
          >
            Your password was changed. Taking you to Bazaa...
          </p>
        ) : ready ? (
          <form onSubmit={onSubmit} className="mt-4 space-y-3.5">
            {error && (
              <div
                role="alert"
                className="rounded-bazaa border border-danger/25 bg-dangerSoft p-3 text-sm font-semibold text-dangerText"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-sm font-bold text-fg"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bazaa-input min-h-[48px] font-semibold"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-bold text-fg"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bazaa-input min-h-[48px] font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="bazaa-primary min-h-[50px] w-full border border-amberDeep font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Please wait...' : 'Save new password'}
            </button>
          </form>
        ) : expired ? (
          <div className="mt-4">
            <p className="text-sm font-semibold leading-6 text-muted">
              This reset link is invalid or has expired. Go back, tap
              "Forgot password?" again, and use the newest email.
            </p>
            <p className="mt-2 break-words text-xs text-muted">
              {typeof window !== 'undefined'
                ? decodeURIComponent(
                    new URLSearchParams(window.location.hash.slice(1)).get(
                      'error_description'
                    ) ?? ''
                  ).replace(/\+/g, ' ')
                : ''}
            </p>
            <Link
              href="/"
              className="bazaa-primary mt-4 min-h-[48px] w-full border border-amberDeep font-bold"
            >
              Back to Bazaa
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm font-semibold text-muted">Checking your link...</p>
        )}
      </div>
    </div>
  );
}
