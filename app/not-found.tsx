import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-12 text-center sm:py-16">
      <div className="bazaa-card p-6 sm:p-8">
        <div className="font-serif text-5xl font-bold text-amberText">
          404
        </div>

        <h1 className="bazaa-title mt-2 text-2xl">
          Page not found
        </h1>

        <p className="bazaa-muted mt-2">
          This page does not exist or may have been moved.
        </p>

        <Link href="/" className="bazaa-primary mt-6 w-full sm:w-auto">
          Back to home
        </Link>
      </div>
    </div>
  );
}
