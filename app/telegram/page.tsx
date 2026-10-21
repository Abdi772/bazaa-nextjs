'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

export default function TelegramAlertsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [linked, setLinked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadStatus = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('telegram_links')
      .select('chat_id')
      .eq('user_id', uid)
      .maybeSingle();
    setLinked(!!data?.chat_id);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) await loadStatus(data.user.id);
      setReady(true);
    });
  }, [loadStatus]);

  // When the seller comes back from Telegram, check again.
  useEffect(() => {
    if (!user) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') loadStatus(user.id);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user, loadStatus]);

  async function connect() {
    setError('');
    setBusy(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('login');

      const res = await fetch('/api/telegram/connect', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) {
        setError(json.error ?? 'Could not connect. Please try again.');
      } else {
        window.location.href = json.url;
      }
    } catch {
      setError('Could not connect. Please log in again and retry.');
    }
    setBusy(false);
  }

  async function disconnect() {
    if (!user) return;
    setBusy(true);
    setError('');
    const { error: delErr } = await supabase
      .from('telegram_links')
      .delete()
      .eq('user_id', user.id);
    if (delErr) setError('Could not disconnect. Please try again.');
    else setLinked(false);
    setBusy(false);
  }

  if (!ready) {
    return (
      <p className="py-10 text-center text-sm font-semibold text-muted">
        Loading...
      </p>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <h1 className="mb-2 text-xl font-bold text-fg">Telegram alerts</h1>
        <p className="text-sm font-semibold leading-6 text-muted">
          Log in to get message alerts on Telegram.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/profile" className="text-sm text-muted underline">
        ← Back to profile
      </Link>

      <h1 className="mt-4 text-xl font-bold text-fg">Telegram alerts</h1>
      <p className="mt-1 text-sm leading-6 text-muted">
        Get a Telegram message when someone writes to you on Jimma, so you never
        miss a buyer. You get one alert for each new conversation or unread
        run of messages, not one for every message.
      </p>

      <div className="mt-5 rounded-card border border-line bg-surface p-5 shadow-card">
        {linked ? (
          <>
            <div className="font-bold text-fg">✅ Connected</div>
            <p className="mt-1 text-sm text-muted">
              Alerts are on. They show a short preview of the message.
            </p>
            <button
              type="button"
              onClick={disconnect}
              disabled={busy}
              className="mt-4 min-h-[44px] w-full rounded-bazaa border border-line px-4 text-sm font-bold text-fg disabled:opacity-60"
            >
              {busy ? 'Please wait...' : 'Turn off alerts'}
            </button>
          </>
        ) : (
          <>
            <div className="font-bold text-fg">Not connected</div>
            <p className="mt-1 text-sm text-muted">
              Tap Connect, then tap <b>Start</b> in Telegram. Then come back
              here.
            </p>
            <button
              type="button"
              onClick={connect}
              disabled={busy}
              className="bazaa-primary mt-4 min-h-[50px] w-full border border-amberDeep font-bold disabled:opacity-60"
            >
              {busy ? 'Opening Telegram...' : 'Connect Telegram'}
            </button>
          </>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
