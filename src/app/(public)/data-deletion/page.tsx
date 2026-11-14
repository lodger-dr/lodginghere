'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  submitDataDeletionRequest,
  hasPendingDeletionRequest,
  DataDeletionRequest,
} from '@/lib/data/privacy';

export default function DataDeletionRequestPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'landlord' | 'other'>('student');
  const [reason, setReason] = useState('Graduation / No longer need accommodation');
  const [details, setDetails] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<DataDeletionRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid account email address.');
      return;
    }

    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      setError('Please type "DELETE" in the confirmation box to confirm this permanent action.');
      return;
    }

    if (hasPendingDeletionRequest(email)) {
      setError('A data deletion request for this email address is already pending administrative review.');
      return;
    }

    try {
      const request = submitDataDeletionRequest({
        email,
        role,
        reason,
        details,
      });
      setSubmittedRequest(request);
      setError(null);
    } catch {
      setError('An error occurred submitting your request. Please try again or email privacy@lodgehere.ng.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-900">
            <Trash2 className="h-3.5 w-3.5 text-rose-700 dark:text-rose-400" aria-hidden="true" />
            <span>Right to Erasure (NDPA &amp; GDPR)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Data Deletion Request Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            You maintain absolute control over your personal information. Submit a formal request to erase your
            account profile, inspection history, and stored records.
          </p>
        </div>

        {/* Warning Callout */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
            <span>What happens when your data is erased:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-amber-900 dark:text-amber-300">
            <li>Your user authentication login and linked profile are permanently deactivated.</li>
            <li>All contact phone numbers, university records, and inspection logs are purged.</li>
            <li>For landlords, uploaded government identity documents and ownership deeds are permanently deleted from secure storage.</li>
            <li>Past financial dispute logs required by statutory tax or banking audit regulations may be retained in anonymized format for the minimum legal retention window.</li>
          </ul>
        </div>

        {/* Form or Confirmation Card */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 dark:text-white">
              {submittedRequest ? 'Erasure Request Logged' : 'Submit Deletion Request'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              {submittedRequest
                ? 'Your request has been registered in our immutable data governance log.'
                : 'Complete the form below using the email address associated with your LodgeHere account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submittedRequest ? (
              <div className="space-y-5 text-center py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Request Received Successfully
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    We have received the erasure request for <strong className="text-slate-900 dark:text-white">{submittedRequest.email}</strong>.
                    Our compliance operations team will process and complete the purge within <strong>72 hours</strong>.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-left space-y-1.5 max-w-md mx-auto dark:border-slate-800 dark:bg-slate-850">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Reference Ticket ID:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{submittedRequest.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Status:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <span>Pending Execution</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Requested Timestamp:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(submittedRequest.requested_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <Link href="/">
                    <Button variant="outline" size="sm">
                      Return to Home
                    </Button>
                  </Link>
                  <Link href="/privacy">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Read Privacy Policy
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <Input
                  label="Registered Account Email Address *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />

                <Select
                  label="Your Account Type *"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  required
                >
                  <option value="student">Student Account</option>
                  <option value="landlord">Property Owner / Landlord Account</option>
                  <option value="other">General Website Visitor</option>
                </Select>

                <Select
                  label="Primary Reason for Erasure *"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="Graduation / No longer need accommodation">Graduation / No longer need accommodation</option>
                  <option value="Moved off-campus / Secured permanent residence">Moved off-campus / Secured permanent residence</option>
                  <option value="Property sold / No longer listing on platform">Property sold / No longer listing on platform</option>
                  <option value="General privacy / Prefer not to maintain account">General privacy / Prefer not to maintain account</option>
                  <option value="Other reason">Other reason</option>
                </Select>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Additional Instructions or Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Specify any specific records or questions you have regarding your data..."
                    className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Explicit Safety Confirmation Input */}
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2 dark:border-rose-900/60 dark:bg-rose-950/20">
                  <label className="block text-xs font-bold text-rose-950 dark:text-rose-200">
                    Type &quot;DELETE&quot; to Confirm Permanent Deletion *
                  </label>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="bg-white dark:bg-slate-900"
                    required
                  />
                  <p className="text-[11px] text-rose-800 dark:text-rose-300">
                    This safeguard prevents accidental requests. Once processed, account recovery is not possible.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="danger"
                    className="w-full gap-2 shadow-sm font-semibold"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span>Confirm &amp; Submit Data Deletion Request</span>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
