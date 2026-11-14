'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Building2,
  CalendarCheck,
  Scale,
} from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800">
            <Scale className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <span>Fair Accommodation Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Effective Date: November 15, 2026 • Platform Version 2.4
          </p>
        </div>

        {/* Core Anti-Scam & Transparency Notice */}
        <div className="rounded-3xl border border-amber-300 bg-amber-50/60 p-6 sm:p-8 dark:border-amber-900/60 dark:bg-amber-950/20 space-y-4">
          <div className="flex items-center gap-2 text-amber-950 dark:text-amber-300 font-bold text-base">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>Mandatory Marketplace Safety Rules</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            LodgeHere operates under strict consumer protection principles. All users agree to these binding rules:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-950 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-700 dark:text-amber-400">1.</span>
              <span><strong>Never pay before physical inspection:</strong> Students must never transfer money before physically walking through the room.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-700 dark:text-amber-400">2.</span>
              <span><strong>Zero hidden fees:</strong> Quoted prices must accurately reflect all mandatory upfront costs without surprise surcharges.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-700 dark:text-amber-400">3.</span>
              <span><strong>Zero fake reviews:</strong> No fabricated endorsements, artificial 5-star ratings, or coerced feedback.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-700 dark:text-amber-400">4.</span>
              <span><strong>No dark patterns:</strong> False urgency countdowns, bait-and-switch rooms, and confirm-shaming are strictly forbidden.</span>
            </div>
          </div>
        </div>

        {/* Detailed Terms */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
            <p>
              By accessing, browsing, registering an account, or scheduling an inspection on LodgeHere (the &quot;Platform&quot;),
              you agree to be bound by these Terms of Service and our{' '}
              <Link href="/privacy" className="text-emerald-700 font-semibold underline dark:text-emerald-400">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/cookies" className="text-emerald-700 font-semibold underline dark:text-emerald-400">
                Cookie Policy
              </Link>.
              If you do not agree to these terms, you must not access or use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. User Accounts & Eligibility</h2>
            <p>
              The platform is open to university students, guardians, verified property owners, and accredited caretakers.
              You agree to provide accurate, truthful, and complete information during registration and inspection scheduling.
              You are responsible for safeguarding your login credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Upfront Pricing Transparency & No Hidden Fees</h2>
            <p>
              LodgeHere requires 100% transparent itemization of all financial components associated with campus accommodation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Annual rent must be clearly declared.</li>
              <li>Any mandatory caution deposit, maintenance service charge, or tenancy agreement fee must be itemized upfront in the listing pricing breakdown.</li>
              <li>Landlords and agents are prohibited from introducing undisclosed inspection &quot;viewing fees&quot;, gate-pass fees, or unlisted commissions upon physical arrival.</li>
              <li>Any listing found to demand unadvertised fees will be suspended immediately.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Physical Inspection Policy & Tenant Protection</h2>
            <p>
              To ensure safety and eliminate middleman rental scams across Nigerian universities:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Physical in-person inspection is free of charge and carries zero advance financial commitment.</li>
              <li>Students must physically verify running water, electricity meters, security doors, and room locks before executing any lease agreement.</li>
              <li>LodgeHere will never instruct or request any student to transfer funds into personal bank accounts prior to physical verification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Prohibited Conduct, Dark Patterns & Manipulation</h2>
            <p>
              Users and listing providers agree never to engage in deceptive commercial practices, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Dark Patterns:</strong> Implementing artificial countdown timers, fake &quot;only 1 room left&quot; pressure tactics, or misleading CTA buttons.</li>
              <li><strong>Fake Reviews:</strong> Fabricating reviews, inflating star ratings without verified student tenancy, or incentivizing false testimonials.</li>
              <li><strong>Bait and Switch:</strong> Advertising a high-standard room but assigning the student a sub-standard alternative upon physical inspection.</li>
              <li><strong>Unauthorized Agent Representation:</strong> Advertising properties without verified legal authorization or ownership documentation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Landlord Verification Standards</h2>
            <p>
              Listing providers must complete identity verification by uploading authentic government identification (NIN slip, driver&apos;s license, international passport) and documented authority over the property (Deed, C of O, or signed Management Agreement). Documents are verified by LodgeHere administrators and stored in encrypted, non-public storage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Account Termination & Data Deletion</h2>
            <p>
              You have the right to terminate your account and request complete deletion of your personal data at any time.
              To exercise this right, visit our{' '}
              <Link href="/data-deletion" className="text-emerald-700 font-semibold underline dark:text-emerald-400">
                Data Deletion Request Portal
              </Link>.
              We reserve the right to suspend or terminate accounts that violate these terms, attempt fraud, or fail safety verifications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Limitation of Liability</h2>
            <p>
              LodgeHere operates an informational listing and inspection scheduling platform. While we conduct rigorous identity and document checks, the formal tenancy agreement and financial lease transactions occur directly between the student (or guardian) and the property owner. LodgeHere is not a party to the lease contract.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">9. Dispute Resolution & Contact</h2>
            <p>
              If a dispute arises regarding a listing or inspection, users should report the issue via our{' '}
              <Link href="/report" className="text-emerald-700 font-semibold underline dark:text-emerald-400">
                Resolution Center
              </Link>{' '}
              or reach our support team at <a href="mailto:support@lodgehere.ng" className="text-emerald-700 underline dark:text-emerald-400 font-semibold">support@lodgehere.ng</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
