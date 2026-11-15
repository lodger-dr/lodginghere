'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  EyeOff,
  Trash2,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Effective Date: November 15, 2026 • Last Reviewed: November 2026
          </p>
        </div>

        {/* Quick Highlights Box */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Our Core Data Privacy Guarantees</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Strict Data Minimization</strong>
                We only request what is strictly necessary to arrange student inspections and verify properties.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Zero Third-Party Data Sales</strong>
                We never sell, rent, or monetize student or landlord contact info with data brokers or advertisers.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Encrypted Private Documents</strong>
                Landlord government identity and proof of authority are stored in encrypted, isolated administrative buckets.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="block text-slate-900 dark:text-white">Self-Service Erasure Option</strong>
                You can submit a complete account and personal data deletion request anytime.
              </div>
            </div>
          </div>
        </div>

        {/* Full Document Sections */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Introduction & Data Controller</h2>
            <p>
              LodgeHere (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the verified campus accommodation marketplace connecting
              Nigerian university students directly with legitimate property owners and verified managers.
            </p>
            <p>
              Under the Nigeria Data Protection Act (NDPA 2023), the Nigeria Data Protection Regulation (NDPR 2019), and international standards including the General Data Protection Regulation (GDPR), LodgeHere acts as the Data Controller responsible for safeguarding your personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. What Data We Collect & What We Never Collect</h2>
            <p>
              In accordance with the principle of <strong>Data Minimization</strong>, we do not collect excessive, unnecessary, or irrelevant personal data.
            </p>
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">A. Information We Collect:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>For Students:</strong> Full name, university email address, phone number (used only to coordinate agreed physical inspections), university association, and inspection logs.</li>
                <li><strong>For Property Managers & Landlords:</strong> Full legal name, business trade name, phone number, property address, and verification documentation (government ID such as NIN/Driver&apos;s License and proof of property ownership or legal authority).</li>
                <li><strong>Technical Data:</strong> Essential session cookies, user theme preference (light/dark mode), and coarse browser data for security rate-limiting.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-1.5 dark:border-amber-900/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 mt-3">
              <div className="flex items-center gap-2 font-bold text-xs">
                <EyeOff className="h-4 w-4 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                <span>Data We Explicitly Refuse to Collect:</span>
              </div>
              <p className="text-xs leading-relaxed">
                We do NOT collect Bank Verification Numbers (BVN), payment card PINs, banking credentials, racial/ethnic identity, political opinions, religious beliefs, biometric facial scans, or mothers&apos; maiden names.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Lawful Basis & Purposes for Processing</h2>
            <p>We process your data strictly on the following lawful bases:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contractual Necessity:</strong> To process and schedule your physical inspection appointments, register your user profile, and display property vacancies.</li>
              <li><strong>Legitimate Interest & Safety:</strong> To prevent fraud, verify that accommodation listings are physical, authentic spaces, and protect students from unauthorized middlemen scams.</li>
              <li><strong>Legal Compliance:</strong> To comply with tenancy laws and Nigerian digital commerce statutory requirements.</li>
              <li><strong>Consent:</strong> For any optional preferences or communications, which you may freely revoke at any time.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Data Sharing & Third-Party Disclosure</h2>
            <p>
              We do not sell personal data. Information is shared only in the following strictly limited contexts:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Inspection Coordination:</strong> When a student submits a physical inspection request, their name, phone number, and requested date/time slot are transmitted to the verified landlord/caretaker for that specific lodge.</li>
              <li><strong>Infrastructure Service Providers:</strong> Encrypted hosting and authentication infrastructure (Supabase and Vercel) operating under strict data protection addenda.</li>
              <li><strong>Law Enforcement & Safety:</strong> Where strictly required by a competent court of law or lawful governmental inquiry.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Cookies & Local Storage</h2>
            <p>
              We employ essential local storage keys and cookies for authentication and display preferences. Non-essential analytical cookies are disabled by default until you grant explicit consent.
            </p>
            <p>
              To inspect, modify, or withdraw your cookie choices at any time, visit our{' '}
              <Link href="/cookies" className="text-blue-600 font-semibold underline dark:text-blue-400">
                Cookie Policy & Preferences Center
              </Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Your Rights & Data Deletion (Right to Erasure)</h2>
            <p>
              Under the NDPA 2023 and GDPR, you possess absolute rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Right of Access:</strong> Request a complete export of your personal data held by LodgeHere.</li>
              <li><strong>Right to Rectification:</strong> Update inaccurate or outdated profile information.</li>
              <li><strong>Right to Erasure (Data Deletion):</strong> Request the permanent purge of your profile, contact records, inspection history, and uploaded documents.</li>
              <li><strong>Right to Opt-Out:</strong> Unsubscribe from non-essential emails with a single click.</li>
            </ul>

            <div className="pt-2">
              <Link href="/data-deletion">
                <Button variant="outline" size="sm" className="gap-2 border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>Request Account & Data Deletion</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Email Communication & Unsubscribe Rights</h2>
            <p>
              We only send essential transactional emails regarding inspection appointments and security resets. Promotional campus digests are optional. Every email includes a clear one-click unsubscribe mechanism. You can also manage notification preferences at any time on our{' '}
              <Link href="/unsubscribe" className="text-blue-600 font-semibold underline dark:text-blue-400">
                Email Unsubscribe Portal
              </Link>.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Contact Our Data Protection Officer</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or LodgeHere&apos;s data practices, please contact our Data Protection Officer:
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850 text-xs space-y-1">
              <p><strong>Data Protection Officer (DPO)</strong> — LodgeHere Technology Services</p>
              <p>Email: <a href="mailto:privacy@lodgehere.ng" className="text-blue-600 underline dark:text-blue-400 font-semibold">privacy@lodgehere.ng</a></p>
              <p>Location: Yaba, Lagos State, Nigeria</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
