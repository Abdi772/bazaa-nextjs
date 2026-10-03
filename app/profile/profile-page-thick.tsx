'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

const tile =
  'flex min-h-[64px] items-center gap-3 border-b-[2px] border-line bg-white px-4 py-4 text-[15px] font-bold text-ink transition-colors hover:bg-amberSoft';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: a } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', data.user.id)
          .maybeSingle();
        setIsAdmin(!!a);
      }
      setReady(true);
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (!ready) return <p className="py-10 text-center text-gray-500">Loading...</p>;

  if (!user) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-semibold mb-2">Your profile</h1>
        <p className="text-gray-600">
          Use the Log in / Sign up button at the top of the page to see your profile.
        </p>
      </div>
    );
  }

  const name = user.email?.split('@')[0] ?? 'Me';

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center gap-4 border-b-[2px] border-line bg-white px-4 py-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber text-2xl font-bold text-ink ring-2 ring-amberSoft">
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <div className="text-lg font-bold text-ink">{name}</div>
          <div className="text-sm font-semibold text-muted">{user.email}</div>
        </div>
      </div>

      <div className="overflow-hidden border-y-[2px] border-line bg-white">
        <Link href="/my-listings" className={tile}>
          <span>📋</span> My adverts
        </Link>
        <Link href="/favorites" className={tile}>
          <span>❤️</span> Saved
        </Link>
        <Link href="/messages" className={tile}>
          <span>💬</span> Messages
        </Link>
        <Link href="/post" className={tile}>
          <span>➕</span> Post a listing
        </Link>
        {isAdmin && (
          <Link href="/admin" className={tile}>
            <span>🛡️</span> Admin
          </Link>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-5 w-full rounded-xl border-[2px] border-red-300 bg-white py-3.5 font-bold text-red-700 transition-colors hover:bg-red-50"
      >
        Log out
      </button>
    </div>
  );
            }
