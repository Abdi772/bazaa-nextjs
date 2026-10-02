 import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

import AuthButton from './AuthButton';
import BottomNav from './BottomNav';
import BackButton from './BackButton';
import ThemeButton from './ThemeButton';

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
      <body className="bazaa-page min-h-screen antialiased">

        {/* Bazaa Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-paper">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">

            <div className="flex min-w-0 items-center gap-2">
              <BackButton />

              <Link
                href="/"
                aria-label="Bazaa home"
                className="font-serif text-2xl font-bold tracking-tight"
              >
                Baz<span className="text-amber">aa</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeButton />
              <AuthButton />
            </div>

          </div>
        </header>

        {/* Page */}
        <main className="mx-auto min-h-[calc(100vh-72px)] max-w-5xl px-5 py-6 pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />

      </body>
    </html>
  );
}
