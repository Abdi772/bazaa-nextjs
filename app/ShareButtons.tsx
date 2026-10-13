'use client'; 
import { useState } from 'react';

export default function ShareButtons({
  title,
  price,
}: {
  title: string;
  price: number;
}) {
  const [copied, setCopied] = useState(false);

  const link = () => window.location.href;
  const message = () =>
    `${title} – ETB ${Number(price).toLocaleString()} on Bazaa`;

  function open(href: string) {
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  function whatsapp() {
    open(
      `https://wa.me/?text=${encodeURIComponent(`${message()}\n${link()}`)}`,
    );
  }

  function telegram() {
    open(
      `https://t.me/share/url?url=${encodeURIComponent(
        link(),
      )}&text=${encodeURIComponent(message())}`,
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', link());
    }
  }

  const btn =
    'inline-flex min-h-[46px] items-center justify-center rounded-bazaa px-3 text-sm font-bold transition-opacity hover:opacity-90';

  return (
    <section className="mb-5 rounded-card border border-line bg-surface p-4 shadow-card">
      <div className="mb-3 text-sm font-bold text-fg">Share this ad</div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={whatsapp}
          className={`${btn} bg-whatsapp text-white`}
        >
          WhatsApp
        </button>

        <button
          type="button"
          onClick={telegram}
          className={`${btn} bg-[#229ED9] text-white`}
        >
          Telegram
        </button>

        <button
          type="button"
          onClick={copy}
          className={`${btn} border border-line bg-surface text-fg`}
        >
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
      </div>
    </section>
  );
}
