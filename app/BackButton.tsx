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
    <button onClick={goBack} aria-label="Go back" className="pr-3 -ml-1 text-paper">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
