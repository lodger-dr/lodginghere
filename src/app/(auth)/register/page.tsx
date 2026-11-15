'use client';

import React, { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signUpWithEmailAction } from '../actions';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: ['Passwords do not match'] });
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    startTransition(async () => {
      try {
        const response = await signUpWithEmailAction(formData);

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
      <div className="w-full max-w-md space-y-6">
        <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
              Join thousands of Nigerian students and verified accommodation providers.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 sm:px-8 pb-8 pt-4">
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-950/50 p-3.5 text-xs text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-900/60 shadow-2xs"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* OPTION 1: Continue with Google */}
            <div className="space-y-2">
              <GoogleAuthButton
                text="Continue with Google"
                next={nextUrl}
                onError={(err) => setErrorMessage(err)}
                className="w-full h-12 rounded-2xl font-bold shadow-xs hover:shadow-md transition-all text-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              />
              <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                Fastest setup: your name and email are pre-filled
              </p>
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Or continue with email
              </div>
            </div>

            {/* OPTION 2: Continue with Email */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="student@university.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 chars, 1 uppercase & 1 number"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                    {fieldErrors.password[0]}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 rounded-2xl text-xs bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                    {fieldErrors.confirmPassword[0]}
                  </p>
                )}
              </div>

              {/* Agree to Terms */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
                />
                <label
                  htmlFor="agree-terms"
                  className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug cursor-pointer"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all text-xs flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <span>Creating your account...</span>
                ) : (
                  <>
                    <span>Continue with Email</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>

            {/* FOOTER SWITCH */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                  href={`/login${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ''}`}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* TRUST BADGES */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 dark:text-slate-500 px-2">
          <div className="flex items-center justify-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            <span>Verified Lodges</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span>Zero Agent Fraud</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
            <span>Instant Booking</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
