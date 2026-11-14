'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  BookmarkCheck,
  Heart,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Building2,
  ShieldCheck,
  Compass,
  GraduationCap,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { getInspections, getLodges } from '@/lib/data/lodges-data';
import { Inspection, Lodge } from '@/types/database';
import { WinningCTA } from '@/components/ui/winning-cta';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

export default function StudentOverviewPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [lodges, setLodges] = useState<Lodge[]>([]);
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
      setLodges(getLodges());
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
    <div className="space-y-8">
      {/* Top Header Row with Status & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/50 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Student Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentDate}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/student/explore">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs backdrop-blur-md cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <span>Campus Filters</span>
            </button>
          </Link>
        </div>
      </div>

      {/* STAGE 1: ORDER OF OPERATION — PRIMARY HERO ACTION (Frosted Glass) */}
      <div className="relative rounded-3xl border border-slate-200/70 bg-white/75 dark:border-slate-800/70 dark:bg-slate-900/75 p-6 sm:p-8 backdrop-blur-xl shadow-lg overflow-hidden space-y-6">
        {/* Glow ambient accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Stage 1 in Pipeline: In-Person Physical Inspection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Ready to secure your campus lodge, Daniel?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Never commit rent blindly. Explore verified accommodations around your university and request
              a zero-fee physical room inspection with approved caretakers.
            </p>
          </div>

          {/* Primary Winning CTA with Looping Flying Plane Icon */}
          <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
            <WinningCTA
              idleText="Explore Verified Accommodations"
              winText="Lock In Your Spot — Win!"
              href="/student/explore"
              size="lg"
            />
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              100% Free • Verified Direct Landlords • ₦0 Agent Commission
            </span>
          </div>
        </div>

        {/* Pipeline Progress Indicator */}
        <div className="pt-4 border-t border-slate-100/80 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/50">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
              ✓
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block truncate">1. Profile Active</span>
              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400">Student testing role</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
              2
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block truncate">2. Inspect Room</span>
              <span className="text-[10px] text-blue-700/80 dark:text-blue-400">Physical verification</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs">
              3
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block truncate">3. Confirm Booking</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Mutual lease confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 2: RELATIONSHIP-GROUPED ACTIVITY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scheduled Physical Inspections (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Room Inspections ({activeInspections.length})
              </h3>
            </div>
            <Link
              href="/student/inspections"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              View All History →
            </Link>
          </div>

          {activeInspections.length > 0 ? (
            <div className="space-y-3">
              {activeInspections.slice(0, 3).map((insp) => (
                <div
                  key={insp.id}
                  className="rounded-2xl border border-slate-200/70 bg-white/80 dark:border-slate-800/70 dark:bg-slate-900/80 p-5 backdrop-blur-md shadow-2xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                    <div className="space-y-0.5">
                      <Link
                        href={`/lodges/${insp.property_slug}`}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {insp.property_title}
                      </Link>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{insp.property_address}</span>
                      </p>
                    </div>

                    <span className="self-start sm:self-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60">
                      {insp.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{insp.requested_date} ({insp.time_slot})</span>
                      </span>
                      {insp.student_phone && (
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{insp.student_phone}</span>
                        </span>
                      )}
                    </div>

                    <Link href={`/lodges/${insp.property_slug}`}>
                      <button
                        type="button"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Inspect Property Details →
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-8 text-center backdrop-blur-md space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  No pending inspections scheduled yet
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Browse approved campus listings and click &ldquo;Schedule Physical Inspection&rdquo; to test water, power, and room security in person.
                </p>
              </div>
              <Link href="/student/explore">
                <button
                  type="button"
                  className="rounded-xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 px-4 py-2 text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                >
                  Browse Campus Lodges
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Fast Jump & Shortcuts */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            <Link href="/student/explore">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/70 bg-white/80 hover:bg-white hover:border-slate-300 dark:border-slate-800/70 dark:bg-slate-900/80 dark:hover:bg-slate-850 backdrop-blur-md transition-all shadow-2xs group cursor-pointer">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:scale-105 transition-transform">
                  <Compass className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Explore All Lodges</p>
                  <p className="text-[11px] text-slate-400">Filter by distance, water, and budget</p>
                </div>
              </div>
            </Link>

            <Link href="/student/universities">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/70 bg-white/80 hover:bg-white hover:border-slate-300 dark:border-slate-800/70 dark:bg-slate-900/80 dark:hover:bg-slate-850 backdrop-blur-md transition-all shadow-2xs group cursor-pointer">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Universities Directory</p>
                  <p className="text-[11px] text-slate-400">Explore housing around 50+ campuses</p>
                </div>
              </div>
            </Link>

            <Link href="/student/bookings">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/70 bg-white/80 hover:bg-white hover:border-slate-300 dark:border-slate-800/70 dark:bg-slate-900/80 dark:hover:bg-slate-850 backdrop-blur-md transition-all shadow-2xs group cursor-pointer">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <BookmarkCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">My Room Bookings</p>
                  <p className="text-[11px] text-slate-400">Mutual lease agreements and receipts</p>
                </div>
              </div>
            </Link>

            <Link href="/how-it-works">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/70 bg-white/80 hover:bg-white hover:border-slate-300 dark:border-slate-800/70 dark:bg-slate-900/80 dark:hover:bg-slate-850 backdrop-blur-md transition-all shadow-2xs group cursor-pointer">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Trust & Safety Policy</p>
                  <p className="text-[11px] text-slate-400">Physical inspection guarantee guidelines</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* STAGE 3: FOLD UNIMPORTANT & SECONDARY CONTENT INTO ACCORDIONS */}
      <div className="space-y-4 pt-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Operational Guides & Protocols
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expandable documentation organized by lifecycle stage so you only view what you need.
          </p>
        </div>

        <Accordion>
          {/* Accordion 1: Step-by-Step Onboarding Checklist */}
          <AccordionItem
            title="Step-by-Step Student Accommodation Checklist"
            subtitle="Follow these 4 lifecycle milestones to verify and move in safely"
            badge="Checklist"
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
          >
            <div className="py-2 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">1. Filter by Verified Landlords</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Always confirm the green verified badge. Verified providers have passed physical property registry checks.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">2. Check Running Water & Light</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    During physical inspection, test boreholes, overhead tanks, and verify prepaid electricity meter tokens.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">3. Review Window & Door Security</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Examine burglar proofing, perimeter fences, gate hours, and security guard coverage before agreeing to tenancy.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">4. Confirm Upfront Fee Breakdown</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Zero agent fees. Pay only the annual rent and legitimate caution deposit directly to the verified owner.
                  </p>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* Accordion 2: Tenant Protection Rules */}
          <AccordionItem
            title="Student Tenant Safety Rules & Inspection Protocols"
            subtitle="Mandatory guidelines to prevent agent scams and advance fee fraud"
            badge="Anti-Scam"
            icon={<ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
          >
            <div className="py-2 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-amber-950 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200 space-y-1">
                <span className="font-bold">The Golden Rule: Never Transfer Rent Before Inspection</span>
                <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-300">
                  LodgeHere caretakers will never ask for payment to show a room. Physical inspections are 100% free.
                  If an individual asks for inspection fees or upfront commitment before meeting at the lodge, report them immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white">Physical Key Handover</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Test the physical key in the deadbolt lock during your inspection visit.
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white">Direct Caretaker Handshake</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Confirm the caretaker lives on premise or has verifiable contact numbers displayed on the compound notice board.
                  </p>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* Accordion 3: Emergency Assistance */}
          <AccordionItem
            title="Campus Dispute Resolution & Emergency Caretaker Support"
            subtitle="Direct channels for student welfare and landlord coordination"
            badge="Support"
            icon={<HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
          >
            <div className="py-2 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p className="text-[11px] leading-relaxed">
                If an inspection appointment is missed by a property owner or a room was falsely advertised as vacant, our campus representative team mediates within 24 hours.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>Support Helpline: +234 800 LODGEHERE</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400">Available Monday–Saturday (8:00 AM – 6:00 PM)</span>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
