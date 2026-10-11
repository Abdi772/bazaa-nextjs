 'use client';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Heartbeat() {
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id;
      if (!id) return;
      const name = data.user?.email?.split('@')[0] ?? 'User';
    alert('Heartbeat running for ' + name);
      const ping = async () => {
        if (document.visibilityState !== 'visible') return;
        const { error } = await supabase.from('profiles')
          .upsert({ id, name, last_seen_at: new Date().toISOString() });
        if (error) alert('Heartbeat error: ' + error.message);
      };
      ping();
      timer = setInterval(ping, 60_000);
    });
    return () => clearInterval(timer);
  }, []);
  return null;
}
