'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const btn =
  'w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center';

export default function ListingActions({
  listingId,
  title,
}: {
  listingId: number;
  title: string;
}) {
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
        .eq('listing_id', listingId)
        .maybeSingle();
      setSaved(!!data);
    })();
  }, [listingId]);

  async function toggleSave() {
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
        .eq('listing_id', listingId);
      if (error) setHint(error.message);
      else setSaved(false);
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, listing_id: listingId });
      if (error) setHint(error.message);
      else setSaved(true);
    }
    setBusy(false);
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch {
        /* user closed the share sheet */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setHint('Link copied.');
      } catch {
        setHint(url);
      }
    }
  }

  return (
    <div className="mb-2">
      <div className="flex justify-end gap-2">
        <button onClick={share} aria-label="Share" className={btn}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
            <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
          </svg>
        </button>
        <button onClick={toggleSave} disabled={busy} aria-label="Save" className={btn}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={saved ? '#B23A3A' : 'none'}
            stroke={saved ? '#B23A3A' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      {hint && <p className="text-xs text-gray-500 text-right mt-1">{hint}</p>}
    </div>
  );
}
