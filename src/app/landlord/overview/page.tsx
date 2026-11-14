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
  AlertCircle,
  HelpCircle,
  Phone,
} from 'lucide-react';
import { getLodges, fetchLodges, getInspections, fetchInspections } from '@/lib/data/lodges-data';
import { Lodge, Inspection } from '@/types/database';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { WinningCTA } from '@/components/ui/winning-cta';

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
            <WinningCTA
              idleText="Add Property"
              winText="List & Fill Vacancies — Win!"
              size="sm"
            />
          </Link>
        </div>
      </div>

      {/* STAGE 1: Onboarding Lifecycle Checklist Card (Directly following Dojah reference screenshot with Frosted Glass) */}
      <div className="glass-card rounded-2xl p-6 shadow-xs space-y-6">
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
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs"
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
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs"
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
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs"
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

      {/* STAGE 2: Quick Actions & Key Portfolio Metrics */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/landlord/properties"
            className="group glass-card rounded-2xl p-4 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Properties</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{lodges.length} listed</p>
            </div>
          </Link>

          <Link
            href="/landlord/rooms"
            className="group glass-card rounded-2xl p-4 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <BedDouble className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Room Inventory</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{totalAvailable} available</p>
            </div>
          </Link>

          <Link
            href="/landlord/inspections"
            className="group glass-card rounded-2xl p-4 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Inspections</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{pendingInspections.length} pending</p>
            </div>
          </Link>

          <Link
            href="/landlord/verification"
            className="group glass-card rounded-2xl p-4 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 group-hover:scale-105 transition-transform">
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
        <div className="glass-card rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Properties</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{lodges.length}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Available Vacancies</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalAvailable}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <BedDouble className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Inspections</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingInspections.length}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* STAGE 3: Property & Room Portfolio Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lodge Listings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update photos, transparent pricing, distances to university gates, and amenities.
            </p>
          </div>
          <Link href="/landlord/properties">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>View All Properties ({lodges.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Room Vacancy & Units</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add individual units (e.g. Room 101), set rents, and toggle vacancies in real time.
            </p>
          </div>
          <Link href="/landlord/rooms">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>Manage Room Inventory ({totalRooms} rooms)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* STAGE 4: FOLD SECONDARY COMPLIANCE & PROTOCOLS INTO ACCORDIONS */}
      <div className="space-y-4 pt-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Landlord Compliance & Operating Standards
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Folded operational protocols for physical inspections, escrow releases, and caretaker SLAs.
          </p>
        </div>

        <Accordion>
          {/* Accordion 1: Physical Inspection Code & Landlord SLA */}
          <AccordionItem
            title="Physical Inspection Code & Landlord SLA"
            subtitle="24-hour response window, zero unannounced entry, and compound access standards"
            badge="Standard"
            icon={<ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
          >
            <div className="py-2 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">24-Hour Response SLA</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Acknowledge incoming student inspection requests within 24 hours to maintain high placement ranking on search results.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">No Hidden Inspection Fees</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inspections are 100% free of charge for students. Demanding viewing fees will cause immediate listing suspension.
                  </p>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* Accordion 2: Direct Student Escrow & Zero Agent Mandate */}
          <AccordionItem
            title="Direct Student Tenancy & Zero Agent Mandate"
            subtitle="Legal compliance requiring direct contracts without intermediary markups"
            badge="Direct Contract"
            icon={<FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
          >
            <div className="py-2 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="text-[11px] leading-relaxed">
                By listing on LodgeHere, you agree that students book rooms directly with you or your authorized caretaker. No unregulated third-party agents are permitted to inflate room prices on our network.
              </p>
            </div>
          </AccordionItem>

          {/* Accordion 3: Caretaker Helpline */}
          <AccordionItem
            title="Landlord Partner Support & Account Executive Line"
            subtitle="Priority line for property listing assistance, campus zoning, and room verification"
            badge="Support"
            icon={<HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
          >
            <div className="py-2 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>Landlord Priority Desk: +234 800 LODGEHERE (Ext 2)</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400">Dedicated Account Manager Assigned</span>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
