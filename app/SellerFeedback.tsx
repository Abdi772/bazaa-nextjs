 'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ICON: Record<string, string> = {
  positive: '😊',
  neutral: '😐',
  negative: '😞',
};

const MAX_MB = 5;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export default function SellerFeedback({ sellerId }: { sellerId: string }) {
  const [me, setMe] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [rating, setRating] = useState('positive');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
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

  const counts: Record<string, number> = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };
  items.forEach((i) => counts[i.rating]++);
  const alreadyReviewed = items.some((i) => i.author_id === me);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return setError('Please choose a photo.');
    if (f.size > MAX_MB * 1024 * 1024)
      return setError(`Photo must be under ${MAX_MB} MB.`);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
  }

  async function submit() {
    if (!me || sending) return;
    if (!body.trim() && !file) return setError('Write something or add a photo.');
    setError('');
    setSending(true);

    let image_url: string | null = null;

    if (file) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${me}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('feedback-images')
        .upload(path, file);
      if (upErr) {
        setSending(false);
        return setError('Photo upload failed: ' + upErr.message);
      }
      image_url = supabase.storage
        .from('feedback-images')
        .getPublicUrl(path).data.publicUrl;
    }

    const { error: insErr } = await supabase.from('feedback').insert({
      seller_id: sellerId,
      author_id: me,
      rating,
      body: body.trim() || null,
      image_url,
    });

    setSending(false);
    if (insErr) return setError('Could not save feedback: ' + insErr.message);

    setBody('');
    clearFile();
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
        <div className="text-greenText">
          😊 {counts.positive}
          <div>Positive</div>
        </div>
        <div className="text-amberText">
          😐 {counts.neutral}
          <div>Neutral</div>
        </div>
        <div className="text-dangerText">
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

          {preview && (
            <div className="relative mt-2 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="max-h-40 rounded-lg border border-line"
              />
              <button
                type="button"
                onClick={clearFile}
                aria-label="Remove photo"
                className="absolute right-1 top-1 rounded-full bg-black/70 px-2 text-sm font-bold text-white"
              >
                ✕
              </button>
            </div>
          )}

          <div className="mt-2 flex items-center gap-3">
            <label className="cursor-pointer rounded-lg border border-line px-3 py-2 text-sm font-bold text-fg">
              📷 Add photo
              <input
                type="file"
                accept="image/*"
                onChange={pickFile}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={submit}
              disabled={sending}
              className="rounded-lg bg-amber px-4 py-2 text-sm font-bold text-ink disabled:opacity-60"
            >
              {sending ? 'Sending...' : 'Submit'}
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-dangerText">{error}</p>}
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-muted">No feedback yet.</p>
      )}

      {items.map((f) => {
        const liked = me && f.likes.some((x: any) => x.user_id === me);
        return (
          <div key={f.id} className="mb-4 border-b border-line pb-3">
            <div className="rounded-lg bg-panel p-3">
              <div className="flex items-center justify-between font-bold text-fg">
                <span>{f.author}</span>
                <span>{ICON[f.rating]}</span>
              </div>
              {f.body && <p className="mt-1 text-sm text-fg">{f.body}</p>}
            </div>

            {f.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={f.image_url}
                alt="Feedback photo"
                className="mt-2 max-h-72 rounded-lg border border-line"
              />
            )}

            <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-muted">
              <span>{fmtDate(f.created_at)}</span>
              <button
                type="button"
                onClick={() => toggleLike(f)}
                className={liked ? 'text-greenText' : ''}
              >
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
                <div className="mt-1 text-xs text-muted">
                  {fmtDate(r.created_at)}
                </div>
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
        );
      })}
    </section>
  );
     }
