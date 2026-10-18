   'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../LanguageProvider';
import Avatar from '../Avatar';
import { compressImage } from '../../lib/compressImage';

const tile =
  'flex min-h-[64px] items-center gap-3 border-b border-line bg-surface px-4 py-4 text-[15px] font-bold text-fg transition-colors hover:bg-amberSoft';

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState('');

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

        const { data: prof } = await supabase
          .from('profiles')
          .select('avatar_url, name')
          .eq('id', data.user.id)
          .maybeSingle();

        setAvatarUrl((prof?.avatar_url as string | null) ?? null);
        setProfileName((prof?.name as string | null) ?? null);
      }

      setReady(true);
    });
  }, []);

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setAvatarMsg('Please choose a photo.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarMsg('Photo is too large (max 10 MB).');
      return;
    }

    setAvatarBusy(true);
    setAvatarMsg('Uploading...');

    const small = await compressImage(file, 400, 0.85);
    const path = `${user.id}/avatar.jpg`;

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, small, {
        upsert: true,
        contentType: small.type || 'image/jpeg',
        cacheControl: '3600',
      });

    if (upErr) {
      setAvatarMsg('Could not upload: ' + upErr.message);
      setAvatarBusy(false);
      return;
    }

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${pub.publicUrl}?v=${Date.now()}`;

    const { data: updated, error: dbErr } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', user.id)
      .select('id');

    if (dbErr || !updated || updated.length === 0) {
      setAvatarMsg('Photo uploaded but could not be saved. Try again.');
      setAvatarBusy(false);
      return;
    }

    setAvatarUrl(url);
    setAvatarMsg('Photo updated.');
    setAvatarBusy(false);
  }

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
        <h1 className="mb-2 text-xl font-bold text-fg">
          {t('yourProfile')}
        </h1>

        <p className="text-sm font-semibold leading-6 text-muted">
          {t('profileLoginHint')}
        </p>
      </div>
    );
  }

  const name =
    profileName?.trim() ||
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email?.split('@')[0] ||
    'Me';

  return (
    <div className="mx-auto max-w-xl">
      {/* Profile header */}
      <div className="mb-6 flex items-center gap-4 border-b border-line bg-surface px-4 py-4">
        <div className="relative shrink-0">
          <Avatar
            name={name}
            url={avatarUrl}
            className="h-16 w-16 text-2xl ring-2 ring-amberSoft"
          />
          <label
            className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-surface bg-inverse text-xs text-onInverse"
            aria-label="Change profile photo"
          >
            <span aria-hidden="true">📷</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickAvatar}
              disabled={avatarBusy}
            />
          </label>
        </div>

        <div className="min-w-0">
          <div className="truncate text-lg font-bold text-fg">
            {name}
          </div>

          <div className="truncate text-sm font-semibold text-muted">
            {user.email}
          </div>

          {avatarMsg && (
            <div className="mt-1 text-xs font-semibold text-muted">
              {avatarMsg}
            </div>
          )}
        </div>
      </div>

      {/* Profile menu */}
      <div className="overflow-hidden border-y border-line bg-surface">
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

        <Link href="/verify" className={tile}>
          <span aria-hidden="true">✅</span>
          <span>Get verified</span>
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
        className="mt-5 w-full rounded-xl border border-red-300 bg-surface py-3.5 font-bold text-red-700 transition-colors hover:bg-red-50"
      >
        {t('logout')}
      </button>
    </div>
  );
}
