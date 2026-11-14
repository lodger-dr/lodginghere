import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CalendarCheck,
  FileCheck2,
  Lock,
  Building2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>LodgeHere Standards</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          How LodgeHere Works
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The verified student accommodation network. We remove middleman uncertainty through upfront fee transparency,
          landlord verification, and physical inspection before booking.
        </p>
      </div>

      {/* 4 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 space-y-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Physical Inspection Guarantee</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Students physically inspect the lodge with the landlord before confirming any room booking. You can schedule
            a viewing date and time directly through the platform.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            Verify water pressure, electricity availability, and security in person first.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 space-y-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
            <Building2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Room-Level Accuracy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Availability is tracked at the specific room level. Each listing itemizes room codes (e.g., Room 104, Block B Room 3),
            private bathroom status, and occupancy.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            You reserve the exact room code you physically inspected.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 space-y-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. 100% Upfront Pricing</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Every listing explicitly itemizes annual rent and all mandatory upfront charges: caution deposit, service charge,
            and legal agreement fee.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            Zero surprise fees when meeting the landlord.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 space-y-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. Mutual Terms Record</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Once an inspection is completed, the student submits a booking request. The landlord confirms the terms snapshot,
            creating an accountable mutual record.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            Clear, transparent agreement on both sides before tenancy begins.
          </p>
        </div>
      </div>

      {/* Verification Model Detail */}
      <div id="verification" className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 space-y-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-3 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4" />
            <span>Verification Model</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Three Layers of Listing Verification</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            What each badge means across our listings:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-2 dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Identity Verified</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The property host has submitted valid government identification cross-checked by platform administrators.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-2 dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Authority Verified</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The host has provided title deeds or documented legal authority to let the accommodation on behalf of the owner.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-2 dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Fresh Availability</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The landlord reconfirms active room vacancies periodically. Stale listings are automatically delisted.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white text-sm block">Safety Guidelines</span>
          <p className="leading-relaxed text-slate-500 dark:text-slate-400">
            Never send rent payments before attending a scheduled physical inspection and confirming the room in person.
            LodgeHere facilitates verified discovery and viewing coordination.
          </p>
        </div>
      </div>

      {/* Startup CTA */}
      <div className="text-center pt-4">
        <Link href="/explore">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-black dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 cursor-pointer"
          >
            <span>Start Exploring Lodges</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
