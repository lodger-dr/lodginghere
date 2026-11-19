'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, SlidersHorizontal, Building2, CheckCircle2 } from 'lucide-react';
import { Logo } from './logo';
import { openCookiePreferencesModal } from './cookie-consent-banner';

export function Footer() {
  const pathname = usePathname();

  // The footer appears on the landing page and public info pages, excluded from app flows
  const isDashboard = Boolean(
    pathname &&
    (pathname.startsWith('/onboarding') ||
      pathname.startsWith('/student') ||
      pathname.startsWith('/landlord') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/lodges/'))
  );

  if (isDashboard) {
    return null;
  }

  return (
    <footer className="border-t border-[#E8E8E5] bg-white text-slate-600 px-4 sm:px-6 py-12 space-y-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Mission Statement */}
        <div className="space-y-3 md:col-span-2">
          <Logo />
          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
            Nigeria’s trusted student accommodation discovery platform. Find verified off-campus lodges around your university gate with zero agent fees, direct landlord contacts, and mandatory free physical inspections.
          </p>

          <div className="rounded-2xl border border-[#E8E8E5] bg-[#FFF0E9]/40 p-3.5 text-xs space-y-1 max-w-md">
            <div className="flex items-center gap-1.5 font-bold text-[#24272B]">
              <ShieldCheck className="h-4 w-4 text-[#F45B2A] shrink-0" />
              <span>Direct Landlords • 0% Agent & Legal Fees</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Never pay rent before physically entering the lodge and inspecting the room facilities in person.
            </p>
          </div>
        </div>

        {/* Explore Links */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-black text-[#24272B] uppercase tracking-wider">
            Explore Campuses
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/student/explore" className="font-bold text-[#F45B2A] hover:underline flex items-center gap-1">
                <span>Interactive Map Discovery</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/universities" className="hover:text-[#F45B2A] transition-colors">
                All 328 Universities
              </Link>
            </li>
            <li>
              <Link href="/student/explore?university=abia-state-university" className="hover:text-[#F45B2A] transition-colors">
                Abia State University (ABSU)
              </Link>
            </li>
            <li>
              <Link href="/student/explore?university=university-of-nigeria" className="hover:text-[#F45B2A] transition-colors">
                University of Nigeria (UNN)
              </Link>
            </li>
            <li>
              <Link href="/student/explore?university=university-of-lagos" className="hover:text-[#F45B2A] transition-colors">
                University of Lagos (UNILAG)
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-[#F45B2A] transition-colors">
                List Lodge as Landlord
              </Link>
            </li>
          </ul>
        </div>

        {/* Trust & Legal */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-black text-[#24272B] uppercase tracking-wider">
            Trust & Safety
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/how-it-works" className="hover:text-[#F45B2A] transition-colors">
                How LodgeHere Works
              </Link>
            </li>
            <li>
              <Link href="/report" className="hover:text-[#F45B2A] transition-colors">
                Report Suspicious Listing
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#F45B2A] transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#F45B2A] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/data-deletion" className="hover:text-[#F45B2A] transition-colors">
                Student Data Protection
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Cookie Preferences and Mobile App Stamp */}
      <div className="pt-6 border-t border-[#E8E8E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p className="text-[11px]">
          © {new Date().getFullYear()} LodgeHere. Built for Nigerian tertiary institution students.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openCookiePreferencesModal}
            className="text-[11px] font-semibold text-slate-600 hover:text-[#F45B2A] underline cursor-pointer"
          >
            Cookie Preferences
          </button>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-bold text-[#24272B]">
            PWA Standalone Ready 📱
          </span>
        </div>
      </div>
    </footer>
  );
}
