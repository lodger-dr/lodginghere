'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, SlidersHorizontal, Building2, CheckCircle2 } from 'lucide-react';
import { Logo } from './logo';
import { openCookiePreferencesModal } from './cookie-consent-banner';

export function Footer() {
  const pathname = usePathname();

  // The footer appears on public static pages (e.g. terms, privacy), excluded from app views
  const isDashboard = Boolean(
    pathname &&
    (pathname === '/' ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/student') ||
      pathname.startsWith('/landlord') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/lodges/'))
  );

  if (isDashboard) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 dark:border-slate-800/80 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 px-4 py-8 space-y-6">
      {/* Brand & Mission Statement */}
      <div className="space-y-3">
        <Logo />
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Nigeria’s trusted student accommodation platform. Direct verified landlords, transparent upfront pricing, and mandatory in-person physical inspections.
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Direct Landlords • Zero Agent Fee</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Never pay rent in advance before physically entering the room and testing facilities.
          </p>
        </div>
      </div>

      {/* Mobile App Navigation Grid */}
      <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Explore
          </h4>
          <ul className="space-y-1.5">
            <li>
              <Link href="/explore" className="hover:text-blue-600 transition-colors">
                Explore Lodges
              </Link>
            </li>
            <li>
              <Link href="/universities" className="hover:text-blue-600 transition-colors">
                Campuses Directory
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-blue-600 transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/landlord/properties" className="hover:text-blue-600 transition-colors">
                List Your Property
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Trust & Legal
          </h4>
          <ul className="space-y-1.5">
            <li>
              <Link href="/how-it-works#verification" className="hover:text-blue-600 transition-colors">
                Verification Model
              </Link>
            </li>
            <li>
              <Link href="/report" className="hover:text-blue-600 transition-colors">
                Report a Scam
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Cookie Preferences and Mobile App Stamp */}
      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center gap-2 text-center">
        <button
          type="button"
          onClick={openCookiePreferencesModal}
          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline cursor-pointer"
        >
          Cookie Preferences
        </button>

        <p className="text-[10px] text-slate-400">
          © {new Date().getFullYear()} LodgeHere Mobile App. Verified Nigerian Campus Accommodations.
        </p>
      </div>
    </footer>
  );
}
