'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FavoriteButton({ listingId }: { listingId: number | string }) {
  const id = Number(listingId);
  const [userId, setUserId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('');

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      const uid = s.session?.user.id ?? null;
      setUserId(uid);
      if (!uid) return;
      const { data } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', uid)
        .eq('listing_id', id)
        .maybeSingle();
      setSaved(!!data);
    })();
  }, [id]);

  async function toggle() {
    if (!userId) {
      setHint('Log in to save listings.');
      return;
    }
    setBusy(true);
    setHint('');
    if (saved) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('listing_id', id);
      if (error) setHint(error.message);
      else setSaved(false);
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, listing_id: id });
      if (error) setHint(error.message);
      else setSaved(true);
    }
    setBusy(false);
  }

  return (
    <div className="text-center">
      <button
        onClick={toggle}
        disabled={busy}
        className="w-full border border-gray-300 rounded py-2.5 text-sm font-semibold disabled:opacity-60"
        style={{ color: saved ? '#B23A3A' : undefined }}
      >
        {saved ? '♥ Saved' : '♡ Save listing'}
      </button>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
