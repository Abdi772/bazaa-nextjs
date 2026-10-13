 'use client';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Marks the signed-in user as "online".
// - Creates the profile row once (never overwrites an existing name).
// - Saves last_seen_at right away, then at most once a minute,
//   and only while the page is visible.
const PING_EVERY_MS = 60 * 1000;

export default function Heartbeat() {
  useEffect(() => {
    let userId: string | null = null;
    let lastPing = 0;

    const touch = async () => {
      if (!userId) return;
      lastPing = Date.now();
      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', userId);
    };

    const ensureProfile = async (
      id: string,
      email?: string | null,
      meta?: Record<string, unknown> | null,
    ) => {
      const metaName = String(meta?.full_name ?? meta?.name ?? '').trim();
      await supabase.from('profiles').upsert(
        {
          id,
          name: metaName || (email?.split('@')[0] ?? 'User'),
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'id', ignoreDuplicates: true },
      );
      await touch();
    };

    const ping = () => {
      if (!userId || document.visibilityState !== 'visible') return;
      if (Date.now() - lastPing < PING_EVERY_MS - 5000) return;
      touch();
    };

    const setUser = (
      user: {
        id: string;
        email?: string | null;
        user_metadata?: Record<string, unknown> | null;
      } | null,
    ) => {
      const changed = (user?.id ?? null) !== userId;
      userId = user?.id ?? null;
      if (userId && changed) ensureProfile(userId, user?.email, user?.user_metadata);
    };

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const timer = setInterval(ping, PING_EVERY_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') ping();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(timer);
      sub.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return null;
}
