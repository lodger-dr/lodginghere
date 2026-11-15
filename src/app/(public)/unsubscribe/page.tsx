'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Mail,
  CheckCircle2,
  BellOff,
  Bell,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getEmailPreferences,
  setEmailPreferences,
  unsubscribeEmailFromAll,
  EmailPreferences,
} from '@/lib/data/privacy';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const queryEmail = searchParams?.get('email') || '';

  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (queryEmail) {
      setEmail(queryEmail);
      const current = getEmailPreferences(queryEmail);
      setPreferences(current);
    }
  }, [queryEmail]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    const current = getEmailPreferences(email);
    setPreferences(current);
    setMessage(null);
  };

  const handleOneClickUnsubscribeAll = () => {
    if (!email.trim()) return;
    const updated = unsubscribeEmailFromAll(email);
    setPreferences(updated);
    setMessage({
      type: 'success',
      text: `You have successfully unsubscribed ${email} from all non-essential marketing emails and digests.`,
    });
  };

  const handleSaveCustomPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences || !email.trim()) return;
    const updated = setEmailPreferences(email, {
      inspectionAlerts: preferences.inspectionAlerts,
      lodgesUpdates: preferences.lodgesUpdates,
      platformNews: preferences.platformNews,
      unsubscribedAll: !preferences.lodgesUpdates && !preferences.platformNews,
    });
    setPreferences(updated);
    setMessage({
      type: 'success',
      text: 'Your email notification preferences have been saved.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <Mail className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
            <span>Email Preferences Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Manage Email Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Control which emails you receive from LodgeHere, or opt out of all promotional digests with one click.
          </p>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`rounded-2xl p-4 text-xs flex items-start gap-3 border ${message.type === 'success'
                ? 'bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
              }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-medium leading-relaxed">{message.text}</p>
          </div>
        )}

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 dark:text-white">
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Enter your email to customize what notifications you receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!preferences ? (
              <form onSubmit={handleLookup} className="space-y-4">
                <Input
                  label="Your Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                />
                <Button type="submit" className="w-full">
                  Lookup Preferences
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Instant Unsubscribe Button */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      One-Click Unsubscribe All
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Instantly turn off all campus digest emails, recommendations, and newsletters for {email}.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOneClickUnsubscribeAll}
                    className="shrink-0 text-xs border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40 gap-1.5"
                  >
                    <BellOff className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Unsubscribe from All</span>
                  </Button>
                </div>

                {/* Granular Toggles */}
                <form onSubmit={handleSaveCustomPreferences} className="space-y-4 pt-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Granular Subscriptions:
                  </h3>

                  <div className="space-y-3">
                    {/* Item 1: Inspection alerts (Transactional) */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="pr-4">
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          Physical Inspection Appointment Alerts
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Critical transactional updates when a landlord accepts, declines, or reschedules an inspection.
                        </span>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                        Transactional
                      </span>
                    </div>

                    {/* Item 2: Lodges Updates (Marketing) */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="pr-4">
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          New Lodge Listings Near Your Campus
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Periodic notifications when new verified accommodations become available near your university.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={preferences.lodgesUpdates}
                          onChange={(e) =>
                            setPreferences({ ...preferences, lodgesUpdates: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Item 3: Platform news */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="pr-4">
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          Student Accommodation Guides &amp; Tips
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Occasional guidance on off-campus budgeting, tenant rights, and campus life.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={preferences.platformNews}
                          onChange={(e) =>
                            setPreferences({ ...preferences, platformNews: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreferences(null)}
                    >
                      Change Email
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="font-semibold"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading preferences...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
