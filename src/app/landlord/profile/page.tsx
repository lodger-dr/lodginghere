'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Building2, Phone, Save, CheckCircle2, ShieldCheck, BellOff, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandlordProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Landlord Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your business information and communication contact details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider Details</CardTitle>
          <CardDescription className="text-xs">
            These contact details are provided to students whose inspection requests you accept.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {saved && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Profile updated successfully.</span>
              </div>
            )}

            <Input
              label="Full Legal Name"
              name="fullName"
              defaultValue="Chief Adebayo Olanrewaju"
              required
            />

            <Input
              label="Business or Brand Name"
              name="businessName"
              defaultValue="Adebayo Properties & Lodges"
              placeholder="e.g. Skyline Student Residences"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              defaultValue="landlord.adebayo@example.com"
              disabled
              helperText="Managed by authentication"
            />

            <Input
              label="Contact Phone / WhatsApp"
              name="phone"
              type="tel"
              defaultValue="+234 803 234 5678"
              placeholder="+234 803 234 5678"
              helperText="Used for coordinating arrival of inspecting students"
            />

            <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Privacy, Communications & Data Deletion */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span>Privacy, Communications &amp; Data Rights</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Manage provider communications, verification privacy, or request permanent data deletion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-850">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BellOff className="h-3.5 w-3.5 text-slate-500" />
                <span>Email Notifications &amp; Unsubscribe</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Opt out of non-essential marketing emails, provider tips, or newsletters.
              </p>
            </div>
            <Link href="/unsubscribe?email=landlord.adebayo@example.com">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 shrink-0">
                <span>Manage Notifications</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-rose-50/40 dark:bg-rose-950/20">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                <span>Request Account &amp; Data Deletion</span>
              </h4>
              <p className="text-[11px] text-rose-800/80 dark:text-rose-300">
                Submit an erasure request to purge provider records, uploaded ID documents, and property listings.
              </p>
            </div>
            <Link href="/data-deletion">
              <Button variant="danger" size="sm" className="text-xs gap-1.5 shrink-0">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Request Erasure</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
