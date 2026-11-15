'use client';

import React from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, SlidersHorizontal, CheckCircle2, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openCookiePreferencesModal } from '@/components/shared/cookie-consent-banner';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Cookie Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Learn how LodgeHere uses cookies and client-side storage technologies, and how you can manage your preferences.
          </p>
        </div>

        {/* Interactive Preferences Action Box */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Your Current Consent Settings</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              You can review or change your cookie consent preferences at any time. Non-essential cookies remain disabled until you explicitly opt in.
            </p>
          </div>

          <Button
            type="button"
            onClick={openCookiePreferencesModal}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-semibold text-xs px-5 py-2.5 rounded-full shrink-0 gap-2 shadow-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Manage Cookie Preferences</span>
          </Button>
        </div>

        {/* Detailed Sections */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. What Are Cookies & Local Storage?</h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you visit a website. In addition to HTTP cookies, modern web applications utilize web storage (such as HTML5 <code>localStorage</code>) to store essential client-side state efficiently.
            </p>
            <p>
              LodgeHere uses these technologies strictly to enable secure authentication sessions, remember your theme preference, and provide a fast, reliable accommodation search experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Inventory of Cookies & Storage Keys Used</h2>
            <p>
              We believe in complete transparency. Below is a detailed record of every storage key and cookie employed on LodgeHere:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Identifier / Key</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Lifespan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">sb-*-auth-token</td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        Essential
                      </span>
                    </td>
                    <td className="p-3">Maintains your authenticated student or landlord session securely.</td>
                    <td className="p-3">Session / 1 Year</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">lodgehere_theme</td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        Essential
                      </span>
                    </td>
                    <td className="p-3">Stores your light or dark mode theme selection to prevent page flicker.</td>
                    <td className="p-3">Persistent (Local)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">lodgehere_cookie_consent</td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        Essential
                      </span>
                    </td>
                    <td className="p-3">Records your cookie consent choices so you aren&apos;t prompted on every visit.</td>
                    <td className="p-3">1 Year</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">lodgehere_dev_role</td>
                    <td className="p-3">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Functional
                      </span>
                    </td>
                    <td className="p-3">Remembers your active testing persona (Student or Landlord preview).</td>
                    <td className="p-3">Persistent (Local)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">_ga / _analytics</td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        Optional Analytics
                      </span>
                    </td>
                    <td className="p-3">Aggregated anonymous usage metrics. Blocked until you explicitly opt in.</td>
                    <td className="p-3">Opt-in only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Services</h2>
            <p>
              We do not permit third-party advertising networks to place tracking cookies on your device through LodgeHere.
              Content Delivery Networks (e.g. Unsplash for property photography CDN delivery) may transmit anonymous HTTP headers required strictly to serve image files efficiently.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. How to Manage or Disable Cookies in Your Browser</h2>
            <p>
              In addition to our on-site{' '}
              <button
                type="button"
                onClick={openCookiePreferencesModal}
                className="text-blue-600 font-semibold underline dark:text-blue-400 cursor-pointer"
              >
                Preferences Center
              </button>,
              you can configure your web browser to reject cookies or notify you when a cookie is placed:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection</li>
              <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
              <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions</li>
            </ul>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              Note: Disabling strictly necessary cookies may prevent authentication sessions and dashboard access from operating normally.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Further Inquiries</h2>
            <p>
              For further details regarding how we protect your personal data, read our{' '}
              <Link href="/privacy" className="text-blue-600 font-semibold underline dark:text-blue-400">
                Privacy Policy
              </Link>{' '}
              or reach our privacy team at <a href="mailto:privacy@lodgehere.ng" className="text-blue-600 underline dark:text-blue-400 font-semibold">privacy@lodgehere.ng</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
