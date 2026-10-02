 import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

import AuthButton from './AuthButton';
import BottomNav from './BottomNav';
import BackButton from './BackButton';

export const metadata: Metadata = {
  title: 'Bazaa — Buy & Sell Marketplace',
  description: 'Buy and sell anything, right in your area.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased">

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-paper">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">

            <div className="flex min-w-0 items-center">
              <BackButton />

              <Link
                href="/"
                className="font-serif text-2xl font-bold tracking-tight transition-opacity hover:opacity-90"
                aria-label="Bazaa home"
              >
                Baz<span className="text-amber">aa</span>
              </Link>
            </div>

            <AuthButton />

          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-5xl px-5 py-6 pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile navigation */}
        <BottomNav />

      </body>
    </html>
  );
}
