'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { Logo } from './logo';
import { openCookiePreferencesModal } from './cookie-consent-banner';

export function Footer() {
  const pathname = usePathname();

  // The footer appears on all public views, excluded from student/landlord/admin dashboard views
  const isDashboard = Boolean(
    pathname &&
      (pathname.startsWith('/student') ||
        pathname.startsWith('/landlord') ||
        pathname.startsWith('/admin'))
  );

  if (isDashboard) {
    return null;
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <Logo inverted />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Next-generation verified student accommodation across Nigerian universities. Upfront pricing transparency,
              direct landlord contact, and mandatory physical room inspections before lease agreements.
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-400 space-y-1 max-w-sm">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>Physical In-Person Inspection Standard</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Room inspections occur in person directly with the verified property manager before any tenancy booking is confirmed.
              </p>
            </div>
          </div>

          {/* Column 2: Discover */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Explore Lodges
                </Link>
              </li>
              <li>
                <Link href="/universities" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Universities Directory
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/landlord/properties" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Trust &amp; Safety</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/how-it-works#verification" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Landlord Verification Model
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#pricing" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Transparent Pricing Rules
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Report a Listing or Scam
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Licenses &amp; Attributions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Privacy */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Legal &amp; Privacy</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferencesModal}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded cursor-pointer"
                >
                  <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
                  <span>Cookie Settings</span>
                </button>
              </li>
              <li>
                <Link href="/data-deletion" className="hover:text-rose-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded">
                  Request Data Deletion
                </Link>
              </li>
              <li>
                <Link href="/unsubscribe" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded">
                  Email Unsubscribe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LodgeHere. Built for genuine Nigerian students &amp; verified property owners.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-slate-300 transition-colors">
              Cookies
            </Link>
            <Link href="/data-deletion" className="hover:text-slate-300 transition-colors">
              Data Erasure
            </Link>
            <Link href="/licenses" className="hover:text-slate-300 transition-colors">
              Licenses
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
