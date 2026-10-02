'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type Conv = {
  id: number;
  buyer_id: string;
  seller_id: string;
  last_message: string | null;
  last_message_at: string;
  listings:
    | { id: number; title: string; price: number; image_url: string | null }
    | { id: number; title: string; price: number; image_url: string | null }[]
    | null;
};

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function MessagesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [unread, setUnread] = useState<Record<number, number>>({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  async function load(uid: string) {
    const { data, error: err } = await supabase
      .from('conversations')
      .select('id, buyer_id, seller_id, last_message, last_message_at, listings(id, title, price, image_url)')
      .or(`buyer_id.eq.${uid},seller_id.eq.${uid}`)
      .order('last_message_at', { ascending: false });

    if (err) setError(err.message);
    setConvs((data as unknown as Conv[]) || []);

    const { data: unreadRows } = await supabase
      .from('messages')
      .select('conversation_id')
      .is('read_at', null)
      .neq('sender_id', uid);

    const counts: Record<number, number> = {};
    for (const r of (unreadRows as { conversation_id: number }[]) || []) {
      counts[r.conversation_id] = (counts[r.conversation_id] || 0) + 1;
    }
    setUnread(counts);
  }

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setReady(true);
        return;
      }
      const uid = u.user.id;
      setUserId(uid);
      await load(uid);
      setReady(true);

      // Refresh the list when a new message arrives
      channel = supabase
        .channel('inbox')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => load(uid))
        .subscribe();
    }

    init();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  if (!ready) return <p className="py-10 text-center text-gray-500">Loading...</p>;

  if (!userId) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-semibold mb-2">Messages</h1>
        <p className="text-gray-600">
          Use the Log in / Sign up button at the top of the page to see your chats.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {convs.length === 0 && (
        <div className="text-center py-10 text-muted">
          <p className="mb-2">No chats yet.</p>
          <p className="text-sm">Open a listing and tap “Chat with seller” to start one.</p>
        </div>
      )}

      <div className="space-y-2">
        {convs.map((c) => {
          const l = Array.isArray(c.listings) ? c.listings[0] : c.listings;
          const n = unread[c.id] || 0;
          const selling = c.seller_id === userId;
          return (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="bg-white border border-line rounded-xl p-3 flex gap-3 items-center"
            >
              {l?.image_url ? (
                <img src={l.image_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold truncate">{l?.title ?? 'Listing removed'}</div>
                  <div className="text-xs text-muted shrink-0">{timeLabel(c.last_message_at)}</div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className={`text-sm truncate ${n > 0 ? 'font-semibold' : 'text-muted'}`}>
                    {c.last_message ?? 'No messages yet'}
                  </div>
                  {n > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center shrink-0">
                      {n}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted mt-0.5">{selling ? 'Selling' : 'Buying'}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
