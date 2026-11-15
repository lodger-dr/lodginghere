'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  User,
  Building2,
  Phone,
  Save,
  CheckCircle2,
  ShieldCheck,
  BellOff,
  Trash2,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { updateLandlordProfileAction } from '@/app/(auth)/actions';

export default function LandlordProfilePage() {
  const { user, profile, refreshProfile, updateProfileState } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');

  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Sync state from authenticated user and profile
  useEffect(() => {
    if (user || profile) {
      const meta = user?.user_metadata || {};
      const resolvedName = profile?.full_name || meta.full_name || meta.name || '';
      const resolvedPhone = profile?.phone || meta.phone || '';
      const resolvedBiz = profile?.landlord_profile?.business_name || meta.business_name || '';

      if (resolvedName && !fullName) setFullName(resolvedName);
      if (resolvedPhone && !phone) setPhone(resolvedPhone);
      if (resolvedBiz && !businessName) setBusinessName(resolvedBiz);
    }
  }, [user, profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('businessName', businessName);
    formData.append('phone', phone);

    startTransition(async () => {
      try {
        const response = await updateLandlordProfileAction(formData);

        if (!response.success) {
          if (response.errors) setFieldErrors(response.errors);
          if (response.message) setErrorMessage(response.message);
          return;
        }

        updateProfileState({
          full_name: fullName,
          phone: phone,
          landlord_profile: {
            business_name: businessName,
          },
        });

        await refreshProfile();
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } catch {
        setErrorMessage('Failed to update provider profile. Please check your network and try again.');
      }
    });
  };

  const displayEmail = user?.email || profile?.email || '';

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
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Profile updated successfully.</span>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Full Legal Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Chief Adebayo Olanrewaju"
              required
              error={fieldErrors.fullName?.[0]}
            />

            <Input
              label="Business or Brand Name"
              name="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Skyline Student Residences"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={displayEmail}
              disabled
              helperText="Managed by authentication"
            />

            <Input
              label="Contact Phone / WhatsApp"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08032345678"
              helperText="Used for coordinating arrival of inspecting students"
              error={fieldErrors.phone?.[0]}
            />

            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Privacy, Communications & Data Deletion */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
            <Link href={`/unsubscribe?email=${encodeURIComponent(displayEmail)}`}>
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
