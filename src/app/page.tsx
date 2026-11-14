'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  CalendarCheck,
  FileCheck2,
  User,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Search,
  Plus,
} from 'lucide-react';
import { HeroSearch } from '@/components/home/hero-search';
import { fetchLodges, getLodges } from '@/lib/data/lodges-data';
import { LodgeCard } from '@/components/lodges/lodge-card';
import { Lodge } from '@/types/database';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [featuredLodges, setFeaturedLodges] = useState<Lodge[]>([]);

  useEffect(() => {
    // Initial fetch from Supabase / localStorage fallback
    fetchLodges().then((lodges) => {
      setFeaturedLodges(lodges.slice(0, 3));
    });

    const handleDataChange = () => {
      setFeaturedLodges(getLodges().slice(0, 3));
    };

    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 pt-16 pb-24 text-white">
        {/* Subtle geometric dot matrix */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified Student Accommodation • Nigerian Campuses</span>
          </div>

          {/* Punchy Startup Headline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-white">
              Find Your Perfect <br />
              <span className="text-emerald-400">Campus Home.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore genuine student accommodation around universities in Nigeria. 100% transparent upfront pricing,
              verified landlords, and direct physical inspections before booking.
            </p>
          </div>

          {/* Startup Search Box */}
          <HeroSearch />
        </div>
      </section>

      {/* Featured Lodges Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-3 py-1 rounded-full">
              Live Campus Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Verified Student Lodges
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Approved student accommodations with verified water, electricity, and 0% agency fees.
            </p>
          </div>

          <Link href="/explore">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 hover:border-slate-300 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              <span>Explore All Campuses</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        {/* Dynamic Display: Real Lodges or Authentic Zero-State */}
        {featuredLodges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLodges.map((lodge) => (
              <LodgeCard key={lodge.id} lodge={lodge} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 p-8 sm:p-12 text-center space-y-4 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Be The First Verified Landlord Around Your Campus
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We never show fabricated mock listings. As property owners submit genuine lodges with transparent
                costs and real photos, they appear here instantly.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/landlord/properties">
                <Button className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-xs">
                  <Plus className="h-4 w-4" />
                  <span>List Your Lodge (0% Agency Fee)</span>
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" className="gap-1.5">
                  <Search className="h-4 w-4" />
                  <span>Explore Search Filters</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4-Step How It Works Workflow */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How LodgeHere Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built specifically for Nigerian student realities. Every step enforces verification and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Campus Discovery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Filter by university, neighbourhood, budget, and accommodation type (self-con, single room, flat).
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upfront Total Costs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              See the full financial picture before leaving home: annual rent, caution deposit, and agreement fees.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Physical Inspection</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Schedule a physical inspection on a chosen date. Confirm water, light, and security in person with the caretaker.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Confirmed Booking</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pick your exact room number. Agree on terms with the verified landlord with zero middleman scams.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-16 border-y border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
              Verification Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Strict Verification. Zero Fake Inventory.
            </h2>
            <p className="text-sm text-slate-400">
              Every accommodation listing on LodgeHere adheres to rigorous verification benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-3">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
              <h3 className="font-bold text-base text-white">Identity & Authority Checks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Landlords submit government-issued ID and verified ownership or management authority documentation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-3">
              <FileCheck2 className="h-8 w-8 text-blue-400" />
              <h3 className="font-bold text-base text-white">Fee Transparency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All charges (rent, caution, service charges) are declared upfront. No sudden 50k agency charges on arrival.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 space-y-3">
              <CalendarCheck className="h-8 w-8 text-purple-400" />
              <h3 className="font-bold text-base text-white">Inspection Before Payment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students physically inspect the exact room code and test utilities before locking in payment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
