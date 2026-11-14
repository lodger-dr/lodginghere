import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Logo inverted />
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation verified student accommodation across Nigerian universities. Upfront pricing,
              direct landlord contact, and physical room inspections.
            </p>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Physical Inspection Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Room inspections must occur in person with the landlord before booking confirmations are created.
              </p>
            </div>
          </div>

          {/* Column 2: Discover */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors">
                  Explore Lodges
                </Link>
              </li>
              <li>
                <Link href="/universities" className="hover:text-emerald-400 transition-colors">
                  Universities Directory
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/landlord/properties" className="hover:text-emerald-400 transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Trust & Safety</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/how-it-works#verification" className="hover:text-emerald-400 transition-colors">
                  Verification Standards
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#inspection-rules" className="hover:text-emerald-400 transition-colors">
                  Inspection Protocols
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-emerald-400 transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 block pt-1 leading-relaxed">
                  3-tier checks: Landlord Identity, Property Authority, Live Vacancy Status.
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Notice */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase">Legal</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/how-it-works#terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="mt-4 text-[11px] text-slate-500 leading-relaxed">
              LodgeHere operates as a verified discovery and inspection coordination platform.
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-900 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LodgeHere Inc. Built for Nigerian University Campuses.</p>
        </div>
      </div>
    </footer>
  );
}
