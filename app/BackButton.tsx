 'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // No back arrow on the home page
  if (pathname === '/') return null;

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push('/');
  }

  return (
    <button
      onClick={goBack}
      aria-label="Go back"
      className="mr-1 flex h-9 w-9 items-center justify-center rounded-full text-paper transition-colors hover:bg-white/10"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
