'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

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
      setError('Please log in first (button at the top), then tap Chat again.');
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

    if (existing) {
      router.push(`/messages/${existing.id}`);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('conversations')
      .insert({ listing_id: listingId, buyer_id: userId, seller_id: sellerId })
      .select('id')
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? 'Could not start the chat.');
      setBusy(false);
      return;
    }
    router.push(`/messages/${data.id}`);
  }

  return (
    <div className="mb-2">
      <button
        onClick={startChat}
        disabled={busy}
        className="w-full bg-amber text-ink rounded py-3 text-sm font-semibold disabled:opacity-60"
      >
        {busy ? 'Opening chat...' : '💬 Chat with seller'}
      </button>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
