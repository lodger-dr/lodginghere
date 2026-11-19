'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LandingPageView } from '@/components/home/landing-page-view';
import { StudentMapHome } from '@/components/home/student-map-home';

function HomePageContent() {
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') === 'map' ? 'map' : 'overview';
  const [view, setView] = useState<'overview' | 'map'>(initialView);

  return (
    <>
      {view === 'overview' ? (
        <LandingPageView onSwitchToMap={() => setView('map')} />
      ) : (
        <div className="space-y-2">
          {/* Top Switcher Banner */}
          <div className="bg-white border-b border-[#E8E8E5] px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={() => setView('overview')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#F45B2A] transition-colors cursor-pointer"
              >
                <span>← Back to Overview</span>
              </button>
              <span className="text-[11px] font-bold text-[#F45B2A]">
                📍 Interactive Discovery Map Active
              </span>
            </div>
          </div>
          <StudentMapHome />
        </div>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A] animate-pulse">
            <span className="font-extrabold text-xl">LH</span>
          </div>
          <p className="text-xs font-bold text-slate-600">Loading LodgeHere...</p>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
