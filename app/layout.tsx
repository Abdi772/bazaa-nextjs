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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-ink text-paper sticky top-0 z-10 px-5 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <BackButton />
              <Link href="/" className="font-serif text-2xl font-bold">
                Baz<span className="text-amber">aa</span>
              </Link>
            </div>
            <AuthButton />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-5 py-6 pb-24 md:pb-6">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
