'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { resetPasswordAction } from '../actions';

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (result.success && result.message) {
        setStatusMessage(result.message);
      } else if (result.message) {
        setErrorMessage(result.message);
      }
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter the email associated with your account and we will dispatch a secure reset link.
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

              {statusMessage && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <Input
                label="Email address"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" isLoading={isPending}>
                Send Reset Link
              </Button>

              <div className="text-center text-xs text-slate-500">
                <Link href="/login" className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

