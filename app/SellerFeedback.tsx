'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ICON: Record<string, string> = {
  positive: '😊',
  neutral: '😐',
  negative: '😞',
};

export default function SellerFeedback({ sellerId }: { sellerId: string }) {
  const [me, setMe] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [rating, setRating] = useState('positive');
  const [body, setBody] = useState('');
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data: fb } = await supabase
      .from('feedback')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    const list = fb ?? [];
    const ids = list.map((f) => f.id);

    const [r, l] = ids.length
      ? await Promise.all([
          supabase
            .from('feedback_replies')
            .select('*')
            .in('feedback_id', ids)
            .order('created_at'),
          supabase.from('feedback_likes').select('*').in('feedback_id', ids),
        ])
      : [{ data: [] }, { data: [] }];

    const replies: any[] = r.data ?? [];
    const likes: any[] = l.data ?? [];

    const uids = [
      ...new Set([
        ...list.map((f) => f.author_id),
        ...replies.map((x) => x.author_id),
      ]),
    ];
    const { data: profs } = uids.length
      ? await supabase.from('profiles').select('id,name').in('id', uids)
      : { data: [] };
    const nameOf = (id: string) =>
      profs?.find((p) => p.id === id)?.name ?? 'User';

    setItems(
      list.map((f) => ({
        ...f,
        author: nameOf(f.author_id),
        likes: likes.filter((x) => x.feedback_id === f.id),
        replies: replies
          .filter((x) => x.feedback_id === f.id)
          .map((x) => ({ ...x, author: nameOf(x.author_id) })),
      }))
    );
  }, [sellerId]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
    load();
  }, [load]);

  const counts: Record<string, number> = { positive: 0, neutral: 0, negative: 0 };
  items.forEach((i) => counts[i.rating]++);
  const alreadyReviewed = items.some((i) => i.author_id === me);

  async function submit() {
    setError('');
    const { error } = await supabase
      .from('feedback')
      .insert({ seller_id: sellerId, author_id: me, rating, body });
    if (error) return setError('Could not save feedback.');
    setBody('');
    load();
  }

  async function toggleLike(f: any) {
    if (!me) return;
    const liked = f.likes.some((x: any) => x.user_id === me);
    if (liked)
      await supabase
        .from('feedback_likes')
        .delete()
        .eq('feedback_id', f.id)
        .eq('user_id', me);
    else
      await supabase
        .from('feedback_likes')
        .insert({ feedback_id: f.id, user_id: me });
    load();
  }

  async function sendReply(id: string) {
    if (!me || !replyText.trim()) return;
    await supabase
      .from('feedback_replies')
      .insert({ feedback_id: id, author_id: me, body: replyText });
    setReplyText('');
    setReplyFor(null);
    load();
  }

  return (
    <section className="mt-6 border-y border-line bg-surface px-4 py-4">
      <h2 className="mb-3 text-lg font-bold text-fg">Feedback</h2>

      <div className="mb-4 flex justify-around text-center text-sm font-bold">
        <div className="text-green-600">
          😊 {counts.positive}
          <div>Positive</div>
        </div>
        <div className="text-amber-600">
          😐 {counts.neutral}
          <div>Neutral</div>
        </div>
        <div className="text-red-600">
          😞 {counts.negative}
          <div>Negative</div>
        </div>
      </div>

      {me && me !== sellerId && !alreadyReviewed && (
        <div className="mb-4 rounded-xl border border-line p-3">
          <div className="mb-2 flex gap-2">
            {Object.keys(ICON).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setRating(k)}
                className={`rounded-full border px-3 py-1 text-sm font-bold ${
                  rating === k ? 'bg-amber text-ink' : 'text-muted'
                }`}
              >
                {ICON[k]} {k}
              </button>
            ))}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your feedback..."
            className="w-full rounded-lg border border-line bg-transparent p-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={submit}
            className="mt-2 rounded-lg bg-amber px-4 py-2 text-sm font-bold text-ink"
          >
            Submit
          </button>
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-muted">No feedback yet.</p>
      )}

      {items.map((f) => (
        <div key={f.id} className="mb-4 border-b border-line pb-3">
          <div className="font-bold text-fg">
            {ICON[f.rating]} {f.author}
          </div>
          {f.body && <p className="text-sm text-fg">{f.body}</p>}
          <div className="mt-1 flex gap-4 text-xs font-semibold text-muted">
            <span>{new Date(f.created_at).toLocaleDateString()}</span>
            <button type="button" onClick={() => toggleLike(f)}>
              👍 {f.likes.length}
            </button>
            {me && (
              <button type="button" onClick={() => setReplyFor(f.id)}>
                Reply
              </button>
            )}
          </div>

          {f.replies.map((r: any) => (
            <div
              key={r.id}
              className="ml-6 mt-2 rounded-lg bg-amberSoft p-2 text-sm"
            >
              <b>{r.author}</b>: {r.body}
            </div>
          ))}

          {replyFor === f.id && (
            <div className="ml-6 mt-2 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 rounded-lg border border-line bg-transparent px-2 text-sm"
              />
              <button
                type="button"
                onClick={() => sendReply(f.id)}
                className="rounded-lg bg-amber px-3 text-sm font-bold text-ink"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
