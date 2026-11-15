'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { resetPasswordAction } from '../actions';

function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isRecoverySession, setIsRecoverySession] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.includes('type=recovery');
    }
    return false;
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to auth state events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoverySession(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSendResetEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('email', email);

    startTransition(async () => {
      try {
        const res = await resetPasswordAction(formData);
        if (!res.success) {
          setErrorMessage(res.message || 'Could not send reset link.');
        } else {
          setMessage(res.message || 'Password reset link sent! Check your email inbox.');
        }
      } catch {
        setErrorMessage('Failed to send reset link. Please check your internet connection.');
      }
    });
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        setMessage('Your password has been successfully updated! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch {
        setErrorMessage('Failed to update password. Please try again.');
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md space-y-6">
        <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>LodgeHere Security</span>
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isRecoverySession ? 'Set New Password' : 'Reset your password'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isRecoverySession
                ? 'Enter your new secure password below to regain full access to your account.'
                : 'Enter your registered email address and we will dispatch a secure reset link.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {message && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span>{message}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isRecoverySession ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      autoComplete="new-password"
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
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
                </div>

                <div>
                  <Input
                    label="Confirm New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isPending}
                  className="w-full font-semibold shadow-md py-2.5 text-sm"
                >
                  Update Password
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
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
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isPending}
                  className="w-full font-semibold shadow-md py-2.5 text-sm"
                >
                  Send Reset Link
                </Button>
              </form>
            )}

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading password reset...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
