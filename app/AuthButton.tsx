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
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else close();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        setError(error.message);
      } else if (data.user && !data.session) {
        setNotice('Account created! Check ' + email + ' for a confirmation link, then come back and log in.');
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
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/post"
          className="bg-amber text-ink font-semibold rounded-md px-3 py-1.5"
        >
          + Post listing
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="border border-white/30 rounded-md px-3 py-1.5"
          >
            Admin
          </Link>
        )}
        <span className="hidden sm:inline opacity-80 truncate max-w-[180px]">{user.email}</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="border border-white/30 rounded-md px-3 py-1.5"
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
        className="bg-amber text-ink font-semibold rounded-md px-3 py-1.5 text-sm"
      >
        Log in / Sign up
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="bg-white text-gray-900 rounded-xl w-full max-w-sm p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => switchMode('login')}
                className={'flex-1 py-2 rounded-md text-sm font-semibold ' + (mode === 'login' ? 'bg-ink text-white' : 'bg-gray-100')}
              >
                Log in
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={'flex-1 py-2 rounded-md text-sm font-semibold ' + (mode === 'signup' ? 'bg-ink text-white' : 'bg-gray-100')}
              >
                Sign up
              </button>
            </div>

            {error && (
              <div className="mb-3 text-sm bg-red-50 border border-red-200 text-red-700 rounded-md p-2">
                {error}
              </div>
            )}
            {notice && (
              <div className="mb-3 text-sm bg-green-50 border border-green-200 text-green-800 rounded-md p-2">
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-amber text-ink font-semibold rounded-md py-2 text-sm disabled:opacity-60"
              >
                {busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
     }
