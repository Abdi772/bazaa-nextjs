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


const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}


export default function ContactButtons({
  listingId,
  title,
}: {
  listingId: number;
  title: string;
}) {
  const [state, setState] = useState<'loading' | 'out' | 'ready' | 'busy' | 'in'>(
    'loading',
  );
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    async function check() {
      const { data: auth } = await supabase.auth.getSession();
      if (!alive) return;
      if (!auth.session) {
        setState('out');
        setPhone(null);
        setEmail(null);
        return;
      }
      // Keep the contact visible if it was already revealed.
      setState((s) => (s === 'in' || s === 'busy' ? s : 'ready'));
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      check();
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [listingId]);

  // Contacts are only given out one listing at a time, with an hourly
  // limit enforced by the database (get_listing_contact function).
  async function reveal() {
    setState('busy');
    setError('');
    const { data, error: err } = await supabase.rpc('get_listing_contact', {
      p_listing_id: listingId,
    });
    if (err) {
      setState('ready');
      setError(
        err.message.includes('rate_limited')
          ? 'You have viewed many contact details in the last hour. Please try again later.'
          : 'Could not load the contact details. Please try again.',
      );
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    setPhone(row?.phone ?? null);
    setEmail(row?.email ?? null);
    setState('in');
  }

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
          <LockIcon />
          <span className="ml-2">Log in to see contact details</span>
        </button>
      </div>
    );
  }

  if (state === 'ready' || state === 'busy') {
    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={reveal}
          disabled={state === 'busy'}
          className="inline-flex min-h-[50px] w-full items-center justify-center rounded-bazaa bg-inverse px-4 py-3 text-sm font-bold text-onInverse disabled:opacity-60"
        >
          <PhoneIcon />
          <span className="ml-2">
            {state === 'busy' ? 'Loading…' : 'Show contact details'}
          </span>
        </button>
        {error && (
          <p className="mt-2 text-center text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {!phone && !email && (
        <p className="mt-2 text-center text-sm text-muted">
          The seller has not added contact details. Use Chat with seller.
        </p>
      )}

      {phone && (
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="inline-flex min-h-[50px] items-center justify-center rounded-bazaa bg-green px-3 py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
          >
            <span className="mr-2"><PhoneIcon /></span>
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
            <span className="mr-2"><ChatIcon /></span>
            WhatsApp
          </a>
        </div>
      )}

      {email && (
        <a
          href={`mailto:${email}?subject=${encodeURIComponent('Re: ' + title)}`}
          className="mt-2 inline-flex min-h-[50px] w-full items-center justify-center rounded-bazaa border border-ink bg-surface px-4 py-3 text-sm font-bold text-fg transition-colors hover:bg-panel"
        >
          <span className="mr-2"><MailIcon /></span>
          Email seller
        </a>
      )}
    </div>
  );
}
