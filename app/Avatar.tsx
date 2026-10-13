// Round profile picture. Shows the real photo when there is one,
// otherwise the first letter of the name. Works in server and client pages.
export default function Avatar({
  name,
  url,
  className = 'h-9 w-9 text-base',
}: {
  name?: string | null;
  url?: string | null;
  className?: string;
}) {
  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-inverse font-serif font-bold text-onInverse ${className}`}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </div>
  );
}
