'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Review = {
  id: number;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`${value} out of 5`} className="tracking-tight">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? 'text-amber' : 'text-line'}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function Reviews({ sellerId }: { sellerId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('reviews')
      .select('id, reviewer_id, rating, comment, created_at')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    setReviews((data as Review[]) || []);
  }, [sellerId]);

  useEffect(() => {
    load();
    supabase.auth.getSession().then(({ data }) => {
      setUid(data.session?.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUid(session?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const mine = reviews.find((r) => r.reviewer_id === uid);
  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

  function openForm() {
    setRating(mine?.rating ?? 0);
    setComment(mine?.comment ?? '');
    setMsg('');
    setOpen(true);
  }

  async function submit() {
    setMsg('');
    if (!uid) return;
    if (rating < 1) {
      setMsg('Tap the stars to choose a rating.');
      return;
    }
    setBusy(true);
    const payload = { rating, comment: comment.trim() || null };
    const { error } = mine
      ? await supabase.from('reviews').update(payload).eq('id', mine.id)
      : await supabase
          .from('reviews')
          .insert({ ...payload, seller_id: sellerId, reviewer_id: uid });
    setBusy(false);

    if (error) {
      setMsg(
        error.code === '42501' || /row-level security/i.test(error.message)
          ? 'You can review a seller after you have chatted with them on Bazaa. Open one of their listings and tap Chat with seller first.'
          : error.message
      );
      return;
    }
    setOpen(false);
    await load();
  }

  async function remove() {
    if (!mine) return;
    setBusy(true);
    await supabase.from('reviews').delete().eq('id', mine.id);
    setBusy(false);
    setOpen(false);
    await load();
  }

  return (
    <section className="mb-6 rounded-lg border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-serif text-lg font-bold">Reviews</div>
          {count > 0 ? (
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="font-bold">{avg.toFixed(1)}</span>
              <Stars value={avg} />
              <span className="text-muted">
                ({count} {count === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          ) : (
            <div className="mt-1 text-sm text-muted">No reviews yet</div>
          )}
        </div>

        {uid && uid !== sellerId && !open && (
          <button
            type="button"
            onClick={openForm}
            className="shrink-0 rounded bg-amber px-4 py-2 text-sm font-bold text-ink"
          >
            {mine ? 'Edit my review' : 'Write a review'}
          </button>
        )}
        {!uid && (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('bazaa:open-login'))}
            className="shrink-0 rounded border border-line px-4 py-2 text-sm font-semibold"
          >
            Log in to review
          </button>
        )}
      </div>

      {open && (
        <div className="mt-4 rounded-lg bg-paper p-3">
          <div className="mb-2 flex gap-1 text-3xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} stars`}
                className={n <= rating ? 'text-amber' : 'text-line'}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="How was your experience with this seller? (optional)"
            className="w-full rounded border border-line bg-white px-3 py-2 text-sm"
          />
          {msg && <p className="mt-2 text-xs text-red-600">{msg}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="rounded bg-ink px-4 py-2 text-sm font-bold text-paper disabled:opacity-60"
            >
              {busy ? 'Saving...' : mine ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded border border-line px-4 py-2 text-sm"
            >
              Cancel
            </button>
            {mine && (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="ml-auto rounded px-3 py-2 text-sm text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {count > 0 && (
        <div className="mt-4 divide-y divide-line">
          {reviews.map((r) => (
            <div key={r.id} className="py-3">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>
                  <Stars value={r.rating} />{' '}
                  <span className="ml-1">{r.reviewer_id === uid ? 'You' : 'Bazaa buyer'}</span>
                </span>
                <span>
                  {new Date(r.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {r.comment && <p className="mt-1 text-sm">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
