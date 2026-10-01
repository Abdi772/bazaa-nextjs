'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const REASONS = [
  'Scam or fraud',
  'Prohibited item',
  'Wrong category',
  'Duplicate listing',
  'Item already sold',
  'Other',
];

export default function ReportButton({
  listingId,
  title,
  ownerId,
}: {
  listingId: number | string;
  title: string;
  ownerId?: string | null;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
      setReady(true);
    });
  }, []);

  if (!ready) return null;
  if (userId && ownerId && userId === ownerId) return null;

  function close() {
    setOpen(false);
    setDetails('');
    setError('');
    setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    setError('');
    const { error } = await supabase.from('reports').insert({
      listing_id: Number(listingId),
      reporter_id: userId,
      reason,
      details: details || null,
    });
    setBusy(false);
    if (error) setError('Could not send the report: ' + error.message);
    else setDone(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium"
        style={{ color: '#B23A3A' }}
      >
        🚩 Report this listing
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="bg-white text-gray-900 rounded-xl w-full max-w-sm p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-1">Report listing</h2>
            <p className="text-sm text-gray-500 mb-4">{title}</p>

            {!userId ? (
              <p className="text-sm">Please log in first to report a listing.</p>
            ) : done ? (
              <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-md p-2">
                Thank you. Your report was sent and will be reviewed.
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Details (optional)"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                {error && <p className="text-sm text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-amber text-ink font-semibold rounded-md py-2 text-sm disabled:opacity-60"
                >
                  {busy ? 'Sending...' : 'Submit report'}
                </button>
              </form>
            )}

            <button onClick={close} className="w-full mt-3 text-sm text-gray-500">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
