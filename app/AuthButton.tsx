 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setError(error.message);
      else close();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user && !data.session) {
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
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <Link
          href="/post"
          className="hidden rounded-bazaa border-[2px] border-amber bg-amber px-3 py-2 font-bold text-ink transition-colors hover:bg-amberDeep md:inline-flex"
        >
          + Post listing
        </Link>

        <Link
          href="/favorites"
          className="hidden rounded-bazaa border-[2px] border-white/30 bg-white/5 px-3 py-2 font-bold text-paper transition-colors hover:bg-white/10 md:inline-flex"
        >
          ♥ Saved
        </Link>

        <Link
          href="/profile"
          className="rounded-bazaa border-[2px] border-white/30 bg-white/5 px-3 py-2 font-bold text-paper transition-colors hover:border-amber hover:bg-white/10"
        >
          Profile
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="hidden rounded-bazaa border-[2px] border-amber/60 px-3 py-2 font-bold text-paper transition-colors hover:border-amber hover:bg-white/10 sm:inline-flex"
          >
            Admin
          </Link>
        )}

        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="hidden rounded-bazaa border-[2px] border-white/30 px-3 py-2 font-bold text-paper transition-colors hover:bg-white/10 sm:inline-flex"
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
        className="rounded-bazaa border-[2px] border-amber bg-amber px-3.5 py-2 font-bold text-ink transition-colors hover:bg-amberDeep"
      >
        Log in / Sign up
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="w-full max-w-sm rounded-card border-[2px] border-line bg-white p-5 text-ink shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5">
              <h2 className="bazaa-title text-xl">
                Welcome to Bazaa
              </h2>

              <p className="mt-1 text-sm font-semibold text-muted">
                Sign in or create your account to continue.
              </p>
            </div>

            <div className="mb-5 flex rounded-bazaa border-[2px] border-line bg-paper p-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 rounded-[10px] py-2 text-sm font-bold transition-colors ${
                  mode === 'login'
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 rounded-[10px] py-2 text-sm font-bold transition-colors ${
                  mode === 'signup'
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Sign up
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-bazaa border-[2px] border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {notice && (
              <div className="mb-4 rounded-bazaa border-[2px] border-green-200 bg-greenSoft p-3 text-sm font-semibold text-green">
                {notice}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bazaa-input font-semibold"
              />

              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bazaa-input font-semibold"
              />

              <button
                type="submit"
                disabled={busy}
                className="bazaa-primary w-full border-[2px] border-amberDeep font-bold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Log in'
                    : 'Sign up'}
              </button>
            </form>

            <button
              type="button"
              onClick={close}
              className="mt-3 w-full py-2 text-sm font-bold text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
