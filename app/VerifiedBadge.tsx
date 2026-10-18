// Small blue check shown next to a verified seller's name.
// Works in both server and client pages.
export default function VerifiedBadge({
  className = 'h-4 w-4',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`inline-block shrink-0 ${className}`}
      role="img"
      aria-label="Verified seller"
    >
      <title>Verified seller</title>
      <circle cx="12" cy="12" r="11" fill="#1d9bf0" />
      <path
        d="M7 12.5l3.2 3.2L17 8.8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
