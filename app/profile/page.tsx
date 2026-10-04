 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../LanguageProvider';

const tile =
  'flex min-h-[64px] items-center gap-3 border-b-[2px] border-line bg-white px-4 py-4 text-[15px] font-bold text-ink transition-colors hover:bg-amberSoft';

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
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

  if (!ready) {
    return (
      <p className="py-10 text-center text-sm font-semibold text-muted">
        {t('loading')}
      </p>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <h1 className="mb-2 text-xl font-bold text-ink">
          {t('yourProfile')}
        </h1>

        <p className="text-sm font-semibold leading-6 text-muted">
          {t('profileLoginHint')}
        </p>
      </div>
    );
  }

  const name = user.email?.split('@')[0] ?? 'Me';

  return (
    <div className="mx-auto max-w-xl">
      {/* Profile header */}
      <div className="mb-6 flex items-center gap-4 border-b-[2px] border-line bg-white px-4 py-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber text-2xl font-bold text-ink ring-2 ring-amberSoft">
          {name[0]?.toUpperCase()}
        </div>

        <div className="min-w-0">
          <div className="truncate text-lg font-bold text-ink">
            {name}
          </div>

          <div className="truncate text-sm font-semibold text-muted">
            {user.email}
          </div>
        </div>
      </div>

      {/* Profile menu */}
      <div className="overflow-hidden border-y-[2px] border-line bg-white">
        <Link href="/my-listings" className={tile}>
          <span aria-hidden="true">📋</span>
          <span>{t('myAdverts')}</span>
        </Link>

        <Link href="/saved" className={tile}>
          <span aria-hidden="true">❤️</span>
          <span>{t('saved')}</span>
        </Link>

        <Link href="/messages" className={tile}>
          <span aria-hidden="true">💬</span>
          <span>{t('messages')}</span>
        </Link>

        <Link href="/post" className={tile}>
          <span aria-hidden="true">➕</span>
          <span>{t('postListing')}</span>
        </Link>

        <Link href="/settings" className={tile}>
          <span aria-hidden="true">⚙️</span>
          <span>{t('settings')}</span>
        </Link>

        {isAdmin && (
          <Link href="/admin" className={tile}>
            <span aria-hidden="true">🛡️</span>
            <span>{t('admin')}</span>
          </Link>
        )}
      </div>

      {/* Log out */}
      <button
        type="button"
        onClick={logout}
        className="mt-5 w-full rounded-xl border-[2px] border-red-300 bg-white py-3.5 font-bold text-red-700 transition-colors hover:bg-red-50"
      >
        {t('logout')}
      </button>
    </div>
  );
}
