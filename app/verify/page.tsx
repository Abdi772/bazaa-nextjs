'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { compressImage } from '../../lib/compressImage';
import VerifiedBadge from '../VerifiedBadge';

type Latest = {
  status: 'pending' | 'approved' | 'rejected';
  reject_reason: string | null;
  created_at: string;
};

const MAX_MB = 10;
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const labelClass = 'mb-1.5 block text-sm font-bold text-fg';

export default function VerifyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [verified, setVerified] = useState(false);
  const [latest, setLatest] = useState<Latest | null>(null);

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [shopFile, setShopFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function loadStatus(uid: string) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('verified')
      .eq('id', uid)
      .maybeSingle();
    setVerified(!!prof?.verified);

    const { data: req } = await supabase
      .from('seller_verifications')
      .select('status, reject_reason, created_at')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    setLatest((req as Latest | null) ?? null);
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) await loadStatus(data.user.id);
      setReady(true);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!user) return;

    const name = fullName.trim();
    if (name.length < 3) {
      setError('Please enter your full name as it appears on your ID.');
      return;
    }
    if (!idFile) {
      setError('Please add a photo of your ID.');
      return;
    }
    const bad = [idFile, shopFile].find(
      (f) => f && (!OK_TYPES.includes(f.type) || f.size > MAX_MB * 1024 * 1024),
    );
    if (bad) {
      setError(`Photos must be JPG, PNG or WebP, up to ${MAX_MB} MB each.`);
      return;
    }

    setBusy(true);
    const uploaded: string[] = [];

    try {
      const stamp = Date.now();
      const upload = async (file: File, label: string) => {
        const small = await compressImage(file, 1600, 0.85);
        const path = `${user.id}/${label}-${stamp}.jpg`;
        const { error: upErr } = await supabase.storage
          .from('verification-docs')
          .upload(path, small, {
            contentType: small.type || 'image/jpeg',
            upsert: false,
          });
        if (upErr) throw upErr;
        uploaded.push(path);
        return path;
      };

      const idPath = await upload(idFile, 'id');
      const shopPath = shopFile ? await upload(shopFile, 'shop') : null;

      const { error: insErr } = await supabase
        .from('seller_verifications')
        .insert({
          user_id: user.id,
          full_name: name,
          business_name: businessName.trim() || null,
          id_path: idPath,
          shop_path: shopPath,
        });
      if (insErr) throw insErr;

      await loadStatus(user.id);
    } catch (err) {
      if (uploaded.length > 0) {
        await supabase.storage.from('verification-docs').remove(uploaded);
      }
      const code = (err as { code?: string }).code;
      setError(
        code === '23505'
          ? 'You already have a request waiting for review.'
          : 'Could not send your request. Please check your connection and try again.',
      );
    }

    setBusy(false);
  }

  if (!ready) {
    return (
      <p className="py-10 text-center text-sm font-semibold text-muted">
        Loading...
      </p>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <h1 className="mb-2 text-xl font-bold text-fg">Seller verification</h1>
        <p className="text-sm font-semibold leading-6 text-muted">
          Log in to ask for the verified badge.
        </p>
      </div>
    );
  }

  const back = (
    <Link href="/profile" className="text-sm text-muted underline">
      ← Back to profile
    </Link>
  );

  if (verified) {
    return (
      <div className="mx-auto max-w-xl">
        {back}
        <div className="mt-4 rounded-card border border-line bg-surface p-5 text-center shadow-card">
          <VerifiedBadge className="h-12 w-12" />
          <h1 className="mt-3 text-xl font-bold text-fg">You are verified</h1>
          <p className="mt-1 text-sm leading-6 text-muted">
            Buyers see the blue check next to your name on your listings and
            seller page.
          </p>
        </div>
      </div>
    );
  }

  if (latest?.status === 'pending') {
    return (
      <div className="mx-auto max-w-xl">
        {back}
        <div className="mt-4 rounded-card border border-line bg-surface p-5 shadow-card">
          <h1 className="text-xl font-bold text-fg">Request received</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Your documents are waiting for review. This usually takes a few
            days. Your ID photo is deleted after we decide.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {back}

      <h1 className="mt-4 text-xl font-bold text-fg">Get verified</h1>
      <p className="mt-1 text-sm leading-6 text-muted">
        Verified sellers get a blue check, and buyers trust them more. Send a
        photo of your ID. Only the Bazaa team can see it, and it is deleted
        after we decide.
      </p>

      {latest?.status === 'rejected' && (
        <div className="mt-4 rounded-card border border-red-300 bg-surface p-4 text-sm text-red-700">
          <div className="font-bold">Your last request was not approved.</div>
          {latest.reject_reason && <div className="mt-1">{latest.reject_reason}</div>}
          <div className="mt-1">You can send a new request below.</div>
        </div>
      )}

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="v-name" className={labelClass}>
            Full name (as on your ID)
          </label>
          <input
            id="v-name"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bazaa-input min-h-[48px] font-semibold"
          />
        </div>

        <div>
          <label htmlFor="v-biz" className={labelClass}>
            Shop or business name (optional)
          </label>
          <input
            id="v-biz"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="bazaa-input min-h-[48px] font-semibold"
          />
        </div>

        <div>
          <label htmlFor="v-id" className={labelClass}>
            Photo of your ID
          </label>
          <input
            id="v-id"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
          <p className="mt-1 text-xs text-muted">
            National ID, passport or driver licence. Make sure the text is
            sharp and readable.
          </p>
        </div>

        <div>
          <label htmlFor="v-shop" className={labelClass}>
            Photo of your shop or products (optional)
          </label>
          <input
            id="v-shop"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setShopFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="bazaa-primary min-h-[50px] w-full border border-amberDeep font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Sending...' : 'Send for review'}
        </button>
      </form>
    </div>
  );
  }
