'use client';

import React, { Suspense } from 'react';
import { StudentMapHome } from '@/components/home/student-map-home';

export default function StudentExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A] animate-pulse">
            <span className="font-extrabold text-xl">LH</span>
          </div>
          <p className="text-xs font-bold text-slate-600">Loading discovery map...</p>
        </div>
      }
    >
      <StudentMapHome />
    </Suspense>
  );
}
