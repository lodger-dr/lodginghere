'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  BedDouble,
  CalendarCheck,
  ShieldCheck,
  Plus,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  FileText,
  Clock,
  Eye,
} from 'lucide-react';
import { getLodges, fetchLodges, getInspections, fetchInspections } from '@/lib/data/lodges-data';
import { Lodge, Inspection } from '@/types/database';

export default function LandlordOverviewPage() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
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
      setLodges(getLodges());
      setInspections(getInspections());
      fetchLodges().then((l) => setLodges(l));
      fetchInspections().then((i) => setInspections(i));
    };
    load();

    const handleDataChange = () => {
      setLodges(getLodges());
      setInspections(getInspections());
    };
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  const totalRooms = lodges.reduce((acc, l) => acc + (l.total_rooms || 0), 0);
  const totalAvailable = lodges.reduce((acc, l) => acc + (l.available_rooms || 0), 0);
  const pendingInspections = inspections.filter(
    (i) => i.status === 'pending' || i.status === 'reschedule_requested'
  );

  return (
    <div className="space-y-6">
      {/* Top Header Row (matching Dojah reference layout) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/landlord/properties">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <span>Filters</span>
            </button>
          </Link>
          <Link href="/landlord/properties">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Property</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Onboarding Checklist Card (Directly following Dojah reference screenshot) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Welcome to LodgeHere, Chief Adebayo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete these steps to manage your properties and receive student bookings
          </p>
        </div>

        {/* 4 Steps */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Step 1: Provider Profile Ready */}
          <div className="flex items-center justify-between py-3.5 first:pt-0">
            <div className="flex items-start gap-3.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Provider profile verified</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Your registered landlord identity and banking details are verified
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              Verified
            </span>
          </div>

          {/* Step 2: Add Lodge Listing */}
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-700 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Add lodge property listing</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Publish photo gallery, transparent pricing breakdown, and campus distance
                </p>
              </div>
            </div>
            <Link href="/landlord/properties">
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Start
              </button>
            </Link>
          </div>

          {/* Step 3: Room Inventory */}
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-700 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Configure room inventory & vacancies</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Set up individual room units (e.g. Room 101) and real-time vacancies
                </p>
              </div>
            </div>
            <Link href="/landlord/rooms">
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Add
              </button>
            </Link>
          </div>

          {/* Step 4: Inspections */}
          <div className="flex items-center justify-between py-3.5 last:pb-0">
            <div className="flex items-start gap-3.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-700 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Review student inspection requests</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Accept or reschedule physical inspection appointments with students
                </p>
              </div>
            </div>
            <Link href="/landlord/inspections">
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Inspect
              </button>
            </Link>
          </div>
        </div>

        {/* Progress Bar (Green bar with 1 of 4 complete) */}
        <div className="pt-2">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            1 of 4 complete
          </p>
        </div>
      </div>

      {/* Quick Actions (matching Dojah cards row) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/landlord/properties"
            className="group rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Properties</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{lodges.length} listed</p>
            </div>
          </Link>

          <Link
            href="/landlord/rooms"
            className="group rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <BedDouble className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Room Inventory</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{totalAvailable} available</p>
            </div>
          </Link>

          <Link
            href="/landlord/inspections"
            className="group rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Inspections</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{pendingInspections.length} pending</p>
            </div>
          </Link>

          <Link
            href="/landlord/verification"
            className="group rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Verification</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Provider Status</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Properties</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{lodges.length}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Available Vacancies</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalAvailable}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <BedDouble className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Inspections</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingInspections.length}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Verification Notice Banner */}
      <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 mt-0.5">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-blue-950 dark:text-blue-200">
              Provider Verification Active
            </h4>
            <p className="text-xs text-blue-900/80 dark:text-blue-300/80 leading-relaxed max-w-xl">
              Your provider profile is marked verified. Your lodges and rooms are publicly discoverable on the explore page and ready for student inspection booking.
            </p>
          </div>
        </div>
        <Link href="/landlord/verification">
          <button
            type="button"
            className="rounded-lg border border-blue-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-200 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            View Documents
          </button>
        </Link>
      </div>

      {/* Property & Room Quick Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lodge Listings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update photos, transparent pricing, distances to university gates, and amenities.
            </p>
          </div>
          <Link href="/landlord/properties">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>View All Properties ({lodges.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Room Vacancy & Units</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add individual units (e.g. Room 101), set rents, and toggle vacancies in real time.
            </p>
          </div>
          <Link href="/landlord/rooms">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Manage Room Inventory ({totalRooms} rooms)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
