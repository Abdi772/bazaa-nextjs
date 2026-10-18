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

type VerificationRequest = {
  id: number;
  user_id: string;
  full_name: string;
  business_name: string | null;
  id_path: string;
  shop_path: string | null;
  created_at: string;
  idUrl: string | null;
  shopUrl: string | null;
};

export default function AdminPage() {
  const [state, setState] = useState<'loading' | 'denied' | 'ok'>('loading');
  const [reports, setReports] = useState<Report[]>([]);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [reviewing, setReviewing] = useState<number | null>(null);
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
    type Row = {
      id: number;
      reason: string;
      details: string | null;
      created_at: string;
      listing_id: number | null;
      listings:
        | { id: number; title: string }
        | { id: number; title: string }[]
        | null;
    };
    const rows = ((data ?? []) as unknown as Row[]).map((r) => {
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

  const loadRequests = useCallback(async () => {
    const { data, error } = await supabase
      .from('seller_verifications')
      .select('id, user_id, full_name, business_name, id_path, shop_path, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (error) {
      setError('Could not load verification requests: ' + error.message);
      return;
    }
    const sign = async (path: string | null) => {
      if (!path) return null;
      const { data: s } = await supabase.storage
        .from('verification-docs')
        .createSignedUrl(path, 600);
      return s?.signedUrl ?? null;
    };
    const rows = await Promise.all(
      ((data ?? []) as Omit<VerificationRequest, 'idUrl' | 'shopUrl'>[]).map(
        async (r) => ({
          ...r,
          idUrl: await sign(r.id_path),
          shopUrl: await sign(r.shop_path),
        }),
      ),
    );
    setRequests(rows);
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
      loadRequests();
    })();
  }, [loadReports, loadRequests]);

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

  async function reviewRequest(r: VerificationRequest, approve: boolean) {
    let reason: string | null = null;
    if (!approve) {
      const typed = prompt('Why is this request rejected? The seller will see this.');
      if (typed === null) return;
      reason = typed.trim() || 'Your documents could not be verified.';
    }
    setReviewing(r.id);
    setError('');
    const { error } = await supabase.rpc('review_verification', {
      p_id: r.id,
      p_approve: approve,
      p_reason: reason,
    });
    if (error) {
      setError('Could not save: ' + error.message);
      setReviewing(null);
      return;
    }
    // Privacy: delete the ID photos once a decision is made.
    const paths = [r.id_path, r.shop_path].filter(Boolean) as string[];
    await supabase.storage.from('verification-docs').remove(paths);
    setReviewing(null);
    loadRequests();
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
      <h1 className="font-serif text-2xl font-bold mb-1">Admin: seller verification</h1>
      <p className="text-sm text-gray-500 mb-4">
        Compare the ID photo with the name, then approve or reject. Photos are
        deleted after you decide.
      </p>
      {requests.length === 0 && <p className="mb-8">No verification requests waiting.</p>}
      <div className="space-y-3 mb-10">
        {requests.map((r) => (
          <div key={r.id} className="bg-surface border border-gray-200 rounded-lg p-4">
            <div className="font-semibold">{r.full_name}</div>
            <div className="text-xs text-gray-500 my-1">
              {r.business_name ? r.business_name + ' · ' : ''}
              {new Date(r.created_at).toLocaleDateString()}
            </div>
            <div className="flex flex-wrap gap-3 my-3">
              {r.idUrl && (
                <a href={r.idUrl} target="_blank" rel="noreferrer" className="block">
                  <div className="text-xs text-gray-500 mb-1">ID (tap to enlarge)</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.idUrl} alt="ID" className="h-40 rounded-md border object-cover" />
                </a>
              )}
              {r.shopUrl && (
                <a href={r.shopUrl} target="_blank" rel="noreferrer" className="block">
                  <div className="text-xs text-gray-500 mb-1">Shop (tap to enlarge)</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.shopUrl} alt="Shop" className="h-40 rounded-md border object-cover" />
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link href={'/seller/' + r.user_id} className="border rounded-md px-3 py-1.5">
                View seller
              </Link>
              <button
                disabled={reviewing === r.id}
                onClick={() => reviewRequest(r, true)}
                className="border border-green-400 text-green-700 rounded-md px-3 py-1.5 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                disabled={reviewing === r.id}
                onClick={() => reviewRequest(r, false)}
                className="border border-red-300 text-red-700 rounded-md px-3 py-1.5 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-2xl font-bold mb-1">Admin: reports</h2>
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
 
