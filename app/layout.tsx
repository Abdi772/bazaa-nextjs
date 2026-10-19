   import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Fraunces, Plus_Jakarta_Sans, Noto_Sans_Ethiopic } from 'next/font/google';
import './globals.css';

import AuthButton from './AuthButton';
import BottomNav from './BottomNav';
import BackButton from './BackButton';
import ThemeButton from './ThemeButton';
import TextSize from './TextSize';
import SiteFooter from './SiteFooter';
import Heartbeat from './Heartbeat';
import { LanguageProvider } from './LanguageProvider';
import { SITE_URL } from '@/lib/siteUrl';

const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

// Amharic (Ge'ez) fallback. preload:false means phones only download it
// when a page actually contains Ethiopic characters.
const ethiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  display: 'swap',
  variable: '--font-ethiopic',
  preload: false,
});

const themeScript = `(function(){try{var t=localStorage.getItem('bazaa-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.bazaaTheme=t;var z=[87.5,100,112.5,125,137.5][Number(localStorage.getItem('bazaa-text-size'))];if(z){document.documentElement.style.fontSize=z+'%';}}catch(e){}})();`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#19182B',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Bazaa',
  title: 'Bazaa — Buy & Sell Marketplace',
  description: 'Buy and sell anything, right in your area.',
  openGraph: {
    title: 'Bazaa — Buy & Sell Marketplace',
    description: 'Buy and sell anything, right in your area.',
    siteName: 'Bazaa',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${ethiopic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bazaa-page min-h-screen antialiased">
        <LanguageProvider>
          <Heartbeat />

          <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-paper shadow-[0_1px_0_rgba(255,255,255,0.04)]">
            <div className="mx-auto flex min-h-[64px] max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <BackButton />

                <Link
                  href="/"
                  aria-label="Bazaa home"
                  className="shrink-0 font-serif text-[23px] font-bold tracking-tight sm:text-2xl"
                >
                  Baz<span className="text-amber">aa</span>
                </Link>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <TextSize />
                <ThemeButton />
                <AuthButton />
              </div>
            </div>
          </header>

          <main className="mx-auto min-h-[calc(100vh-64px)] max-w-5xl overflow-x-hidden px-4 py-5 pb-6 sm:px-5 sm:py-6">
            {children}
          </main>

          <SiteFooter />

          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
