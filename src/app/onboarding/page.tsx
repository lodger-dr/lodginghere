'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  GraduationCap,
  Building2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  School,
  MapPin,
  BookOpen,
  Briefcase,
  AlertCircle,
  Home,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { completeOnboardingAction } from '../(auth)/actions';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, isLoading: isAuthLoading, refreshProfile, updateProfileState } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [role, setRole] = useState<'student' | 'landlord'>('student');

  // Step 2: Personal details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isPreFilledFromGoogle, setIsPreFilledFromGoogle] = useState(false);

  // Step 3 (Student)
  const [universitySlug, setUniversitySlug] = useState('university-of-lagos');
  const [campusName, setCampusName] = useState('Main Campus');
  const [department, setDepartment] = useState('');
  const [preferredRoomType, setPreferredRoomType] = useState('self_contained');

  // Step 3 (Landlord)
  const [providerType, setProviderType] = useState<'owner' | 'authorized_representative'>('owner');
  const [businessName, setBusinessName] = useState('');
  const [operatingArea, setOperatingArea] = useState('');
  const [portfolioSize, setPortfolioSize] = useState('6_to_15');

  // Step 4: Agreement
  const [confirmedAccuracy, setConfirmedAccuracy] = useState(true);

  // Form handling state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  // Populate user data from Google / Auth session
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      const name =
        meta.full_name ||
        meta.name ||
        profile?.full_name ||
        (user.email ? user.email.split('@')[0] : '');

      if (name && !fullName) {
        setFullName(name);
        if (meta.full_name || meta.name) {
          setIsPreFilledFromGoogle(true);
        }
      }

      if (profile?.phone && !phone) {
        setPhone(profile.phone);
      }

      if (profile?.role) {
        setRole(profile.role === 'landlord' ? 'landlord' : 'student');
      }
    }
  }, [user, profile, fullName, phone]);

  // Validation handlers for stepping forward
  const handleNextFromStep1 = () => {
    setErrorMessage(null);
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    setErrorMessage(null);
    setFieldErrors({});

    if (!fullName || fullName.trim().length < 2) {
      setFieldErrors({ fullName: ['Please enter your full name (at least 2 characters)'] });
      return;
    }

    if (phone && !/^(\+234|0)[789][01]\d{8}$/.test(phone.replace(/\s+/g, ''))) {
      setFieldErrors({ phone: ['Please enter a valid Nigerian phone number (e.g. 08012345678)'] });
      return;
    }

    setStep(3);
  };

  const handleNextFromStep3 = () => {
    setErrorMessage(null);
    setFieldErrors({});

    if (role === 'student') {
      if (!universitySlug) {
        setFieldErrors({ universitySlug: ['Please select your university'] });
        return;
      }
    } else {
      if (providerType === 'authorized_representative' && !businessName.trim()) {
        setFieldErrors({ businessName: ['Please provide your agency or business name'] });
        return;
      }
    }

    setStep(4);
  };

  const handleCompleteOnboarding = async () => {
    setErrorMessage(null);

    if (!confirmedAccuracy) {
      setErrorMessage('Please confirm that your provided information is accurate to finish.');
      return;
    }

    const formData = new FormData();
    formData.append('role', role);
    formData.append('fullName', fullName.trim());
    if (phone) formData.append('phone', phone.trim());

    if (role === 'student') {
      formData.append('universityId', universitySlug);
      if (campusName) formData.append('campusName', campusName.trim());
      if (department) formData.append('department', department.trim());
      if (preferredRoomType) formData.append('preferredRoomType', preferredRoomType);
    } else {
      formData.append('providerType', providerType);
      if (businessName) formData.append('businessName', businessName.trim());
      if (operatingArea) formData.append('operatingArea', operatingArea.trim());
      formData.append('portfolioSize', portfolioSize);
    }

    startTransition(async () => {
      try {
        const response = await completeOnboardingAction(formData);

        if (!response.success) {
          if (response.errors) {
            setFieldErrors(response.errors);
          }
          if (response.message) {
            setErrorMessage(response.message);
          }
          return;
        }

        if (role === 'student') {
          if (universitySlug && typeof window !== 'undefined') {
            try {
              localStorage.setItem('lodgehere_user_university', universitySlug);
            } catch {}
          }
          updateProfileState({
            full_name: fullName.trim(),
            phone: phone.trim(),
            role: 'student',
            onboarding_completed: true,
            student_profile: {
              university_slug: universitySlug,
              department: department.trim(),
            },
          });
        } else {
          updateProfileState({
            full_name: fullName.trim(),
            phone: phone.trim(),
            role: 'landlord',
            onboarding_completed: true,
            landlord_profile: {
              business_name: businessName.trim(),
              provider_type: providerType,
              operating_area: operatingArea.trim(),
            },
          });
        }

        await refreshProfile();

        if (response.redirectTo) {
          router.push(response.redirectTo);
          router.refresh();
        }
      } catch {
        setErrorMessage('An unexpected error occurred while saving your profile. Please try again.');
      }
    });
  };

  const selectedUni = NIGERIAN_UNIVERSITIES.find((u) => u.slug === universitySlug);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-xl space-y-6">
        {/* PROGRESS STEPPER HEADER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Role Selection'}
              {step === 2 && 'Personal Details'}
              {step === 3 && (role === 'student' ? 'Academic Details' : 'Property Details')}
              {step === 4 && 'Confirmation'}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-950/50 p-4 text-xs text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-900/60 shadow-2xs"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* CARD 1: ROLE SELECTION */}
        {/* ============================================================== */}
        {step === 1 && (
          <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl overflow-hidden animate-in fade-in duration-300">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 mb-3 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Welcome to LodgeHere</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                How will you use LodgeHere?
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Select your role to personalize your account and dashboard experience.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-6 sm:px-8 pb-8 pt-4">
              {/* Student Role Choice */}
              <div
                onClick={() => setRole('student')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setRole('student');
                  }
                }}
                className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    role === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      I am a Student
                    </h4>
                    {role === 'student' && (
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Looking for verified off-campus student accommodation near your Nigerian university.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="inline-flex items-center text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                      Verified Lodges
                    </span>
                    <span className="inline-flex items-center text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                      Free Inspections
                    </span>
                    <span className="inline-flex items-center text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                      Zero Agent Fees
                    </span>
                  </div>
                </div>
              </div>

              {/* Landlord Role Choice */}
              <div
                onClick={() => setRole('landlord')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setRole('landlord');
                  }
                }}
                className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  role === 'landlord'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    role === 'landlord'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      I am an Accommodation Provider
                    </h4>
                    {role === 'landlord' && (
                      <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    List properties, manage room vacancies, and connect directly with verified university students.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="inline-flex items-center text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                      Direct Student Reach
                    </span>
                    <span className="inline-flex items-center text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                      Inspection Alerts
                    </span>
                    <span className="inline-flex items-center text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                      Verified Badge
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleNextFromStep1}
                  className="w-full h-11 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <span>Continue to Personal Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ============================================================== */}
        {/* CARD 2: PERSONAL INFORMATION */}
        {/* ============================================================== */}
        {step === 2 && (
          <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl overflow-hidden animate-in fade-in duration-300">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 mb-3 shadow-2xs">
                <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Personal Information</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Tell us about yourself
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Your details help verified landlords and students communicate securely.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-6 sm:px-8 pb-8 pt-4">
              {/* Google Autofill Badge */}
              {isPreFilledFromGoogle && (
                <div className="flex items-center gap-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 p-3 text-xs text-amber-800 dark:text-amber-300 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    Your name and email have been automatically populated from your Google account.
                  </span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. Chukwuemeka Adebayo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                    {fieldErrors.fullName[0]}
                  </p>
                )}
              </div>

              {/* Email Address (Pre-filled and Verified) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={user?.email || profile?.email || ''}
                    className="pl-10 h-11 rounded-2xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-90"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Primary email used for your security and booking receipts.
                </p>
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 flex items-center gap-1 text-xs font-bold text-slate-500">
                    <span>🇳🇬</span>
                    <span>+234</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-20 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                    {fieldErrors.phone[0]}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Used to coordinate physical inspections and WhatsApp inquiries.
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-11 rounded-2xl border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="flex-1 h-11 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <span>
                    Continue to {role === 'student' ? 'Academic Details' : 'Property Details'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ============================================================== */}
        {/* CARD 3: ROLE-SPECIFIC DETAILS */}
        {/* ============================================================== */}
        {step === 3 && (
          <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl overflow-hidden animate-in fade-in duration-300">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 mb-3 shadow-2xs">
                {role === 'student' ? (
                  <School className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                )}
                <span>{role === 'student' ? 'Academic Profile' : 'Property Operations'}</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {role === 'student' ? 'Your University & Course' : 'Your Property Operations'}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                {role === 'student'
                  ? 'We will match you with lodges close to your faculty and campus.'
                  : 'Specify the scope of your accommodations and locations.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-6 sm:px-8 pb-8 pt-4">
              {/* STUDENT FIELDS */}
              {role === 'student' && (
                <>
                  {/* University Selection */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="universitySlug"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Nigerian University
                    </label>
                    <select
                      id="universitySlug"
                      value={universitySlug}
                      onChange={(e) => setUniversitySlug(e.target.value)}
                      className="flex h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {NIGERIAN_UNIVERSITIES.map((uni) => (
                        <option key={uni.slug} value={uni.slug}>
                          {uni.name} ({uni.acronym}) — {uni.state} State
                        </option>
                      ))}
                    </select>
                    {fieldErrors.universitySlug && (
                      <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.universitySlug[0]}
                      </p>
                    )}
                  </div>

                  {/* Campus & Department Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="campusName"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Campus Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          id="campusName"
                          placeholder="e.g. Main Campus / Akoka"
                          value={campusName}
                          onChange={(e) => setCampusName(e.target.value)}
                          className="pl-10 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="department"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Department / Course
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          id="department"
                          placeholder="e.g. Computer Science"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="pl-10 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accommodation Preference */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Preferred Accommodation Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'self_contained', label: 'Self-Contained Room' },
                        { id: 'single_room', label: 'Single Room' },
                        { id: 'two_bedroom', label: 'Flat / Apartment' },
                        { id: 'hostel', label: 'Hostel Bed Space' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPreferredRoomType(item.id)}
                          className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                            preferredRoomType === item.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-2xs'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <Home className="h-3.5 w-3.5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* LANDLORD FIELDS */}
              {role === 'landlord' && (
                <>
                  {/* Provider Type Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Authority / Relationship
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setProviderType('owner')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          providerType === 'owner'
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          Property Owner
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          I personally own the student lodge or hostel building.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProviderType('authorized_representative')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          providerType === 'authorized_representative'
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          Property Manager / Agent
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          I manage lodges or hostels on behalf of property owners.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Business Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="businessName"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {providerType === 'owner' ? 'Lodge / Brand Name' : 'Agency / Company Name'}
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="businessName"
                        placeholder="e.g. Apex Student Hostels Ltd"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="pl-10 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    {fieldErrors.businessName && (
                      <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.businessName[0]}
                      </p>
                    )}
                  </div>

                  {/* Operating Location / University Area */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="operatingArea"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Primary Campus or City Served
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="operatingArea"
                        placeholder="e.g. Akoka / Yaba (UNILAG area), Lagos"
                        value={operatingArea}
                        onChange={(e) => setOperatingArea(e.target.value)}
                        className="pl-10 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Portfolio Size */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="portfolioSize"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Estimated Total Rooms Under Management
                    </label>
                    <select
                      id="portfolioSize"
                      value={portfolioSize}
                      onChange={(e) => setPortfolioSize(e.target.value)}
                      className="flex h-11 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                    >
                      <option value="1_to_5">1 - 5 rooms</option>
                      <option value="6_to_15">6 - 15 rooms</option>
                      <option value="16_to_30">16 - 30 rooms</option>
                      <option value="30_plus">30+ rooms</option>
                    </select>
                  </div>
                </>
              )}

              {/* BUTTONS */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="h-11 rounded-2xl border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleNextFromStep3}
                  className="flex-1 h-11 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <span>Review & Complete</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ============================================================== */}
        {/* CARD 4: REVIEW & CONFIRMATION */}
        {/* ============================================================== */}
        {step === 4 && (
          <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl overflow-hidden animate-in fade-in duration-300">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300 mb-3 shadow-2xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Ready to Launch</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Review your profile
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Confirm your account details to access your verified dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-6 sm:px-8 pb-8 pt-4">
              {/* Profile Summary Card */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-700/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {fullName}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {user?.email || profile?.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                      role === 'student'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {role === 'student' ? 'Student' : 'Accommodation Provider'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {phone ? `+234 ${phone.replace(/^(\+234|0)/, '')}` : 'Not provided'}
                    </span>
                  </div>

                  {role === 'student' ? (
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                        University
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 truncate block">
                        {selectedUni?.name || 'Selected University'}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                        Authority
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {providerType === 'owner' ? 'Property Owner' : 'Managing Agent'}
                      </span>
                    </div>
                  )}

                  {role === 'student' ? (
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                        Campus / Department
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {campusName} {department ? `• ${department}` : ''}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                        Lodge / Business
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {businessName || 'Independent Owner'}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                      Account Status
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Ready for Activation</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Accuracy Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="confirm-accuracy"
                  type="checkbox"
                  checked={confirmedAccuracy}
                  onChange={(e) => setConfirmedAccuracy(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
                />
                <label
                  htmlFor="confirm-accuracy"
                  className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug cursor-pointer"
                >
                  I confirm that all information provided is accurate and agree to LodgeHere's safety
                  and anti-fraud guidelines.
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(3)}
                  disabled={isPending}
                  className="h-11 rounded-2xl border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>Back</span>
                </Button>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={handleCompleteOnboarding}
                  className="flex-1 h-11 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all text-xs flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <span>Completing onboarding...</span>
                  ) : (
                    <>
                      <span>Finish Setup & Enter Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
