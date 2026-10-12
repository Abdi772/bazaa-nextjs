 'use client';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Heartbeat() {
  useEffect(() => {
    let userId: string | null = null;
    let name = 'User';

    const ping = async () => {
      if (!userId || document.visibilityState !== 'visible') return;
      await supabase
        .from('profiles')
        .upsert({ id: userId, name, last_seen_at: new Date().toISOString() });
    };

    const setUser = (user: { id: string; email?: string | null } | null) => {
      userId = user?.id ?? null;
      name = user?.email?.split('@')[0] ?? 'User';
      if (userId) ping();
    };

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const timer = setInterval(ping, 30_000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') ping();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', ping);

    return () => {
      clearInterval(timer);
      sub.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', ping);
    };
  }, []);

  return null;
}
