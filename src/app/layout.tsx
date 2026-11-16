import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { MobileBottomNav } from '@/components/shared/mobile-bottom-nav';
import { MobilePwaBanner } from '@/components/shared/mobile-pwa-banner';
import { CookieConsentBanner } from '@/components/shared/cookie-consent-banner';
import { TourProvider } from '@/context/tour-context';
import { AuthProvider } from '@/context/auth-context';
import { GuidedTour } from '@/components/shared/guided-tour';
import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/shared/json-ld';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://lodginghere.vercel.app'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LodgeHere',
  },
  title: {
    default: 'LodgeHere — Verified Student Accommodation Across Nigerian Campuses',
    template: '%s | LodgeHere — Student Accommodation Nigeria',
  },
  description:
    'Find genuine student accommodation near Nigerian universities. Verified landlords, 100% transparent upfront pricing, zero agent fees, and direct physical inspections.',
  applicationName: 'LodgeHere',
  authors: [{ name: 'LodgeHere Team', url: 'https://lodginghere.vercel.app' }],
  generator: 'Next.js',
  keywords: [
    'student accommodation Nigeria',
    'off-campus student lodges',
    'UNILAG hostels and lodges',
    'University of Ibadan student housing',
    'OAU Ile-Ife student accommodation',
    'UNN Nsukka student apartments',
    'UNIBEN student flats',
    'FUTA Akure student lodges',
    'verified student landlords Nigeria',
    'zero agent fee student housing',
    'campus accommodation booking Nigeria',
    'Nigerian university hostels',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'LodgeHere',
  publisher: 'LodgeHere',
  formatDetection: {
    email: false,
    address: true,
    telephone: false,
  },
  alternates: {
    canonical: 'https://lodginghere.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
      'Find genuine student accommodation near your university. Verified landlords, 100% transparent upfront pricing, zero agent fees, and direct physical inspections.',
    url: 'https://lodginghere.vercel.app',
    siteName: 'LodgeHere',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LodgeHere — Verified Student Accommodation Across Nigerian Campuses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LodgeHere — Verified Student Accommodation Across Nigerian Campuses',
    description:
      'Find genuine student accommodation near your university with zero agent fees, verified landlords, and physical inspections.',
    site: '@lodgehere',
    creator: '@lodgehere',
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
        <WebsiteJsonLd />
        <OrganizationJsonLd />
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
        <TourProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
            <MobilePwaBanner />
            <CookieConsentBanner />
            <GuidedTour />
          </AuthProvider>
        </TourProvider>
      </body>
    </html>
  );
}
