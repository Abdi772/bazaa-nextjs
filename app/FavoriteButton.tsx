 'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FavoriteButton({
  listingId,
}: {
  listingId: number | string;
}) {
  const id = Number(listingId);

  const [userId, setUserId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('');

  useEffect(() => {
    (async () => {
      const { data: sessionData } =
        await supabase.auth.getSession();

      const uid =
        sessionData.session?.user.id ?? null;

      setUserId(uid);

      if (!uid) {
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', uid)
        .eq('listing_id', id)
        .maybeSingle();

      setSaved(!!data);
    })();
  }, [id]);

  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (busy) {
      return;
    }

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

      if (error) {
  setHint(error.message);
} else {
  setSaved(false);

  window.dispatchEvent(
    new CustomEvent('bazaa-favorite-removed', {
      detail: {
        listingId: id,
      },
    })
  );
      }
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          listing_id: id,
        });

      if (error) {
        setHint(error.message);
      } else {
        setSaved(true);
      }
    }

    setBusy(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label={
          saved
            ? 'Remove from saved listings'
            : 'Save listing'
        }
        title={
          saved
            ? 'Remove from saved listings'
            : 'Save listing'
        }
        className={[
          'flex h-10 w-10 items-center justify-center',
          'rounded-full border',
          'bg-white/95 shadow-soft backdrop-blur-sm',
          'transition-all duration-200',
          'hover:scale-105 hover:bg-white',
          'active:scale-95',
          'disabled:cursor-not-allowed disabled:opacity-60',
          saved
            ? 'border-amber bg-amberSoft'
            : 'border-line',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'text-xl leading-none',
            saved
              ? 'text-danger'
              : 'text-ink',
          ].join(' ')}
        >
          {saved ? '♥' : '♡'}
        </span>
      </button>

      {hint && (
        <div className="absolute right-0 top-12 z-50 w-48 rounded-bazaa border border-line bg-white p-2.5 text-center text-[11px] font-medium text-muted shadow-soft">
          {hint}
        </div>
      )}
    </div>
  );
}
