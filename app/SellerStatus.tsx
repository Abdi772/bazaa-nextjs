'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function lastSeen(iso: string | null) {
  if (!iso) return 'Offline';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 2) return 'Online';
  if (mins < 60) return `Last seen ${mins} min ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `Last seen ${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  return `Last seen ${d} day${d > 1 ? 's' : ''} ago`;
}

export default function SellerStatus({ sellerId }: { sellerId: string }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const load = () =>
      supabase
        .from('profiles')
        .select('last_seen_at')
        .eq('id', sellerId)
        .maybeSingle()
        .then(({ data }) => setText(lastSeen(data?.last_seen_at ?? null)));
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [sellerId]);

  const online = text === 'Online';
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
