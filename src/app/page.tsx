'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { WelcomeScreen } from '@/components/home/welcome-screen';
import { DiscoverScreen } from '@/components/home/discover-screen';
import { StudentMapHome } from '@/components/home/student-map-home';
import { useAuth } from '@/context/auth-context';

function HomePageContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Mode: 'welcome' (Screen 1) | 'discover' (Screen 2) | 'map' (Interactive Map Discovery)
  const initialMode =
    searchParams.get('view') === 'map'
      ? 'map'
      : searchParams.get('view') === 'welcome'
      ? 'welcome'
      : isAuthenticated
      ? 'discover'
      : 'welcome';

  const [viewMode, setViewMode] = useState<'welcome' | 'discover' | 'map'>(initialMode);

  return (
    <div className="min-h-screen bg-[#F0F0EE] flex flex-col items-center">
      {/* Top Floating View Switcher for Easy Review */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#E8E8E5] sticky top-0 z-50 py-2 px-4 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#F45B2A] tracking-tight">LodgeHere</span>

          <div className="inline-flex items-center bg-[#F8F8F6] p-1 rounded-full border border-[#E8E8E5]">
            <button
              type="button"
              onClick={() => setViewMode('welcome')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'welcome'
                  ? 'bg-[#24272B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Welcome
            </button>

            <button
              type="button"
              onClick={() => setViewMode('discover')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'discover'
                  ? 'bg-[#24272B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Discover
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#24272B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </header>

      {/* Main Screen Container */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col">
        {viewMode === 'welcome' && (
          <WelcomeScreen
            onExplore={() => setViewMode('discover')}
            onLogin={() => {}}
          />
        )}

        {viewMode === 'discover' && (
          <DiscoverScreen
            onOpenMap={() => setViewMode('map')}
            onOpenWelcome={() => setViewMode('welcome')}
          />
        )}

        {viewMode === 'map' && (
          <div className="w-full min-h-screen bg-[#F8F8F6]">
            <div className="px-4 py-2 flex items-center justify-between bg-white border-b border-[#E8E8E5]">
              <button
                type="button"
                onClick={() => setViewMode('discover')}
                className="text-xs font-bold text-slate-600 hover:text-[#F45B2A] transition-colors cursor-pointer"
              >
                ← Back to Feed
              </button>
              <span className="text-[11px] font-bold text-[#F45B2A]">
                📍 Map Discovery
              </span>
            </div>
            <StudentMapHome />
          </div>
        )}
      </main>
    </div>
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
