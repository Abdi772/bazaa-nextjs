 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function OwnerActions({
  id,
}: {
  id: string | number;
}) {
  const router = useRouter();

  const [isOwner, setIsOwner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function check() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) return;

      const { data } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', id)
        .single();

      setIsOwner(data?.user_id === user.id);
    }

    check();
  }, [id]);

  async function onDelete() {
    if (!window.confirm('Delete this listing permanently?')) return;

    setBusy(true);
    setError('');

    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      setBusy(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  if (!isOwner) return null;

  return (
    <div className="bazaa-card p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Your listing
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/edit/${id}`}
          className="bazaa-secondary py-3 text-sm"
        >
          Edit listing
        </Link>

        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="inline-flex items-center justify-center rounded-bazaa border border-danger/25 bg-dangerSoft px-4 py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Deleting...' : 'Delete listing'}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-bazaa bg-dangerSoft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
