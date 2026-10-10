'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function intlPhone(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('0')) d = '251' + d.slice(1);
  else if (d.length === 9) d = '251' + d;
  return d;
}

export default function ContactButtons({
  listingId,
  title,
}: {
  listingId: number;
  title: string;
}) {
  const [state, setState] = useState<'loading' | 'out' | 'in'>('loading');
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) {
        if (alive) setState('out');
        return;
      }
      const { data } = await supabase
        .from('listing_contacts')
.select('phone, email')
.eq('listing_id', listingId)
        .maybeSingle();
      if (!alive) return;
      setPhone(data?.phone ?? null);
      setEmail(data?.email ?? null);
      setState('in');
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [listingId]);

  if (state === 'loading') {
    return (
      <div className="mt-2 animate-pulse space-y-2">
        <div className="h-[50px] rounded-bazaa bg-panel" />
        <div className="h-[50px] rounded-bazaa bg-panel" />
      </div>
    );
  }

  if (state === 'out') {
    return (
      <div className="mt-2 rounded-bazaa border border-line bg-panel p-4 text-center">
        <p className="mb-3 text-sm text-muted">
          Log in to see the seller&apos;s phone number and email. It is free and
          takes a minute.
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('bazaa:open-login'))}
          className="inline-flex min-h-[50px] w-full items-center justify-center rounded-bazaa bg-inverse px-4 py-3 text-sm font-bold text-onInverse"
        >
          🔒 Log in to see contact details
        </button>
      </div>
    );
  }

  return (
    <div>
      {phone && (
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="inline-flex min-h-[50px] items-center justify-center rounded-bazaa bg-green px-3 py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
          >
            <span className="mr-2 text-base">📞</span>
            Call
          </a>
          <a
            href={`https://wa.me/${intlPhone(phone)}?text=${encodeURIComponent(
              'Hi, I am interested in: ' + title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[50px] items-center justify-center rounded-bazaa bg-whatsapp px-3 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <span className="mr-2 text-base">💬</span>
            WhatsApp
          </a>
        </div>
      )}

      {email && (
        <a
          href={`mailto:${email}?subject=${encodeURIComponent('Re: ' + title)}`}
          className="mt-2 inline-flex min-h-[50px] w-full items-center justify-center rounded-bazaa border border-ink bg-surface px-4 py-3 text-sm font-bold text-fg transition-colors hover:bg-panel"
        >
          <span className="mr-2 text-base">✉️</span>
          Email seller
        </a>
      )}
    </div>
  );
            }
