import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="font-serif text-xl font-bold mb-2">Listing not found</h2>
      <p className="text-muted mb-4">This listing may have been removed or sold.</p>
      <Link href="/" className="text-amber underline">
        Back to all listings
      </Link>
    </div>
  );
}
