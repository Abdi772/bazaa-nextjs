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
    | {
        id: number;
        title: string;
        price: number;
        image_url: string | null;
      }
    | {
        id: number;
        title: string;
        price: number;
        image_url: string | null;
      }[]
    | null;
};

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();

  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return d.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
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
      .select(
        'id, buyer_id, seller_id, last_message, last_message_at, listings(id, title, price, image_url)'
      )
      .or(`buyer_id.eq.${uid},seller_id.eq.${uid}`)
      .order('last_message_at', { ascending: false });

    if (err) {
      setError(err.message);
    }

    setConvs((data as unknown as Conv[]) || []);

    const { data: unreadRows } = await supabase
      .from('messages')
      .select('conversation_id')
      .is('read_at', null)
      .neq('sender_id', uid);

    const counts: Record<number, number> = {};

    for (const r of
      (unreadRows as { conversation_id: number }[]) || []) {
      counts[r.conversation_id] =
        (counts[r.conversation_id] || 0) + 1;
    }

    setUnread(counts);
  }

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null =
      null;

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
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          () => load(uid)
        )
        .subscribe();
    }

    init();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="bazaa-card flex min-h-[180px] items-center justify-center p-5">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amberSoft text-xl">
              💬
            </div>

            <p className="text-sm font-medium text-muted">
              Loading messages...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="bazaa-card p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amberSoft text-2xl">
            💬
          </div>

          <h1 className="bazaa-title text-2xl">
            Messages
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Log in or create an account to see your chats
            with buyers and sellers.
          </p>

          <Link
            href="/"
            className="bazaa-primary mt-5 min-h-[48px] w-full px-5 sm:w-auto"
          >
            Go to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Header */}
      <div className="mb-5">
        <h1 className="bazaa-title text-2xl sm:text-3xl">
          Messages
        </h1>

        <p className="mt-1 text-sm leading-5 text-muted">
          Your conversations with buyers and sellers.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-card border border-danger/25 bg-dangerSoft px-4 py-3 text-sm leading-5 text-dangerText">
          {error}
        </div>
      )}

      {/* Empty state */}
      {convs.length === 0 && (
        <div className="bazaa-card p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amberSoft text-2xl">
            💬
          </div>

          <h2 className="bazaa-title text-xl">
            No chats yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Open a listing and tap “Chat with seller” to
            start a conversation.
          </p>

          <Link
            href="/"
            className="bazaa-primary mt-5 min-h-[48px] w-full px-5 sm:w-auto"
          >
            Browse listings
          </Link>
        </div>
      )}

      {/* Conversations */}
      {convs.length > 0 && (
        <div className="space-y-3">
          {convs.map((c) => {
            const l = Array.isArray(c.listings)
              ? c.listings[0]
              : c.listings;

            const n = unread[c.id] || 0;
            const selling = c.seller_id === userId;

            return (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className="group flex min-w-0 gap-3 rounded-card border border-line bg-surface p-3.5 shadow-card transition-all active:scale-[0.99] hover:border-amber/40 hover:shadow-soft sm:gap-4 sm:p-4"
              >
                {/* Listing image */}
                {l?.image_url ? (
                  <img
                    src={l.image_url}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-bazaa object-cover sm:h-[72px] sm:w-[72px]"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-bazaa bg-panel text-2xl sm:h-[72px] sm:w-[72px]">
                    📦
                  </div>
                )}

                {/* Conversation details */}
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold leading-5 text-fg sm:text-base">
                        {l?.title ?? 'Listing removed'}
                      </div>

                      {l?.price !== undefined && (
                        <div className="mt-0.5 font-serif text-sm font-bold text-amberText">
                          ETB {Number(l.price).toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 pt-0.5 text-[11px] font-medium text-muted">
                      {timeLabel(c.last_message_at)}
                    </div>
                  </div>

                  <div className="mt-2 flex min-w-0 items-center gap-2">
                    <div
                      className={`min-w-0 flex-1 truncate text-sm leading-5 ${
                        n > 0
                          ? 'font-semibold text-fg'
                          : 'text-muted'
                      }`}
                    >
                      {c.last_message ?? 'No messages yet'}
                    </div>

                    {n > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-bold leading-none text-white">
                        {n}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        selling
                          ? 'bg-amberSoft text-amberText'
                          : 'bg-panel text-muted'
                      }`}
                    >
                      {selling ? 'Selling' : 'Buying'}
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-muted"
                    >
                      •
                    </span>

                    <span className="truncate text-[11px] text-muted">
                      {n > 0
                        ? `${n} unread ${
                            n === 1 ? 'message' : 'messages'
                          }`
                        : 'Up to date'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
            }
