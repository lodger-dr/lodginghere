import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  CalendarCheck,
  FileCheck2,
  Lock,
  Building2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { FaqJsonLd } from '@/components/shared/json-ld';
import { AccordionItem } from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'How It Works — Zero Agent Fees & Verified Inspections',
  description:
    'Learn how LodgeHere eliminates student housing scams in Nigeria with direct landlord verification, zero agent fees, and physical in-person inspection scheduling.',
  alternates: {
    canonical: 'https://lodginghere.vercel.app/how-it-works',
  },
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-16">
      {/* Title */}
      <div className="text-center space-y-3">
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
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Physical In-Person Inspection Policy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Students physically inspect the lodge with the landlord before confirming any room booking. You can schedule
            a viewing date and time directly through the platform.
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
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
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            You reserve the exact room code you physically inspected.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 space-y-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Itemized Upfront Pricing</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Every listing explicitly itemizes annual rent and all mandatory upfront charges: caution deposit, service charge,
            and legal agreement fee.
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
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
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            Clear, transparent agreement on both sides before tenancy begins.
          </p>
        </div>
      </div>

      {/* Three Layers of Listing Verification */}
      <div id="verification" className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 space-y-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Three Layers of Listing Verification</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            What each verification standard means across our listings:
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

      {/* Frequently Asked Questions (AEO & SEO) */}
      <div className="space-y-6">
        <FaqJsonLd />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Everything you need to know about finding verified student accommodation in Nigeria without middlemen.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <AccordionItem
            title="How do I find verified off-campus student accommodation in Nigeria?"
            defaultOpen={true}
            icon={<HelpCircle className="h-4 w-4" />}
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              LodgeHere allows Nigerian university students to discover verified off-campus lodges with transparent pricing, direct landlord contacts, zero agent fees, and mandatory physical inspection scheduling before making any payment.
            </p>
          </AccordionItem>

          <AccordionItem
            title="Are there middleman or agent fees on LodgeHere?"
            icon={<HelpCircle className="h-4 w-4" />}
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              No. LodgeHere operates on a 100% zero agent fee model. Students connect directly with verified property owners and caretakers, avoiding middleman agency and agreement fees typically charged near Nigerian campuses.
            </p>
          </AccordionItem>

          <AccordionItem
            title="How does LodgeHere prevent student accommodation scams in Nigeria?"
            icon={<HelpCircle className="h-4 w-4" />}
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              LodgeHere protects students by verifying landlord identities, verifying property locations near accredited institutions, providing upfront itemized fee breakdowns (rent, caution deposit, service charge), and enforcing in-person physical inspections prior to booking.
            </p>
          </AccordionItem>

          <AccordionItem
            title="Can I physically inspect a student lodge before paying rent?"
            icon={<HelpCircle className="h-4 w-4" />}
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Yes. Every listing on LodgeHere has an integrated physical inspection scheduler. Students can select convenient date and time slots to meet the caretaker at the property and inspect water, power, security, and room conditions in person.
            </p>
          </AccordionItem>

          <AccordionItem
            title="Which Nigerian universities does LodgeHere support?"
            icon={<HelpCircle className="h-4 w-4" />}
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              LodgeHere covers all major Nigerian tertiary institutions including University of Lagos (UNILAG), University of Ibadan (UI), Obafemi Awolowo University (OAU), University of Nigeria Nsukka (UNN), University of Benin (UNIBEN), Federal University of Technology Akure (FUTA), University of Ilorin (UNILORIN), Ahmadu Bello University (ABU), and Lagos State University (LASU).
            </p>
          </AccordionItem>

          <AccordionItem
            title="What amenities are essential in a Nigerian off-campus student lodge?"
            icon={<HelpCircle className="h-4 w-4" />}
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Crucial amenities include constant borehole running water, individual prepaid electricity meters, backup power (solar inverter or generator), secure gated perimeter fencing, and close proximity (walkable or single shuttle) to the campus gate.
            </p>
          </AccordionItem>
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
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 cursor-pointer"
          >
            <span>Start Exploring Lodges</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
