'use client';

import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LandlordVerificationPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Provider Verification</h1>
          <Badge variant="warning">Action Required</Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload proof of identity and property authority for platform administrator review.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 flex items-start gap-3 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
        <Lock className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Strict Document Privacy Policy</span>
          <p className="leading-relaxed text-blue-800 dark:text-blue-300/90">
            All submitted identification and authority documents are stored in encrypted private storage (`verification-private`).
            They are never exposed to students or public visitors. Only platform moderation administrators have review access.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity & Ownership Evidence</CardTitle>
          <CardDescription className="text-xs">
            Documents required to earn the Identity Verified and Authority Verified trust badges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-base">Documents Submitted for Admin Review</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                Your verification documents have been safely received. Platform administrators review submissions
                within 24-48 hours. You will receive an in-app notification once reviewed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Identity Document */}
              <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  1. Government Identification Document
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Accepted: National Identification Number (NIN) Slip, Driver&apos;s License, International Passport, or Voter&apos;s Card.
                </p>
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                  <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Choose file or drag & drop</span>
                  <p className="text-[10px] text-slate-400">PDF, JPG, or PNG up to 10MB</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>

              {/* 2. Authority / Ownership Evidence */}
              <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  2. Proof of Property Ownership or Legal Authority
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Accepted for Owners: Certificate of Occupancy, Deed of Conveyance, or Property Purchase Receipt.
                  <br />
                  Accepted for Representatives: Signed and dated Letter of Authority or Management Agreement from the owner.
                </p>
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                  <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Choose file or drag & drop</span>
                  <p className="text-[10px] text-slate-400">PDF, JPG, or PNG up to 15MB</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>

              {/* Explicit Verification Consent */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="verification-consent"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                />
                <label htmlFor="verification-consent" className="text-xs text-slate-700 dark:text-slate-300 leading-snug cursor-pointer">
                  I consent to the collection and verification of my submitted identity and property documentation strictly for administrator verification in accordance with the{' '}
                  <a href="/privacy" target="_blank" className="text-emerald-700 underline dark:text-emerald-400 font-semibold">
                    Privacy Policy
                  </a>
                  . I confirm that I am legally authorized to list this accommodation.
                </label>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Submit Documents for Review
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
