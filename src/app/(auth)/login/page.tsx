'use client';

import React, { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInAction } from '../actions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '';
  const urlError = searchParams.get('error');
  const isRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(urlError);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (nextUrl) {
      formData.append('next', nextUrl);
    }

    startTransition(async () => {
      try {
        const response = await signInAction(formData);

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
        setErrorMessage('An unexpected error occurred during sign in. Please try again.');
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md space-y-6">
        <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl">
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Sign in to manage your campus bookings, inspections, or accommodation listings.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-2">
            {isRegistered && (
              <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/40 p-3 text-xs text-blue-900 dark:text-blue-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <span>Account created successfully! Please sign in with your email and password.</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google OAuth Login */}
            <div>
              <GoogleAuthButton
                text="Continue with Google"
                next={nextUrl}
                onError={(msg) => setErrorMessage(msg)}
              />
            </div>

            {/* Visual Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                or continue with email
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu.ng or personal email"
                  required
                  autoComplete="email"
                  error={fieldErrors.email?.[0]}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password-input"
                    className="block text-sm font-medium text-slate-800 dark:text-slate-200"
                  >
                    Password
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 ${
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

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isPending}
                className="w-full font-semibold shadow-md py-2.5 text-sm"
              >
                Sign In
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href={`/register${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ''}`}
                className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
