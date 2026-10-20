  'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ONLINE_WINDOW_MS = 3 * 60 * 1000;

// Cards on the same page ask together, so only ONE query is sent.
type Resolver = (iso: string | null) => void;
const waiting = new Map<string, Resolver[]>();
let scheduled = false;

async function flush() {
  scheduled = false;
  const batch = new Map(waiting);
  waiting.clear();

  const ids = Array.from(batch.keys());
  const { data } = await supabase
    .from('profiles')
    .select('id, last_seen_at')
    .in('id', ids);

  const seen: Record<string, string | null> = {};
  (data ?? []).forEach((r) => {
    seen[r.id as string] = (r.last_seen_at as string | null) ?? null;
  });

  batch.forEach((resolvers, id) => {
    resolvers.forEach((resolve) => resolve(seen[id] ?? null));
  });
}

function requestLastSeen(id: string): Promise<string | null> {
  return new Promise((resolve) => {
    const list = waiting.get(id) ?? [];
    list.push(resolve);
    waiting.set(id, list);

    if (!scheduled) {
      scheduled = true;
      setTimeout(flush, 30);
    }
  });
}

export default function OnlineDot({ sellerId }: { sellerId?: string | null }) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!sellerId) return;
    let alive = true;

    const check = () =>
      requestLastSeen(sellerId).then((iso) => {
        if (!alive) return;
        setOnline(
          !!iso && Date.now() - new Date(iso).getTime() < ONLINE_WINDOW_MS,
        );
      });

    check();
    const timer = setInterval(check, 60_000);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [sellerId]);

  if (!online) return null;

  return (
    <span className="flex items-center gap-1.5 rounded-full bg-whatsapp px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      online
    </span>
  );
}
