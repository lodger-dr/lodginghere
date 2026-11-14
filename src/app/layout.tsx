import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { auth0 } from '@/lib/auth0';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student Accommodation Marketplace — Verified Campus Lodges',
  description:
    'Find genuine student accommodation across universities in Nigeria. Verified landlords, transparent pricing, physical inspection before booking, and mutual terms confirmation.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;
  try {
    session = await auth0.getSession();
  } catch (error) {
    console.error('[Auth0] Error in RootLayout getSession:', error);
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased`}>
        <Navbar
          initialUserEmail={session?.user?.email || null}
          initialUserRole={(session?.user?.['https://lodginghere.vercel.app/role'] as any) || (session?.user ? 'student' : null)}
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
