'use client';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Heartbeat() {
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id;
      if (!id) return;
      const ping = () => {
        if (document.visibilityState === 'visible')
          supabase.from('profiles')
            .upsert({ id, last_seen_at: new Date().toISOString() });
      };
      ping();
      timer = setInterval(ping, 60_000);
    });
    return () => clearInterval(timer);
  }, []);
  return null;
}
