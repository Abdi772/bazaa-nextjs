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
          className="hidden rounded-bazaa bg-amber px-3 py-2 font-semibold text-ink transition-colors hover:bg-amberDeep md:inline-flex"
        >
          + Post listing
        </Link>

        <Link
          href="/favorites"
          className="hidden rounded-bazaa border border-white/20 bg-white/5 px-3 py-2 font-medium text-paper transition-colors hover:bg-white/10 md:inline-flex"
        >
          ♥ Saved
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="rounded-bazaa border border-amber/50 px-3 py-2 font-medium text-paper transition-colors hover:border-amber hover:bg-white/5"
          >
            Admin
          </Link>
        )}

        <span className="hidden max-w-[180px] truncate text-paper/70 md:inline">
          {user.email}
        </span>

        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-bazaa border border-white/20 px-3 py-2 font-medium text-paper transition-colors hover:bg-white/10"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-bazaa bg-amber px-3.5 py-2 font-semibold text-ink transition-colors hover:bg-amberDeep"
      >
        Log in / Sign up
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="w-full max-w-sm rounded-card border border-line bg-white p-5 text-ink shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5">
              <h2 className="bazaa-title text-xl">Welcome to Bazaa</h2>
              <p className="mt-1 text-sm text-muted">
                Sign in or create your account to continue.
              </p>
            </div>

            <div className="mb-5 flex rounded-bazaa bg-paper p-1">
              <button
                onClick={() => switchMode('login')}
                className={`flex-1 rounded-[10px] py-2 text-sm font-semibold transition-colors ${
                  mode === 'login'
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Log in
              </button>

              <button
                onClick={() => switchMode('signup')}
                className={`flex-1 rounded-[10px] py-2 text-sm font-semibold transition-colors ${
                  mode === 'signup'
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Sign up
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-bazaa border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {notice && (
              <div className="mb-4 rounded-bazaa border border-green-200 bg-greenSoft p-3 text-sm text-green">
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
                className="bazaa-input"
              />

              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bazaa-input"
              />

              <button
                type="submit"
                disabled={busy}
                className="bazaa-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Log in'
                    : 'Sign up'}
              </button>
            </form>

            <button
              onClick={close}
              className="mt-3 w-full py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
