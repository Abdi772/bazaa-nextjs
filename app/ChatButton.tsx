'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const QUICK_MESSAGES = [
  'Make an offer',
  'Is this still available?',
  'Last price?',
];

export default function ChatButton({
  listingId,
  sellerId,
}: {
  listingId: number;
  sellerId: string | null;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setReady(true);
    });
  }, []);

  // No chat if the seller is unknown or you are the seller
  if (!sellerId || (ready && userId === sellerId)) return null;

  async function startChat() {
    setError('');

    if (!userId) {
      setError(
        'Please log in first (button at the top), then tap Start chat again.',
      );
      return;
    }

    setBusy(true);

    // Reuse the existing conversation if there is one
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('listing_id', listingId)
      .eq('buyer_id', userId)
      .maybeSingle();

    let conversationId: number | null = existing?.id ?? null;

    if (conversationId == null) {
      const { data, error: insertError } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          buyer_id: userId,
          seller_id: sellerId,
        })
        .select('id')
        .single();

      if (insertError || !data) {
        setError(insertError?.message ?? 'Could not start the chat.');
        setBusy(false);
        return;
      }

      conversationId = data.id;
    }

    // Send the first message, if the buyer wrote or picked one
    const body = message.trim();

    if (body) {
      const { error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          body,
        });

      if (sendError) {
        setError(
          'The chat opened, but your message was not sent: ' +
            sendError.message,
        );
      }
    }

    router.push(`/messages/${conversationId}`);
  }

  return (
    <div>
      <div className="mb-2 text-sm font-bold text-fg">
        Chat with the seller
      </div>

      {/* Quick messages */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_MESSAGES.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => setMessage(text)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
              message === text
                ? 'border-amber bg-amberSoft text-amberText'
                : 'border-line bg-surface text-fg hover:border-amber'
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      <input
        className="bazaa-input mb-3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        aria-label="Message to the seller"
        maxLength={500}
      />

      <button
        type="button"
        onClick={startChat}
        disabled={busy}
        className="bazaa-primary w-full"
      >
        {busy ? 'Opening chat...' : '💬 Start chat'}
      </button>

      {error && (
        <p className="mt-2 text-xs text-dangerText">{error}</p>
      )}
    </div>
  );
}
