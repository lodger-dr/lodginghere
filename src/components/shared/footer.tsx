import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1: Descriptor & Trust Note */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-base font-bold text-white">Student Accommodation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find verified lodges around universities across Nigeria without the stress. Discovery, physical
              inspection scheduling, and mutual booking confirmation.
            </p>
            <div className="rounded-lg border border-slate-800 bg-slate-800/60 p-3 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Inspection Before Booking</span>
              </div>
              <p className="text-[11px] text-slate-400">
                The platform does not process rental payments. Physical inspections must occur before a booking request.
              </p>
            </div>
          </div>

          {/* Column 2: Marketplace */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Marketplace</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors">
                  Explore Lodges
                </Link>
              </li>
              <li>
                <Link href="/universities" className="hover:text-emerald-400 transition-colors">
                  University Directory
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/register?role=landlord" className="hover:text-emerald-400 transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Trust & Safety</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/how-it-works#verification" className="hover:text-emerald-400 transition-colors">
                  Verification Model
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#inspection-rules" className="hover:text-emerald-400 transition-colors">
                  Inspection Rules
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-emerald-400 transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-500 block pt-1">
                  Three-tier checks: Landlord Identity, Property Authority, Room Availability.
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Notice */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Legal & Compliance</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/how-it-works#terms" className="hover:text-emerald-400 transition-colors">
                  Platform Terms
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="mt-4 text-xs text-slate-500">
              Booking confirmation is a mutual record of agreed terms, not a legal tenancy agreement or proof of payment.
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Student Accommodation Marketplace. Built for Nigerian Universities.</p>
        </div>
      </div>
    </footer>
  );
}

