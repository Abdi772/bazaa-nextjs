'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-12 text-center sm:py-16">
      <div className="bazaa-card p-6 sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-dangerSoft text-2xl">
          ⚠️
        </div>

        <h1 className="bazaa-title text-2xl">
          Something went wrong
        </h1>

        <p className="bazaa-muted mt-2">
          We could not load this page. Please try again.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="bazaa-primary w-full sm:w-auto"
          >
            Try again
          </button>

          <Link
            href="/"
            className="bazaa-secondary w-full sm:w-auto"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
