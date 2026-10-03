 'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // No back arrow on the home page
  if (pathname === '/') return null;

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      title="Go back"
      className="
        mr-1 flex h-11 w-11 shrink-0
        items-center justify-center
        rounded-full
        border border-white/10
        bg-white/5
        text-paper
        transition-all duration-200
        hover:border-amber/50
        hover:bg-white/10
        hover:text-amber
        active:scale-95
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-amber
      "
    >
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
