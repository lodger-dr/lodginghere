'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Report a Problem or Listing</h1>
        <p className="text-sm text-slate-500">
          Help us maintain a trustworthy student marketplace. All reports are reviewed by platform administrators.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>
            Submit details regarding suspicious conduct, inaccurate rent, unavailable rooms, or unauthorized agents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3 text-emerald-800">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
              <h3 className="font-bold text-base">Report Submitted</h3>
              <p className="text-xs text-emerald-700">
                Thank you for your vigilance. Our moderation team will investigate this report and take appropriate action.
              </p>
              <div className="pt-2">
                <Link href="/explore">
                  <Button size="sm" variant="outline">
                    Return to Explore
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select label="Reason for report" required>
                <option value="">Select a reason...</option>
                <option value="inaccurate_rent">Stated rent or charges are inaccurate / inflated</option>
                <option value="fake_availability">Room was claimed available but is occupied</option>
                <option value="unauthorized_agent">Person advertising is not the authorized landlord/manager</option>
                <option value="misleading_photos">Photos do not match the physical lodge inspected</option>
                <option value="suspicious_activity">Demanding payment before physical inspection</option>
                <option value="other">Other issue</option>
              </Select>

              <Input
                label="Lodge Name or Listing URL (if applicable)"
                placeholder="e.g. Apex Hall, Akoka"
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Explanation & Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe what happened, dates, and any relevant communication..."
                  className="w-full rounded-md border border-slate-300 p-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <Input
                label="Your Email (Optional, for follow-up)"
                type="email"
                placeholder="you@example.com"
                helperText="We will never disclose your identity to the reported provider"
              />

              <Button type="submit" variant="danger" className="w-full">
                Submit Report to Admin
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

