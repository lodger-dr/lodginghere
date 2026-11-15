'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Phone,
  Mail,
  Save,
  CheckCircle2,
  Trash2,
  BellOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { useAuth } from '@/context/auth-context';
import { updateStudentProfileAction } from '@/app/(auth)/actions';

export default function StudentProfilePage() {
  const { user, profile, refreshProfile, updateProfileState } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedUniSlug, setSelectedUniSlug] = useState('university-of-lagos');
  const [department, setDepartment] = useState('');

  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Sync state from authenticated user and profile
  useEffect(() => {
    if (user || profile) {
      const meta = user?.user_metadata || {};
      const resolvedName = profile?.full_name || meta.full_name || meta.name || '';
      const resolvedPhone = profile?.phone || meta.phone || '';
      const resolvedUni =
        profile?.student_profile?.university_slug ||
        meta.university_slug ||
        (typeof window !== 'undefined' ? localStorage.getItem('lodgehere_user_university') : null) ||
        'university-of-lagos';
      const resolvedDept = profile?.student_profile?.department || meta.department || '';

      if (resolvedName && !fullName) setFullName(resolvedName);
      if (resolvedPhone && !phone) setPhone(resolvedPhone);
      if (resolvedUni) setSelectedUniSlug(resolvedUni);
      if (resolvedDept && !department) setDepartment(resolvedDept);
    }
  }, [user, profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('universitySlug', selectedUniSlug);
    formData.append('department', department);

    startTransition(async () => {
      try {
        const response = await updateStudentProfileAction(formData);

        if (!response.success) {
          if (response.errors) setFieldErrors(response.errors);
          if (response.message) setErrorMessage(response.message);
          return;
        }

        if (typeof window !== 'undefined' && selectedUniSlug) {
          try {
            localStorage.setItem('lodgehere_user_university', selectedUniSlug);
          } catch {}
        }

        updateProfileState({
          full_name: fullName,
          phone: phone,
          student_profile: {
            university_slug: selectedUniSlug,
            department: department,
          },
        });

        await refreshProfile();
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } catch {
        setErrorMessage('Failed to save profile. Please check your network and try again.');
      }
    });
  };

  const displayEmail = user?.email || profile?.email || '';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Student Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal details and university association.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription className="text-xs">
            Your name and phone number are shared with landlords only when you schedule an inspection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {saved && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Profile details saved successfully.</span>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Full name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              error={fieldErrors.fullName?.[0]}
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              value={displayEmail}
              disabled
              helperText="Managed by authentication"
            />

            <Input
              label="WhatsApp Phone Number"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08123456789"
              helperText="For landlords to coordinate inspection arrival"
              error={fieldErrors.phone?.[0]}
            />

            <Select
              label="Primary University"
              value={selectedUniSlug}
              onChange={(e) => setSelectedUniSlug(e.target.value)}
            >
              {NIGERIAN_UNIVERSITIES.slice(0, 30).map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name} ({u.acronym})
                </option>
              ))}
            </Select>

            <Input
              label="Department / Faculty"
              name="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science, Faculty of Science"
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
            Control your notifications, exercise data rights under NDPA/GDPR, or request account erasure.
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
                Manage granular subscriptions or unsubscribe from all promotional campus digests.
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
                Permanently purge your account, contact information, and inspection appointment history.
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
