'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

// Last-resort error page. Runs when the whole layout crashes.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          background: '#F7F5F0',
          color: '#222238',
          margin: 0,
          padding: '4rem 1rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.5rem' }}>Something went wrong</h1>
        <p style={{ color: '#777783' }}>
          Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            border: 0,
            borderRadius: '0.5rem',
            background: '#D99024',
            color: '#000',
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
