 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] =
    useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
useEffect(() => {
    const openLogin = () => {
      setMode('login');
      setOpen(true);
    };
    window.addEventListener('bazaa:open-login', openLogin);
    return () => window.removeEventListener('bazaa:open-login', openLogin);
  }, []);
 
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: sub } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
        }
      );

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  function close() {
    setOpen(false);
    setEmail('');
    setPassword('');
    setError('');
    setNotice('');
  }

  function switchMode(m: 'login' | 'signup') {
    setMode(m);
    setError('');
    setNotice('');
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setBusy(true);
    setError('');
    setNotice('');

    if (mode === 'login') {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setError(error.message);
      } else {
        close();
      }
    } else {
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              window.location.origin,
          },
        });

      if (error) {
        setError(error.message);
      } else if (
        data.user &&
        !data.session
      ) {
        setNotice(
          'Account created! Check ' +
            email +
            ' for a confirmation link, then come back and log in.'
        );

        setMode('login');
        setPassword('');
      } else {
        close();
      }
    }

    setBusy(false);
  }

  if (user) {
    return (
      <div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
        <Link
          href="/post"
          className="hidden min-h-[42px] items-center justify-center rounded-bazaa border border-amber bg-amber px-3 py-2 font-bold text-ink transition-colors hover:bg-amberDeep md:inline-flex"
        >
          + Post listing
        </Link>

        <Link
          href="/saved"
          className="hidden min-h-[42px] items-center justify-center rounded-bazaa border border-white/30 bg-white/5 px-3 py-2 font-bold text-paper transition-colors hover:bg-white/10 md:inline-flex"
        >
          ♥ Saved
        </Link>

        <Link
          href="/profile"
          className="flex min-h-[42px] items-center justify-center rounded-bazaa border border-white/30 bg-white/5 px-3 py-2 font-bold text-paper transition-colors hover:border-amber hover:bg-white/10"
        >
          <span className="sm:hidden">
            Profile
          </span>

          <span className="hidden sm:inline">
            Profile
          </span>
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="hidden min-h-[42px] items-center justify-center rounded-bazaa border border-amber/60 px-3 py-2 font-bold text-paper transition-colors hover:border-amber hover:bg-white/10 sm:inline-flex"
          >
            Admin
          </Link>
        )}

        <button
          type="button"
          onClick={() =>
            supabase.auth.signOut()
          }
          className="hidden min-h-[42px] items-center justify-center rounded-bazaa border border-white/30 px-3 py-2 font-bold text-paper transition-colors hover:bg-white/10 sm:inline-flex"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-[44px] rounded-bazaa border border-amber bg-amber px-3 py-2 text-xs font-bold text-ink transition-colors hover:bg-amberDeep sm:px-3.5 sm:text-sm"
      >
        <span className="sm:hidden">
          Log in
        </span>

        <span className="hidden sm:inline">
          Log in / Sign up
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            className="max-h-[calc(100vh-24px)] w-full max-w-sm overflow-y-auto rounded-[18px] border border-line bg-surface p-5 text-fg shadow-soft sm:max-h-[calc(100vh-32px)] sm:p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* Header */}
            <div className="mb-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amberSoft text-xl">
                👋
              </div>

              <h2
                id="auth-title"
                className="bazaa-title text-xl sm:text-2xl"
              >
                Welcome to Bazaa
              </h2>

              <p className="mt-1 text-sm font-semibold leading-5 text-muted">
                Sign in or create your account
                to continue.
              </p>
            </div>

            {/* Login / Signup tabs */}
            <div className="mb-5 flex rounded-bazaa border border-line bg-panel p-1">
              <button
                type="button"
                onClick={() =>
                  switchMode('login')
                }
                className={`min-h-[44px] flex-1 rounded-[10px] px-3 py-2 text-sm font-bold transition-colors ${
                  mode === 'login'
                    ? 'bg-inverse text-onInverse shadow-sm'
                    : 'text-muted hover:text-fg'
                }`}
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() =>
                  switchMode('signup')
                }
                className={`min-h-[44px] flex-1 rounded-[10px] px-3 py-2 text-sm font-bold transition-colors ${
                  mode === 'signup'
                    ? 'bg-inverse text-onInverse shadow-sm'
                    : 'text-muted hover:text-fg'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-bazaa border border-danger/25 bg-dangerSoft p-3 text-sm font-semibold leading-5 text-dangerText"
              >
                {error}
              </div>
            )}

            {/* Notice */}
            {notice && (
              <div
                role="status"
                className="mb-4 rounded-bazaa border border-green/20 bg-greenSoft p-3 text-sm font-semibold leading-5 text-greenText"
              >
                {notice}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3.5"
            >
              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-1.5 block text-sm font-bold text-fg"
                >
                  Email
                </label>

                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="bazaa-input min-h-[48px] font-semibold"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-1.5 block text-sm font-bold text-fg"
                >
                  Password
                </label>

                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={
                    mode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="bazaa-input min-h-[48px] font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="bazaa-primary min-h-[50px] w-full border border-amberDeep font-bold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Log in'
                    : 'Sign up'}
              </button>
            </form>

            {/* Cancel */}
            <button
              type="button"
              onClick={close}
              className="mt-3 min-h-[44px] w-full rounded-bazaa py-2 text-sm font-bold text-muted transition-colors hover:bg-panel hover:text-fg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
         }
