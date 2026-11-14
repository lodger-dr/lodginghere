'use client';

import React, { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Building2, GraduationCap, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { signUpAction } from '../actions';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'landlord' ? 'landlord' : 'student';

  const [role, setRole] = useState<'student' | 'landlord'>(initialRole);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    formData.set('role', role);

    startTransition(async () => {
      try {
        const result = await signUpAction(formData);
        if (!result.success) {
          if (result.message) {
            setErrorMessage(result.message);
          }
          if (result.errors) {
            setFieldErrors(result.errors);
          }
        } else if (result.redirectTo) {
          window.location.href = result.redirectTo;
        } else if (result.message) {
          setSuccessMessage(result.message);
        }
      } catch (err: unknown) {
        setErrorMessage('Unable to connect to the authentication server. Please check your internet connection.');
      }
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an Account</h1>
          <p className="text-sm text-slate-500">
            Join the verified student accommodation marketplace
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-200/80 p-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all ${
              role === 'student'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>I am a Student</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('landlord')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all ${
              role === 'landlord'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>I am a Landlord / Owner</span>
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{role === 'student' ? 'Student Registration' : 'Property Owner Registration'}</CardTitle>
            <CardDescription>
              {role === 'student'
                ? 'Discover approved lodges, save favourites, and schedule physical inspections.'
                : 'List your property, manage room inventory, and receive verified student inspections.'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <Input
                label="Full name"
                name="fullName"
                type="text"
                required
                placeholder="e.g. Chinedu Okafor"
                error={fieldErrors.fullName?.[0]}
              />

              <Input
                label="Email address"
                name="email"
                type="email"
                required
                placeholder="chinedu@example.com"
                error={fieldErrors.email?.[0]}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                required
                placeholder="At least 8 chars, 1 uppercase, 1 number"
                helperText="Must be at least 8 characters with letters and numbers"
                error={fieldErrors.password?.[0]}
              />

              <Input
                label="Phone number (WhatsApp preferred)"
                name="phone"
                type="tel"
                placeholder="08012345678"
                helperText="Used for inspection coordination"
                error={fieldErrors.phone?.[0]}
              />

              {/* Student-specific fields */}
              {role === 'student' && (
                <>
                  <Select
                    label="Primary University"
                    name="universityId"
                    error={fieldErrors.universityId?.[0]}
                  >
                    <option value="">Select your university...</option>
                    {NIGERIAN_UNIVERSITIES.map((u) => (
                      <option key={u.slug} value={u.slug}>
                        {u.name} ({u.acronym}) — {u.state} State
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Department / Course (Optional)"
                    name="department"
                    type="text"
                    placeholder="e.g. Computer Science"
                    error={fieldErrors.department?.[0]}
                  />
                </>
              )}

              {/* Landlord-specific fields */}
              {role === 'landlord' && (
                <>
                  <Select
                    label="Your Provider Authority"
                    name="providerType"
                    required
                    error={fieldErrors.providerType?.[0]}
                  >
                    <option value="owner">Direct Property Owner / Landlord</option>
                    <option value="authorized_representative">
                      Authorized Representative / Manager (Requires document proof)
                    </option>
                  </Select>

                  <Input
                    label="Business or Lodge Brand Name (Optional)"
                    name="businessName"
                    type="text"
                    placeholder="e.g. Apex Luxury Lodges"
                    error={fieldErrors.businessName?.[0]}
                  />

                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 space-y-1">
                    <span className="font-semibold block">Provider Accountability Notice</span>
                    <span>
                      All property listings require identity proof and property authority documentation before
                      they can be published to students.
                    </span>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full gap-2" isLoading={isPending}>
                <span>Create {role === 'student' ? 'Student' : 'Landlord'} Account</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="relative my-1 w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">Or sign up with</span>
                </div>
              </div>

              <a href="/auth/login?screen_hint=signup" className="w-full">
                <Button type="button" variant="outline" className="w-full gap-2">
                  <span>Sign up with Auth0 Universal Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>

              <div className="text-center text-xs text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading registration form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}


