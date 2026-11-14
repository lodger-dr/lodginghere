'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Building2, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signInAction } from '../actions';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await signInAction(formData);
      if (!result.success) {
        if (result.message) {
          setErrorMessage(result.message);
        }
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to your student or landlord account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                error={fieldErrors.email?.[0]}
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  error={fieldErrors.password?.[0]}
                />
                <div className="flex justify-end pt-1">
                  <Link
                    href="/reset-password"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full gap-2" isLoading={isPending}>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="text-center text-xs text-slate-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Register as Student or Landlord
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

