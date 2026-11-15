'use client';

import React, { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { signUpAction } from '../actions';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '';
  const initialRole = searchParams.get('role') === 'landlord' ? 'landlord' : 'student';

  const [activeRole, setActiveRole] = useState<'student' | 'landlord'>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student-specific fields
  const [universitySlug, setUniversitySlug] = useState('');
  const [department, setDepartment] = useState('');

  // Landlord-specific fields
  const [providerType, setProviderType] = useState<'owner' | 'authorized_representative'>('owner');
  const [businessName, setBusinessName] = useState('');

  // Terms agreement
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: ['Passwords do not match'] });
      return;
    }

    const formData = new FormData();
    formData.append('role', activeRole);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    if (phone) formData.append('phone', phone);

    if (activeRole === 'student') {
      if (universitySlug) formData.append('universityId', universitySlug);
      if (department) formData.append('department', department);
    } else {
      formData.append('providerType', providerType);
      if (businessName) formData.append('businessName', businessName);
    }

    startTransition(async () => {
      try {
        const response = await signUpAction(formData);

        if (!response.success) {
          if (response.errors) {
            setFieldErrors(response.errors);
          }
          if (response.message) {
            setErrorMessage(response.message);
          }
          return;
        }

        if (response.redirectTo) {
          router.push(response.redirectTo);
          router.refresh();
        }
      } catch {
        setErrorMessage('An unexpected error occurred during registration. Please try again.');
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-lg space-y-6">
        <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Student Accommodation</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Join thousands of Nigerian students and verified accommodation providers.
            </CardDescription>

            {/* Role Persona Toggle Switch */}
            <div className="pt-4">
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('student');
                    setFieldErrors({});
                    setErrorMessage(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    activeRole === 'student'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>I am a Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRole('landlord');
                    setFieldErrors({});
                    setErrorMessage(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    activeRole === 'landlord'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>I am a Landlord / Agent</span>
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 pt-3">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google OAuth Button with Active Role */}
            <div>
              <GoogleAuthButton
                role={activeRole}
                text={`Continue with Google as ${activeRole === 'student' ? 'Student' : 'Landlord'}`}
                next={nextUrl}
                onError={(msg) => setErrorMessage(msg)}
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={activeRole === 'student' ? 'e.g. Chinedu Eze' : 'e.g. Alhaji Musa or Emeka Realty'}
                  required
                  autoComplete="name"
                  error={fieldErrors.fullName?.[0]}
                />
              </div>

              <div>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  error={fieldErrors.email?.[0]}
                />
              </div>

              <div>
                <Input
                  label="Phone Number (WhatsApp preferred)"
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08012345678 or +234..."
                  autoComplete="tel"
                  error={fieldErrors.phone?.[0]}
                  helperText="Used for inspection confirmations and physical tour coordination."
                />
              </div>

              {/* Student Specific Fields */}
              {activeRole === 'student' && (
                <>
                  <div className="space-y-1">
                    <label
                      htmlFor="university-select"
                      className="block text-sm font-medium text-slate-800 dark:text-slate-200"
                    >
                      University / Institution
                    </label>
                    <select
                      id="university-select"
                      name="universityId"
                      value={universitySlug}
                      onChange={(e) => setUniversitySlug(e.target.value)}
                      className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-white ${
                        fieldErrors.universityId?.[0]
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <option value="">-- Select Your University --</option>
                      {NIGERIAN_UNIVERSITIES.map((uni) => (
                        <option key={uni.slug} value={uni.slug}>
                          {uni.name} ({uni.acronym}) — {uni.state}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.universityId?.[0] && (
                      <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold">
                        {fieldErrors.universityId[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Department / Course of Study (Optional)"
                      type="text"
                      name="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science, Medicine, Law"
                      error={fieldErrors.department?.[0]}
                    />
                  </div>
                </>
              )}

              {/* Landlord Specific Fields */}
              {activeRole === 'landlord' && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                      Provider Authority Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setProviderType('owner')}
                        className={`flex items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                          providerType === 'owner'
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-600/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        Direct Property Owner
                      </button>

                      <button
                        type="button"
                        onClick={() => setProviderType('authorized_representative')}
                        className={`flex items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                          providerType === 'authorized_representative'
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-600/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        Authorized Agent / Caretaker
                      </button>
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Business / Agency Name (Optional)"
                      type="text"
                      name="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Prime Campus Housing Ltd"
                      error={fieldErrors.businessName?.[0]}
                    />
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters (1 uppercase, 1 number)"
                    required
                    autoComplete="new-password"
                    className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 ${
                      fieldErrors.password?.[0]
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password?.[0] && (
                  <p className="mt-1 text-xs text-rose-700 dark:text-rose-300 font-semibold">
                    {fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                  error={fieldErrors.confirmPassword?.[0]}
                />
              </div>

              {/* Terms & Privacy checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                />
                <label
                  htmlFor="agree-terms"
                  className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isPending}
                className="w-full font-semibold shadow-md py-2.5 text-sm"
              >
                {activeRole === 'student' ? 'Create Student Account' : 'Create Landlord Account'}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                href={`/login${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ''}`}
                className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
