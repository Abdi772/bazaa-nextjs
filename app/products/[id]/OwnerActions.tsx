 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function OwnerActions({ id }: { id: string | number }) {
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
    const { error: deleteError } = await supabase.from('listings').delete().eq('id', id);
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
    <div className="my-3">
      <div className="flex gap-2">
        <Link
          href={`/edit/${id}`}
          className="flex-1 text-center border border-gray-300 rounded-lg py-2 text-sm font-medium bg-white"
        >
          Edit
        </Link>
        <button
          onClick={onDelete}
          disabled={busy}
          className="flex-1 border border-red-300 text-red-700 rounded-lg py-2 text-sm font-medium bg-white disabled:opacity-60"
        >
          {busy ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
