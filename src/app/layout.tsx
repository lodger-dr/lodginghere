import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LodgeHere — Verified Student Accommodation Across Nigerian Campuses',
  description:
    'Find genuine student accommodation near your university. Verified landlords, 100% transparent upfront pricing, and direct physical inspections.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
