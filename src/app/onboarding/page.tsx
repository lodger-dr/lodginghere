'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function OnboardingPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#24272B] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#E8E8E5] rounded-3xl p-8 shadow-xs text-center space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#FFF0E9] text-[#F45B2A] font-extrabold text-2xl mx-auto shadow-xs">
          LH
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#24272B]">Student Onboarding</h1>
          <p className="text-sm text-slate-500">
            {user ? `Welcome ${user.email}!` : 'Clean onboarding canvas ready.'}
            <br />
            Waiting for your instructions for Step 1.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl border border-[#E8E8E5] hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors text-center"
          >
            ← Back to Home
          </Link>
          <Link
            href="/student/explore"
            className="w-full py-3 px-4 rounded-xl bg-[#F45B2A] hover:bg-[#e04d1d] text-white font-bold text-sm transition-colors text-center"
          >
            Go to Map Discovery
          </Link>
        </div>
      </div>
    </main>
  );
}
