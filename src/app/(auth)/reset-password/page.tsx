'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Building2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Testing Stage</span>
            </div>
            <CardTitle>Authentication Bypassed</CardTitle>
            <CardDescription>
              Password management and signing in are disabled during development. You can freely access all student and
              landlord features by selecting your persona.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Go to Role Selection
              </Button>
            </Link>
            <Link href="/" className="block text-center text-xs text-slate-500 hover:text-slate-800 pt-2">
              Return to Homepage
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
