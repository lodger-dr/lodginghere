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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Provider Verification</h1>
          <Badge variant="warning">Action Required</Badge>
        </div>
        <p className="text-xs text-slate-500">
          Upload proof of identity and property authority for platform administrator review.
        </p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 flex items-start gap-3 text-xs text-blue-900">
        <Lock className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Strict Document Privacy Policy</span>
          <p className="leading-relaxed text-blue-800">
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
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3 text-emerald-800">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
              <h3 className="font-bold text-base">Documents Submitted for Admin Review</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Your verification documents have been safely received. Platform administrators review submissions
                within 24-48 hours. You will receive an in-app notification once reviewed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Identity Document */}
              <div className="space-y-2 border-b border-slate-200 pb-5">
                <label className="block text-sm font-semibold text-slate-900">
                  1. Government Identification Document
                </label>
                <p className="text-xs text-slate-500">
                  Accepted: National Identification Number (NIN) Slip, Driver&apos;s License, International Passport, or Voter&apos;s Card.
                </p>
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50/50">
                  <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-emerald-700">Choose file or drag & drop</span>
                  <p className="text-[10px] text-slate-400">PDF, JPG, or PNG up to 10MB</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>

              {/* 2. Authority / Ownership Evidence */}
              <div className="space-y-2 border-b border-slate-200 pb-5">
                <label className="block text-sm font-semibold text-slate-900">
                  2. Proof of Property Ownership or Legal Authority
                </label>
                <p className="text-xs text-slate-500">
                  Accepted for Owners: Certificate of Occupancy, Deed of Conveyance, or Property Purchase Receipt.
                  <br />
                  Accepted for Representatives: Signed and dated Letter of Authority or Management Agreement from the owner.
                </p>
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50/50">
                  <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-emerald-700">Choose file or drag & drop</span>
                  <p className="text-[10px] text-slate-400">PDF, JPG, or PNG up to 15MB</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
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
