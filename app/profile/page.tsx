'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

const tile =
  'bg-white border border-line rounded-xl p-4 flex items-center gap-3 font-semibold';

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
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-14 h-14 rounded-full bg-amber text-ink flex items-center justify-center text-2xl font-bold">
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-lg">{name}</div>
          <div className="text-sm text-muted">{user.email}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
        className="w-full mt-5 border border-red-300 text-red-700 rounded-xl py-3 font-semibold"
      >
        Log out
      </button>
    </div>
  );
            }
