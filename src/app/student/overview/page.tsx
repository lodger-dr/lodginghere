'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  BookmarkCheck,
  Heart,
  Search,
  CheckCircle2,
  Circle,
  SlidersHorizontal,
  Building2,
  FileText,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { getInspections, getLodges } from '@/lib/data/lodges-data';
import { Inspection } from '@/types/database';

export default function StudentOverviewPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [currentDate, setCurrentDate] = useState('Saturday, 14 November 2026');

  useEffect(() => {
    try {
      setCurrentDate(
        new Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(new Date())
      );
    } catch {}

    const load = () => {
      setInspections(getInspections());
    };
    load();

    const handleDataChange = () => load();
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  const activeInspections = inspections.filter(
    (i) => i.status === 'pending' || i.status === 'accepted' || i.status === 'reschedule_requested'
  );

  return (
    <div className="space-y-6">
      {/* Top Header Row (matching Dojah screenshot) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/explore">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <span>Filters</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Onboarding Checklist Card (Directly following Dojah reference screenshot) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Welcome to LodgeHere, Daniel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete these steps to find and secure your student accommodation
          </p>
        </div>

        {/* 4 Steps */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Step 1: Completed */}
          <div className="flex items-center justify-between py-3.5 first:pt-0">
            <div className="flex items-start gap-3.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Account created</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Your student testing profile is active</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>

          {/* Step 2: Explore */}
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-700 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Explore campus lodges</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Filter approved listings near your university</p>
              </div>
            </div>
            <Link href="/explore">
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Start
              </button>
            </Link>
          </div>

          {/* Step 3: Inspections */}
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-700 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Schedule physical inspection</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">View running water, electricity, and room security in person</p>
              </div>
            </div>
            <Link href="/student/inspections">
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Inspect
              </button>
            </Link>
          </div>

          {/* Step 4: Book */}
          <div className="flex items-center justify-between py-3.5 last:pb-0">
            <div className="flex items-start gap-3.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-700 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Confirm room booking record</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Agree on terms and confirm mutual booking snapshot</p>
              </div>
            </div>
            <Link href="/student/bookings">
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Try it
              </button>
            </Link>
          </div>
        </div>

        {/* Progress Bar (Dojah style) */}
        <div className="space-y-1.5 pt-2">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-1/4 transition-all duration-500" />
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            1 of 4 complete
          </span>
        </div>
      </div>

      {/* Quick Actions Row (matching Dojah reference screenshot) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/explore">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-all cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Search className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Browse Lodges
              </span>
            </div>
          </Link>

          <Link href="/student/inspections">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-all cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                My Inspections
              </span>
            </div>
          </Link>

          <Link href="/student/bookings">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-all cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <BookmarkCheck className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Room Bookings
              </span>
            </div>
          </Link>

          <Link href="/how-it-works">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-all cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Trust Standards
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
