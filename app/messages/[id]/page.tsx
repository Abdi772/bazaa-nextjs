'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { listingSlug } from '../../../lib/listings';

type Msg = {
  id: number;
  conversation_id: number;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

type ListingInfo = { id: number; title: string; price: number; image_url: string | null };

export default function ChatPage() {
  const params = useParams();
  const convId = Number(params.id);

  const [userId, setUserId] = useState<string | null>(null);
  const [listing, setListing] = useState<ListingInfo | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [ready, setReady] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  function addMessage(m: Msg) {
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
  }

  async function markRead(uid: string) {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', convId)
      .neq('sender_id', uid)
      .is('read_at', null);
  }

  useEffect(() => {
    if (!convId) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setReady(true);
        return;
      }
      const uid = u.user.id;
      setUserId(uid);

      const { data: conv } = await supabase
        .from('conversations')
        .select('id, listings(id, title, price, image_url)')
        .eq('id', convId)
        .maybeSingle();

      if (!conv) {
        setNotFound(true);
        setReady(true);
        return;
      }

      const l = Array.isArray(conv.listings) ? conv.listings[0] : conv.listings;
      if (l) setListing(l as ListingInfo);

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });
      setMessages((msgs as Msg[]) || []);
      setReady(true);
      markRead(uid);

      channel = supabase
        .channel(`chat-${convId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${convId}`,
          },
          (payload) => {
            const m = payload.new as Msg;
            addMessage(m);
            if (m.sender_id !== uid) markRead(uid);
          }
        )
        .subscribe();
    }

    init();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [convId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || !userId || sending) return;
    setSending(true);
    setError('');

    const { data, error: err } = await supabase
      .from('messages')
      .insert({ conversation_id: convId, sender_id: userId, body })
      .select('*')
      .single();

    if (err || !data) {
      setError(err?.message ?? 'Could not send the message.');
    } else {
      addMessage(data as Msg);
      setText('');
    }
    setSending(false);
  }

  if (!ready) return <p className="py-10 text-center text-gray-500">Loading...</p>;

  if (!userId) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-semibold mb-2">Messages</h1>
        <p className="text-gray-600">Log in to see your chats.</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-600 mb-3">This conversation was not found.</p>
        <Link href="/messages" className="underline">
          Back to messages
        </Link>
      </div>
    );
  }

  return (
    <div
      className="max-w-xl mx-auto flex flex-col"
      style={{ height: 'calc(100dvh - 190px)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-line">
        <Link href="/messages" className="text-2xl leading-none px-1">
          ←
        </Link>
        {listing && (
          <Link
            href={`/products/${listingSlug(listing)}`}
            className="flex items-center gap-3 min-w-0 flex-1"
          >
            {listing.image_url ? (
              <img src={listing.image_url} alt="" className="w-11 h-11 rounded-lg object-cover" />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-gray-100" />
            )}
            <div className="min-w-0">
              <div className="font-semibold truncate">{listing.title}</div>
              <div className="text-sm text-amberText font-semibold">
                ETB {Number(listing.price).toLocaleString()}
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-muted text-sm py-8">
            Say hello and ask about the item.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === userId;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                  mine ? 'bg-amber text-ink rounded-br-sm' : 'bg-surface border border-line rounded-bl-sm'
                }`}
              >
                {m.body}
                <div className="text-[10px] text-muted mt-1 text-right">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {mine && (m.read_at ? ' ✓✓' : ' ✓')}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {error && <p className="text-red-600 text-xs mb-1">{error}</p>}
      <form onSubmit={send} className="flex gap-2 pt-2 border-t border-line">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-base bg-surface focus:outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="bg-amber text-ink font-semibold rounded-full px-5 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
