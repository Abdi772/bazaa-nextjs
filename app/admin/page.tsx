'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type Report = {
  id: number;
  reason: string;
  details: string | null;
  created_at: string;
  listing_id: number | null;
  title: string | null;
};

export default function AdminPage() {
  const [state, setState] = useState<'loading' | 'denied' | 'ok'>('loading');
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState('');

  const loadReports = useCallback(async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('id, reason, details, created_at, listing_id, listings(id, title)')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (error) {
      setError('Could not load reports: ' + error.message);
      return;
    }
    const rows = (data ?? []).map((r: any) => {
      const l = Array.isArray(r.listings) ? r.listings[0] : r.listings;
      return {
        id: r.id,
        reason: r.reason,
        details: r.details,
        created_at: r.created_at,
        listing_id: l ? l.id : null,
        title: l ? l.title : null,
      } as Report;
    });
    setReports(rows);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) return setState('denied');
      const { data } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!data) return setState('denied');
      setState('ok');
      loadReports();
    })();
  }, [loadReports]);

  async function dismiss(id: number) {
    const { error } = await supabase.from('reports').update({ status: 'dismissed' }).eq('id', id);
    if (error) return setError('Could not update: ' + error.message);
    loadReports();
  }

  async function removeListing(listingId: number) {
    if (!confirm('Remove this listing permanently?')) return;
    const { error } = await supabase.from('listings').delete().eq('id', listingId);
    if (error) return setError('Could not remove: ' + error.message);
    loadReports();
  }

  if (state === 'loading') return <p>Loading...</p>;
  if (state === 'denied')
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold mb-2">Admin</h1>
        <p>This page is only for admins. Log in with an admin account.</p>
      </div>
    );

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-1">Admin: reports</h1>
      <p className="text-sm text-gray-500 mb-4">
        Review each report, then remove the listing or dismiss the report.
      </p>
      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
      {reports.length === 0 && <p>No open reports. Nothing to review right now.</p>}
      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="bg-surface border border-gray-200 rounded-lg p-4">
            <div className="font-semibold">{r.title ?? '(listing removed)'}</div>
            <div className="text-xs text-gray-500 my-1">
              {r.reason} · {new Date(r.created_at).toLocaleDateString()}
            </div>
            {r.details && <p className="text-sm mb-2">{r.details}</p>}
            <div className="flex flex-wrap gap-2 text-sm">
              {r.listing_id && (
                <Link href={'/products/' + r.listing_id} className="border rounded-md px-3 py-1.5">
                  View
                </Link>
              )}
              <button onClick={() => dismiss(r.id)} className="border rounded-md px-3 py-1.5">
                Dismiss
              </button>
              {r.listing_id && (
                <button
                  onClick={() => removeListing(r.listing_id as number)}
                  className="border border-red-300 text-red-700 rounded-md px-3 py-1.5"
                >
                  Remove listing
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
