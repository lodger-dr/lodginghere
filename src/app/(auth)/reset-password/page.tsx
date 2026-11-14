'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 mb-2 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>LodgeHere Access</span>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">Direct Access Active</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Authentication forms are bypassed for development. You can freely explore all student and landlord features
              by selecting your role.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Link href="/login" className="block">
              <button
                type="button"
                className="w-full rounded-full bg-slate-900 py-3 text-xs font-semibold text-white transition-colors hover:bg-black"
              >
                Choose Persona
              </button>
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
