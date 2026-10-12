'use client';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Marks the signed-in user as "online" without hammering the database.
// - Creates the profile row once (never overwrites an existing name).
// - Then only updates last_seen_at, at most every 3 minutes, and only
//   while the tab is visible.
const PING_EVERY_MS = 3 * 60 * 1000;

export default function Heartbeat() {
  useEffect(() => {
    let userId: string | null = null;
    let lastPing = 0;

    const ensureProfile = async (id: string, email?: string | null) => {
      await supabase.from('profiles').upsert(
        {
          id,
          name: email?.split('@')[0] ?? 'User',
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'id', ignoreDuplicates: true },
      );
      lastPing = Date.now();
    };

    const ping = async () => {
      if (!userId || document.visibilityState !== 'visible') return;
      if (Date.now() - lastPing < PING_EVERY_MS) return;
      lastPing = Date.now();
      await supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', userId);
    };

    const setUser = (user: { id: string; email?: string | null } | null) => {
      const changed = (user?.id ?? null) !== userId;
      userId = user?.id ?? null;
      if (userId && changed) ensureProfile(userId, user?.email);
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
