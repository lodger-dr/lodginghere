'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Compass,
  MapPin,
  ShieldCheck,
  CalendarCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Search,
  Sparkles,
  Home,
  Wallet,
  Users,
  ChevronDown,
  ChevronRight,
  Star,
  ExternalLink,
  Smartphone,
  BedDouble,
  Layers,
  Map as MapIcon,
  HelpCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { getAllAvailableLodges } from '@/lib/data/lodges-data';
import { formatNaira } from '@/lib/utils';
import { Lodge } from '@/types/database';
import { LodgeCard } from '@/components/lodges/lodge-card';
import { InspectionModal } from '@/components/lodges/inspection-modal';

interface LandingPageViewProps {
  onSwitchToMap?: () => void;
}

const POPULAR_CAMPUSES = [
  {
    name: 'Abia State University',
    shortName: 'ABSU Uturu',
    slug: 'abia-state-university',
    state: 'Abia State',
    highlight: 'Uturu & Okigwe Corridor',
    count: '14+ Lodges',
  },
  {
    name: 'University of Nigeria',
    shortName: 'UNN Nsukka',
    slug: 'university-of-nigeria',
    state: 'Enugu State',
    highlight: 'Hilltop & Ofulonu',
    count: '18+ Lodges',
  },
  {
    name: 'Michael Okpara Univ.',
    shortName: 'MOUAU Umudike',
    slug: 'michael-okpara-university-of-agriculture-umudike',
    state: 'Abia State',
    highlight: 'Umudike & Umuahia',
    count: '9+ Lodges',
  },
  {
    name: 'University of Lagos',
    shortName: 'UNILAG Akoka',
    slug: 'university-of-lagos',
    state: 'Lagos State',
    highlight: 'Akoka & Abule-Oja',
    count: '24+ Lodges',
  },
  {
    name: 'University of Ibadan',
    shortName: 'UI Ibadan',
    slug: 'university-of-ibadan',
    state: 'Oyo State',
    highlight: 'Agbowo & Bodija',
    count: '16+ Lodges',
  },
  {
    name: 'Obafemi Awolowo Univ.',
    shortName: 'OAU Ife',
    slug: 'obafemi-awolowo-university',
    state: 'Osun State',
    highlight: 'Mayfair & Gate Area',
    count: '15+ Lodges',
  },
  {
    name: 'University of Benin',
    shortName: 'UNIBEN Benin',
    slug: 'university-of-benin',
    state: 'Edo State',
    highlight: 'Ekosodin & BDPA',
    count: '12+ Lodges',
  },
  {
    name: 'Fed. Univ. Tech Akure',
    shortName: 'FUTA Akure',
    slug: 'federal-university-of-technology-akure',
    state: 'Ondo State',
    highlight: 'South Gate & West Gate',
    count: '11+ Lodges',
  },
];

const FAQS = [
  {
    question: 'Are there really zero agent and legal fees on LodgeHere?',
    answer:
      'Yes, 100%. Traditional real estate agents on campus demand between ₦30,000 and ₦100,000 in agency and agreement fees. LodgeHere connects students directly with verified property owners and direct caretakers, so you pay only the true room rent with zero middleman markup.',
  },
  {
    question: 'How do physical inspections work?',
    answer:
      'You can schedule a free physical visit directly on any lodge page. A verified property representative meets you at the lodge so you can inspect the room, verify running water, electricity, security gates, and neighborhood safety before making any financial commitment.',
  },
  {
    question: 'Can I find accommodation around my university if I am not in school yet?',
    answer:
      'Yes. The application centers all searches around your chosen university campus. You can filter by walking distance (e.g. 5 mins walk to main gate) or expand the radius to 10 miles to explore more budget-friendly lodge corridors.',
  },
  {
    question: 'How does LodgeHere verify landlords?',
    answer:
      'Every listing undergoes institutional cross-verification: property ownership documents, national identification (NIN/Voter Card), physical on-site lodge confirmation, and direct verification of current student occupancy.',
  },
  {
    question: 'Can I use LodgeHere as a mobile app on my phone?',
    answer:
      'Yes! LodgeHere is a Progressive Web App (PWA). You can install it straight to your home screen on Android (via Chrome) and iPhone (via Safari Share menu) for a fast, standalone app experience with offline support.',
  },
];

export function LandingPageView({ onSwitchToMap }: LandingPageViewProps) {
  const router = useRouter();
  const [selectedCampus, setSelectedCampus] = useState('abia-state-university');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [inspectLodge, setInspectLodge] = useState<Lodge | null>(null);

  // Available real lodges
  const allLodges = useMemo(() => getAllAvailableLodges(), []);

  // Filtered showcase lodges for the selected campus
  const showcaseLodges = useMemo(() => {
    return allLodges
      .filter((l) => {
        if (!selectedCampus) return true;
        return l.university_slug === selectedCampus;
      })
      .slice(0, 6);
  }, [allLodges, selectedCampus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSwitchToMap) {
      if (typeof window !== 'undefined' && selectedCampus) {
        localStorage.setItem('lodgehere_user_university', selectedCampus);
      }
      onSwitchToMap();
    } else {
      router.push(`/student/explore?university=${selectedCampus}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#24272B] font-sans selection:bg-[#FFF0E9] selection:text-[#F45B2A]">
      {/* ======================================================== */}
      {/* 1. TOP INTERACTIVE VIEW SWITCHER (MAP VS OVERVIEW) */}
      {/* ======================================================== */}
      <div className="sticky top-14 z-30 bg-[#F8F8F6]/95 backdrop-blur-md border-b border-[#E8E8E5] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#E8E8E5] shadow-2xs">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-[#24272B] text-white shadow-xs"
            >
              <Home className="h-3 w-3 text-[#F45B2A]" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (onSwitchToMap) onSwitchToMap();
                else router.push('/student/explore');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-slate-600 hover:text-[#F45B2A] transition-colors cursor-pointer"
            >
              <Compass className="h-3 w-3 text-[#F45B2A]" />
              <span>Interactive Map View</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>328 Nigerian Campuses Covered</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onSwitchToMap) onSwitchToMap();
              else router.push('/student/explore');
            }}
            className="inline-flex sm:hidden items-center gap-1 text-xs font-black text-[#F45B2A] hover:underline"
          >
            <span>Open Map</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Subtle background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#FFF0E9] rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 border border-[#E8E8E5] shadow-xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF0E9] text-[#F45B2A] text-xs font-black">
                ₦0
              </span>
              <span className="text-xs font-bold text-[#24272B]">
                Zero Agent & Legal Fees • 100% Free Inspections
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#24272B] tracking-tight leading-[1.12]">
              Find your student lodge{' '}
              <span className="text-[#F45B2A] relative inline-block">
                near campus.
                <svg
                  className="absolute left-0 -bottom-2 w-full h-2.5 text-[#F45B2A]/30"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>{' '}
              Without agents or scams.
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              A map-first discovery platform built for Nigerian university students. Discover verified off-campus accommodation centered around your school gate, with real walking distances and transparent upfront rent.
            </p>

            {/* Smart Search Card */}
            <div className="bg-white rounded-3xl border border-[#E8E8E5] p-4 sm:p-5 shadow-xl space-y-3.5">
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Campus Selector */}
                  <div className="sm:col-span-6 rounded-2xl bg-[#FFF0E9]/50 border border-[#E8E8E5] px-3.5 py-2.5 focus-within:border-[#F45B2A] transition-colors">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Where do you go to school?
                    </label>
                    <select
                      value={selectedCampus}
                      onChange={(e) => setSelectedCampus(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-black text-[#24272B] focus:outline-none cursor-pointer truncate mt-0.5"
                    >
                      {NIGERIAN_UNIVERSITIES.map((uni) => (
                        <option key={uni.slug} value={uni.slug}>
                          {uni.name} ({uni.acronym})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Selector */}
                  <div className="sm:col-span-3 rounded-2xl bg-white border border-[#E8E8E5] px-3 py-2.5 focus-within:border-[#F45B2A] transition-colors">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Budget
                    </label>
                    <select
                      value={budgetFilter}
                      onChange={(e) => setBudgetFilter(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#24272B] focus:outline-none cursor-pointer truncate mt-0.5"
                    >
                      <option value="">Any Budget</option>
                      <option value="150000">Under ₦150k / yr</option>
                      <option value="250000">₦150k – ₦250k</option>
                      <option value="400000">₦250k – ₦400k</option>
                      <option value="600000">₦400k+</option>
                    </select>
                  </div>

                  {/* Room Type */}
                  <div className="sm:col-span-3 rounded-2xl bg-white border border-[#E8E8E5] px-3 py-2.5 focus-within:border-[#F45B2A] transition-colors">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Room Type
                    </label>
                    <select
                      value={roomTypeFilter}
                      onChange={(e) => setRoomTypeFilter(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#24272B] focus:outline-none cursor-pointer truncate mt-0.5"
                    >
                      <option value="">All Types</option>
                      <option value="self_contained">Self-Con</option>
                      <option value="single_room">Single Room</option>
                      <option value="shared_apartment">Shared Flat</option>
                    </select>
                  </div>
                </div>

                {/* Submit Row with Dual CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 rounded-2xl bg-[#F45B2A] hover:bg-[#DE4C1D] text-white font-black px-6 py-3.5 text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F45B2A]/25 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Compass className="h-4 w-4" />
                    <span>Explore Lodges On Interactive Map</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    href="/onboarding"
                    className="w-full sm:w-auto rounded-2xl bg-[#FFF0E9] hover:bg-[#ffe4d6] text-[#F45B2A] font-bold px-4 py-3.5 text-xs text-center border border-[#F45B2A]/20 transition-colors"
                  >
                    Start Student Setup
                  </Link>
                </div>
              </form>

              {/* Popular Campus Quick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Popular:
                </span>
                {POPULAR_CAMPUSES.slice(0, 5).map((camp) => (
                  <button
                    key={camp.slug}
                    type="button"
                    onClick={() => {
                      setSelectedCampus(camp.slug);
                    }}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold shrink-0 transition-colors border ${
                      selectedCampus === camp.slug
                        ? 'bg-[#24272B] text-white border-[#24272B]'
                        : 'bg-white text-slate-700 border-[#E8E8E5] hover:border-[#F45B2A] hover:text-[#F45B2A]'
                    }`}
                  >
                    {camp.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="rounded-2xl bg-white border border-[#E8E8E5] p-3 text-left shadow-2xs">
                <p className="text-lg sm:text-xl font-black text-[#24272B]">0%</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Agent/Legal fee</p>
              </div>
              <div className="rounded-2xl bg-white border border-[#E8E8E5] p-3 text-left shadow-2xs">
                <p className="text-lg sm:text-xl font-black text-[#24272B]">328</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Nigerian Campuses</p>
              </div>
              <div className="rounded-2xl bg-white border border-[#E8E8E5] p-3 text-left shadow-2xs">
                <p className="text-lg sm:text-xl font-black text-[#F45B2A]">100%</p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Verified Owners</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: The Google Maps Inspired Teaser Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[380px] rounded-[36px] p-3 bg-gradient-to-b from-[#24272B] to-[#121315] shadow-2xl ring-1 ring-white/10">
              {/* Phone Speaker Notch */}
              <div className="mx-auto h-4 w-32 rounded-full bg-black/60 mb-2 flex items-center justify-center">
                <div className="h-1 w-10 rounded-full bg-white/20" />
              </div>

              {/* Inner Screen */}
              <div className="relative rounded-[28px] overflow-hidden bg-[#EBF0EC] border border-[#E8E8E5] h-[520px] flex flex-col justify-between">
                {/* Floating Top Controls inside phone */}
                <div className="p-3 space-y-2 z-10">
                  <div className="flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-[#E8E8E5]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-xl bg-[#FFF0E9] flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-[#F45B2A]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-[#24272B] truncate">
                          Around Abia State University
                        </p>
                        <p className="text-[9px] font-semibold text-slate-500">Uturu Campus Gate</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#24272B] px-2 py-0.5 text-[10px] font-black text-white shrink-0">
                      5 mi
                    </span>
                  </div>
                </div>

                {/* Simulated Map Pins on Canvas */}
                <div className="relative flex-1">
                  {/* Central Campus Landmark Pin */}
                  <div className="absolute top-[36%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#24272B] text-white shadow-xl ring-4 ring-[#24272B]/20">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-full bg-[#24272B] text-white text-[9px] font-black shadow-md">
                      ABSU Gate
                    </span>
                  </div>

                  {/* Marker 1 (Active) */}
                  <div className="absolute top-[22%] left-[26%] flex flex-col items-center animate-bounce duration-1000">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F45B2A] text-white shadow-xl ring-4 ring-[#F45B2A]/30">
                      <Home className="h-3.5 w-3.5" />
                    </div>
                    <span className="mt-0.5 px-2 py-0.5 rounded-full bg-white text-[#24272B] text-[9px] font-black border border-[#E8E8E5] shadow-xs">
                      ₦180k
                    </span>
                  </div>

                  {/* Marker 2 */}
                  <div className="absolute top-[28%] right-[20%] flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F45B2A] text-white shadow-md">
                      <Home className="h-3 w-3" />
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 rounded-full bg-white text-[#24272B] text-[8px] font-bold border border-[#E8E8E5]">
                      ₦220k
                    </span>
                  </div>

                  {/* Marker 3 */}
                  <div className="absolute bottom-[30%] left-[32%] flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F45B2A] text-white shadow-md">
                      <Home className="h-3 w-3" />
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 rounded-full bg-white text-[#24272B] text-[8px] font-bold border border-[#E8E8E5]">
                      ₦150k
                    </span>
                  </div>

                  {/* Marker 4 */}
                  <div className="absolute bottom-[34%] right-[24%] flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F45B2A] text-white shadow-md">
                      <Home className="h-3 w-3" />
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 rounded-full bg-white text-[#24272B] text-[8px] font-bold border border-[#E8E8E5]">
                      ₦300k
                    </span>
                  </div>
                </div>

                {/* Bottom Property Preview Card */}
                <div className="p-3 z-10">
                  <div className="bg-white rounded-2xl p-3 shadow-xl border border-[#E8E8E5] space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-14 w-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80"
                          alt="Lodge preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-[10px] font-black text-[#F45B2A]">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Verified Owner</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#24272B] truncate">
                          Achara Comfort Villa
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          Self-Con • 4 mins to ABSU Gate
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-[#F45B2A]">₦180k</p>
                        <p className="text-[9px] text-slate-400">/year</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSwitchToMap) onSwitchToMap();
                        else router.push('/student/explore?university=abia-state-university');
                      }}
                      className="w-full rounded-xl bg-[#24272B] hover:bg-black text-white text-[11px] font-bold py-2 text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Compass className="h-3.5 w-3.5 text-[#F45B2A]" />
                      <span>Launch Full Discovery Map</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. THE 4 PILLARS (THE STUDENT PROBLEM SOLVED) */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-y border-[#E8E8E5] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-black text-[#F45B2A] uppercase tracking-wider">
              The LodgeHere Difference
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#24272B] tracking-tight">
              Say goodbye to campus agent extortion.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Students lose millions each semester to fake landlords, illegal agency fees, and ghost hostels. LodgeHere was built to eliminate middlemen completely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-3xl bg-[#F8F8F6] border border-[#E8E8E5] p-6 space-y-3.5 text-left transition-transform hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A]">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-[#24272B]">0% Agent & Legal Fees</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never pay ₦40k–₦100k to agents just to see a key. On LodgeHere, deal directly with verified landlords and caretakers at ₦0 commission.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl bg-[#F8F8F6] border border-[#E8E8E5] p-6 space-y-3.5 text-left transition-transform hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A]">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-[#24272B]">Free Physical Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never rent from blurry pictures. Schedule free in-person visits to check running water, light, security gates, and room conditions first.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl bg-[#F8F8F6] border border-[#E8E8E5] p-6 space-y-3.5 text-left transition-transform hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A]">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-[#24272B]">Campus Centric Maps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover accommodation anchored around your university gate. Toggle between 5-mile and 10-mile radius with accurate walking times.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl bg-[#F8F8F6] border border-[#E8E8E5] p-6 space-y-3.5 text-left transition-transform hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-[#24272B]">Verified Property Owners</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every owner undergoes institutional identity checks. Say goodbye to ghost hostels, double allocations, and disappearances with deposits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. POPULAR CAMPUSES DIRECTORY SHOWCASE */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <span className="text-[11px] font-black text-[#F45B2A] uppercase tracking-wider">
              Popular Tertiary Institutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#24272B] tracking-tight">
              Where do you study?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Select your institution to see active accommodation within walking distance of the gate.
            </p>
          </div>

          <Link
            href="/universities"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#F45B2A] hover:underline shrink-0"
          >
            <span>View All 328 Campuses</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Campus Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {POPULAR_CAMPUSES.map((camp) => {
            const isSelected = selectedCampus === camp.slug;
            return (
              <div
                key={camp.slug}
                onClick={() => setSelectedCampus(camp.slug)}
                className={`group rounded-3xl p-5 border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-white border-[#F45B2A] ring-2 ring-[#F45B2A]/20 shadow-md'
                    : 'bg-white border-[#E8E8E5] hover:border-[#F45B2A]/40 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0E9] text-[#F45B2A] text-xs font-black">
                    {camp.shortName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-black text-[#24272B] bg-[#F8F8F6] px-2 py-0.5 rounded-full border border-[#E8E8E5]">
                    {camp.count}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#24272B] group-hover:text-[#F45B2A] transition-colors truncate">
                  {camp.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">{camp.highlight}</p>
                <p className="text-[11px] font-medium text-slate-400 mt-1">{camp.state}</p>

                <div className="mt-4 pt-3 border-t border-[#E8E8E5] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-600">
                    {isSelected ? 'Selected Campus' : 'Select'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSwitchToMap) onSwitchToMap();
                      else router.push(`/student/explore?university=${camp.slug}`);
                    }}
                    className="text-[#F45B2A] font-bold hover:underline flex items-center gap-0.5 text-[11px]"
                  >
                    <span>Map</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. LIVE VERIFIED LODGES SHOWCASE */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-y border-[#E8E8E5] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-[#F45B2A] uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Listings Showcase</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#24272B] tracking-tight">
                Featured Accommodations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Real student lodges near {POPULAR_CAMPUSES.find((c) => c.slug === selectedCampus)?.name || 'campus'}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onSwitchToMap) onSwitchToMap();
                else router.push(`/student/explore?university=${selectedCampus}`);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#24272B] hover:bg-black text-white px-5 py-2.5 text-xs font-bold transition-all active:scale-95 shrink-0"
            >
              <Compass className="h-3.5 w-3.5 text-[#F45B2A]" />
              <span>View All on Map</span>
            </button>
          </div>

          {/* Lodges Grid */}
          {showcaseLodges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseLodges.map((lodge) => (
                <LodgeCard
                  key={lodge.id}
                  lodge={lodge}
                  onBookInspection={(l) => setInspectLodge(l)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#E8E8E5] bg-[#F8F8F6] p-12 text-center space-y-3">
              <Building2 className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-[#24272B]">No lodges displayed for this campus yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Switch to another institution or open the interactive map to explore neighboring corridors.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCampus('abia-state-university')}
                className="inline-flex items-center gap-1 rounded-full bg-[#F45B2A] text-white px-4 py-2 text-xs font-bold"
              >
                View ABSU Uturu Lodges
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. HOW IT WORKS (3 SIMPLE STEPS) */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-black text-[#F45B2A] uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#24272B] tracking-tight">
            How LodgeHere works for students
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From search to moving in without paying a kobo to middleman agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative rounded-3xl bg-white border border-[#E8E8E5] p-7 space-y-4 text-left shadow-xs">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A] font-black text-sm">
              01
            </span>
            <h3 className="text-lg font-black text-[#24272B]">Choose Your University</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your institution (e.g. ABSU, UNN, UNILAG). The discovery map immediately centers around your campus gates and student corridors.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-3xl bg-white border border-[#E8E8E5] p-7 space-y-4 text-left shadow-xs">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A] font-black text-sm">
              02
            </span>
            <h3 className="text-lg font-black text-[#24272B]">Explore on the Live Map</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tap orange pins to inspect rent, room types (Self-Con, Single room, Shared Flat), photos, distance in miles, and room vacancies.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-3xl bg-white border border-[#E8E8E5] p-7 space-y-4 text-left shadow-xs">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A] font-black text-sm">
              03
            </span>
            <h3 className="text-lg font-black text-[#24272B]">Book Inspection & Move In</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Book a scheduled physical inspection, test the water and electricity in person, meet the verified owner, and pay zero agency fee.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FOR LANDLORDS & HOSTEL OWNERS SECTION */}
      {/* ======================================================== */}
      <section className="py-16 bg-[#24272B] text-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto rounded-[36px] bg-gradient-to-br from-[#24272B] to-[#17191b] border border-white/10 p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold text-[#F45B2A]">
                <Building2 className="h-3.5 w-3.5" />
                <span>For Lodge Owners & Caretakers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                Fill your student rooms in days, not months.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Connect directly with thousands of verified university students looking for off-campus accommodation. 0% commission on bookings, automated vacancy updates, and direct inspection requests to your phone.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-[#F45B2A] shrink-0" />
                  <span>0% Commission Fees</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-[#F45B2A] shrink-0" />
                  <span>Verified Student Tenants</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-[#F45B2A] shrink-0" />
                  <span>Room-by-Room Vacancy</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/register?role=landlord"
                className="w-full rounded-2xl bg-[#F45B2A] hover:bg-[#DE4C1D] text-white font-black py-4 px-6 text-sm text-center shadow-xl shadow-[#F45B2A]/30 transition-all active:scale-95"
              >
                List Your Property Free
              </Link>
              <Link
                href="/login"
                className="w-full rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold py-3.5 px-6 text-xs text-center border border-white/15 transition-colors"
              >
                Landlord Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. PWA DOWNLOAD / MOBILE APP HIGHLIGHT */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-[36px] bg-[#FFF0E9]/60 border border-[#E8E8E5] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#F45B2A] shadow-xs">
              <Smartphone className="h-3.5 w-3.5" />
              <span>Install Directly On Your Phone</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#24272B] tracking-tight">
              Get the LodgeHere PWA App
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No need to download heavy apps from app stores. LodgeHere installs directly to your home screen on Android and iPhone with native standalone speed and offline caching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/student/profile"
              className="rounded-2xl bg-[#24272B] hover:bg-black text-white font-black px-6 py-3.5 text-xs shadow-md flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4 text-[#F45B2A]" />
              <span>Install on Android / iPhone</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (onSwitchToMap) onSwitchToMap();
                else router.push('/student/explore');
              }}
              className="rounded-2xl bg-white border border-[#E8E8E5] hover:border-[#F45B2A] text-[#24272B] font-bold px-5 py-3.5 text-xs"
            >
              Explore Web App
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-t border-[#E8E8E5] px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black text-[#F45B2A] uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#24272B] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-[#E8E8E5] bg-[#F8F8F6] overflow-hidden text-left transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4.5 text-left text-xs sm:text-sm font-bold text-[#24272B] hover:text-[#F45B2A] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400 ${
                        isOpen ? 'rotate-180 text-[#F45B2A]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4.5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-[#E8E8E5] pt-3 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. FINAL CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-[36px] bg-[#24272B] text-white p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F45B2A]/15 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-black text-[#F45B2A]">
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive Campus Discovery</span>
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to find your student home?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Pick your university, explore nearby lodges on the live map, and book a free inspection today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onSwitchToMap) onSwitchToMap();
                else router.push('/student/explore');
              }}
              className="w-full sm:w-auto rounded-2xl bg-[#F45B2A] hover:bg-[#DE4C1D] text-white font-black px-8 py-4 text-sm shadow-xl shadow-[#F45B2A]/30 transition-all active:scale-95 cursor-pointer"
            >
              Launch Interactive Discovery Map 🗺️
            </button>
            <Link
              href="/onboarding"
              className="w-full sm:w-auto rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-4 text-xs border border-white/20 transition-colors"
            >
              Start Student Onboarding 🚀
            </Link>
          </div>
        </div>
      </section>

      {/* Physical Inspection Booking Modal */}
      {inspectLodge && (
        <InspectionModal
          lodge={inspectLodge}
          isOpen={Boolean(inspectLodge)}
          onClose={() => setInspectLodge(null)}
        />
      )}
    </div>
  );
}
