import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { CookieConsentBanner } from '@/components/shared/cookie-consent-banner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://lodginghere.vercel.app'),
  title: 'LodgeHere — Verified Student Accommodation Across Nigerian Campuses',
  description:
    'Find genuine student accommodation near your university. Verified landlords, 100% transparent upfront pricing, and direct physical inspections.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'LodgeHere — Verified Student Accommodation Across Nigerian Campuses',
    description:
      'Find genuine student accommodation near your university. Verified landlords, 100% transparent upfront pricing, and direct physical inspections.',
    url: 'https://lodginghere.vercel.app',
    siteName: 'LodgeHere',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LodgeHere Logo and Student Housing',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LodgeHere — Verified Student Accommodation Across Nigerian Campuses',
    description:
      'Find genuine student accommodation near your university. Verified landlords, 100% transparent upfront pricing, and direct physical inspections.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('lodgehere_theme');
                  var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && supportDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 transition-colors duration-150`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
