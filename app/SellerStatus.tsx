 'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ONLINE_WINDOW_MIN = 3;

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

// Telegram style: "online" or "last seen 5 minutes ago"
function statusText(iso: string | null, now: number) {
  if (!iso) return 'last seen a long time ago';

  const mins = Math.floor((now - new Date(iso).getTime()) / 60000);

  if (mins < ONLINE_WINDOW_MIN) return 'online';
  if (mins < 60) return `last seen ${plural(mins, 'minute')} ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `last seen ${plural(hours, 'hour')} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'last seen yesterday';
  if (days < 7) return `last seen ${plural(days, 'day')} ago`;

  const weeks = Math.floor(days / 7);
  if (days < 30) return `last seen ${plural(weeks, 'week')} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `last seen ${plural(months, 'month')} ago`;

  return 'last seen a long time ago';
}

export default function SellerStatus({ sellerId }: { sellerId: string }) {
  const [iso, setIso] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const load = () =>
      supabase
        .from('profiles')
        .select('last_seen_at')
        .eq('id', sellerId)
        .maybeSingle()
        .then(({ data }) => {
          setIso((data?.last_seen_at as string | null) ?? null);
          setLoaded(true);
        });

    load();

    const fetchTimer = setInterval(load, 30_000); // get the newest time
    const tickTimer = setInterval(() => setNow(Date.now()), 15_000); // update the "ago" text

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setNow(Date.now());
        load();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(fetchTimer);
      clearInterval(tickTimer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [sellerId]);

  if (!loaded) return null;

  const text = statusText(iso, now);
  const online = text === 'online';

  return (
    <span
      className={`text-sm font-semibold ${
        online ? 'text-green-600' : 'text-muted'
      }`}
    >
      {online ? '● ' : ''}
      {text}
    </span>
  );
                              }
