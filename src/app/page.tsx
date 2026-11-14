'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileCheck2,
  CalendarCheck,
  MapPin,
  Building2,
  Plus,
  ArrowRight,
  Search,
  CheckCircle2,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { HeroSearch } from '@/components/home/hero-search';
import { fetchLodges, getLodges } from '@/lib/data/lodges-data';
import { LodgeCard } from '@/components/lodges/lodge-card';
import { InspectionModal } from '@/components/lodges/inspection-modal';
import { Lodge } from '@/types/database';
import { Button } from '@/components/ui/button';

// Editorial Curated Lodges matching authentic Nigerian university campuses
const CURATED_SHOWCASE_LODGES: Lodge[] = [
  {
    id: 'showcase-1',
    title: 'Emerald Haven Self-Con',
    slug: 'emerald-haven-self-con-akoka',
    description: 'Fully tiled modern self-contained unit with personal balcony, 24/7 borehole water, and dedicated prepaid meter.',
    landlord_id: 'landlord-1',
    landlord_name: 'Chief Adebayo (Verified Landlord)',
    landlord_phone: '+234 803 123 4567',
    landlord_verified: true,
    university_slug: 'university-of-lagos',
    university_name: 'University of Lagos (UNILAG)',
    campus_name: 'Main Campus',
    neighbourhood: 'Akoka',
    address: '14 University Road, Akoka, Yaba, Lagos',
    distance_to_campus: '5 mins walk to Gate',
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 350000,
      max_price: 350000,
      caution_deposit: 30000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'prepaid_meter', 'gated_compound', 'security_guard'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 0,
    review_count: 0,
    total_rooms: 8,
    available_rooms: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'showcase-2',
    title: 'Oakwood Executive Studio',
    slug: 'oakwood-executive-studio-agbowo',
    description: 'Spacious studio apartment with fitted kitchen cabinets, modern bathroom, and continuous solar inverter backup.',
    landlord_id: 'landlord-2',
    landlord_name: 'Dr. O. Williams (Verified Owner)',
    landlord_phone: '+234 802 987 6543',
    landlord_verified: true,
    university_slug: 'university-of-ibadan',
    university_name: 'University of Ibadan (UI)',
    campus_name: 'Main Campus',
    neighbourhood: 'Agbowo',
    address: '8 Bodija Extension, Agbowo, Ibadan',
    distance_to_campus: '3 mins to UI Main Gate',
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 320000,
      max_price: 320000,
      caution_deposit: 25000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'solar_inverter', 'gated_compound', 'tiled_floor'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 0,
    review_count: 0,
    total_rooms: 6,
    available_rooms: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'showcase-3',
    title: 'Silvercrest Private Lodge',
    slug: 'silvercrest-private-lodge-mayfair',
    description: 'Serene student lodge with quiet reading zones, standby generator, and 24-hour perimeter security fencing.',
    landlord_id: 'landlord-3',
    landlord_name: 'Alhaji Sanusi (Verified Landlord)',
    landlord_phone: '+234 814 333 4455',
    landlord_verified: true,
    university_slug: 'obafemi-awolowo-university',
    university_name: 'Obafemi Awolowo University (OAU)',
    campus_name: 'Main Campus',
    neighbourhood: 'Mayfair',
    address: '22 Mayfair Roundabout, Ile-Ife, Osun State',
    distance_to_campus: '8 mins by campus shuttle',
    accommodation_type: 'single_room',
    pricing: {
      min_price: 280000,
      max_price: 280000,
      caution_deposit: 20000,
      service_charge: 20000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'generator', 'security_guard', 'gated_compound'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 0,
    review_count: 0,
    total_rooms: 12,
    available_rooms: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'showcase-4',
    title: 'Pinecrest Prime Suites',
    slug: 'pinecrest-prime-suites-ekosodin',
    description: 'Newly renovated modern student apartments with tiled floors, wide windows, and personal borehole connection.',
    landlord_id: 'landlord-4',
    landlord_name: 'Engr. Osasere (Verified Landlord)',
    landlord_phone: '+234 805 111 2233',
    landlord_verified: true,
    university_slug: 'university-of-benin',
    university_name: 'University of Benin (UNIBEN)',
    campus_name: 'Ugbowo Campus',
    neighbourhood: 'Ekosodin',
    address: '5 Ekosodin Road, Ugbowo, Benin City',
    distance_to_campus: '4 mins walk to Back Gate',
    accommodation_type: 'self_contained',
    pricing: {
      min_price: 300000,
      max_price: 300000,
      caution_deposit: 30000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'prepaid_meter', 'generator', 'gated_compound'],
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 0,
    review_count: 0,
    total_rooms: 10,
    available_rooms: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'showcase-5',
    title: 'Grand Vista 1-Bed Flat',
    slug: 'grand-vista-one-bed-flat-southgate',
    description: 'Spacious one-bedroom apartment with separate living room, fitted kitchen sink, and constant running water.',
    landlord_id: 'landlord-5',
    landlord_name: 'Mrs. F. Oladipo (Verified Owner)',
    landlord_phone: '+234 807 444 8899',
    landlord_verified: true,
    university_slug: 'federal-university-of-technology-akure',
    university_name: 'FUTA Akure',
    campus_name: 'Main Campus',
    neighbourhood: 'South Gate',
    address: '18 South Gate Junction, FUTA, Akure',
    distance_to_campus: '6 mins walk to South Gate',
    accommodation_type: 'one_bedroom',
    pricing: {
      min_price: 420000,
      max_price: 420000,
      caution_deposit: 40000,
      service_charge: 20000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'wifi', 'solar_inverter', 'kitchen_cabinet'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 0,
    review_count: 0,
    total_rooms: 4,
    available_rooms: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'showcase-6',
    title: 'Campus Edge Residency',
    slug: 'campus-edge-residency-hilltop',
    description: 'Comfortable student lodge offering quiet study spaces, reliable water storage tanks, and prepaid meter.',
    landlord_id: 'landlord-6',
    landlord_name: 'Barrister Nnamdi (Verified Landlord)',
    landlord_phone: '+234 809 666 7788',
    landlord_verified: true,
    university_slug: 'university-of-nigeria',
    university_name: 'University of Nigeria (UNN)',
    campus_name: 'Nsukka Campus',
    neighbourhood: 'Hilltop',
    address: '7 Hilltop Road, UNN, Nsukka, Enugu',
    distance_to_campus: '5 mins to Lecture Theatres',
    accommodation_type: 'single_room',
    pricing: {
      min_price: 250000,
      max_price: 250000,
      caution_deposit: 20000,
      service_charge: 15000,
      legal_agency_fee: 0,
    },
    amenities: ['running_water', 'prepaid_meter', 'security_guard', 'tiled_floor'],
    images: ['https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    rating: 0,
    review_count: 0,
    total_rooms: 14,
    available_rooms: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const CAMPUS_FILTER_TABS = [
  { label: 'All Lodges', slug: '' },
  { label: 'UNILAG (Akoka)', slug: 'university-of-lagos' },
  { label: 'UI (Ibadan)', slug: 'university-of-ibadan' },
  { label: 'OAU (Ife)', slug: 'obafemi-awolowo-university' },
  { label: 'UNIBEN (Benin)', slug: 'university-of-benin' },
  { label: 'FUTA (Akure)', slug: 'federal-university-of-technology-akure' },
];

export default function HomePage() {
  const [liveLodges, setLiveLodges] = useState<Lodge[]>([]);
  const [activeCampusTab, setActiveCampusTab] = useState('');
  const [selectedLodgeForInspection, setSelectedLodgeForInspection] = useState<Lodge | null>(null);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);

  useEffect(() => {
    fetchLodges().then((lodges) => {
      setLiveLodges(lodges);
    });

    const handleDataChange = () => {
      setLiveLodges(getLodges());
    };

    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  // Merge live database inventory with curated showcases
  const allLodges: Lodge[] = useMemo(() => {
    const combined = [...liveLodges];
    for (const showcase of CURATED_SHOWCASE_LODGES) {
      if (!combined.some((l) => l.slug === showcase.slug)) {
        combined.push(showcase);
      }
    }
    return combined;
  }, [liveLodges]);

  // Filter based on selected campus tab
  const filteredLodges = useMemo(() => {
    if (!activeCampusTab) return allLodges;
    return allLodges.filter((l) => l.university_slug === activeCampusTab);
  }, [allLodges, activeCampusTab]);

  const section1Lodges = filteredLodges.slice(0, 3);
  const section2Lodges = (activeCampusTab ? filteredLodges.slice(3, 6) : allLodges.slice(3, 6));

  const handleOpenInspection = (lodge: Lodge) => {
    setSelectedLodgeForInspection(lodge);
    setInspectionModalOpen(true);
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-28">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Elevated Architectural Perspective) */}
      {/* ======================================================== */}
      <section className="relative px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl sm:rounded-[2.75rem] bg-slate-950 min-h-[600px] sm:min-h-[660px] flex flex-col justify-between p-6 sm:p-12 text-center shadow-2xl ring-1 ring-black/10">

          {/* Architectural Street Perspective Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=85')`,
            }}
          />

          {/* Balanced Editorial Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/35" />

          {/* Centered Headline & Badge */}
          <div className="relative z-10 mx-auto max-w-4xl pt-10 sm:pt-16 space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-md text-balance leading-tight">
              Browse Homes, Apartments <br className="hidden sm:inline" />
              & Rentals with Ease
            </h1>

            {/* Translucent Glass Pill Badge */}
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                <span>Verified Student Accommodation • Nigerian Campuses</span>
              </span>
            </div>
          </div>

          {/* Bottom Floating Search Capsule Bar */}
          <div className="relative z-20 pt-10 pb-2 w-full">
            <HeroSearch />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. FLOATING 4-FEATURE HIGHLIGHTS BAR */}
        {/* ======================================================== */}
        <div className="relative z-30 mx-auto max-w-6xl -mt-6 sm:-mt-8 px-2 sm:px-4">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xl shadow-slate-950/5 ring-1 ring-black/5 dark:ring-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 lg:divide-x lg:divide-slate-100 dark:lg:divide-slate-800">

              {/* Feature 1 */}
              <div className="flex items-center gap-3.5 lg:px-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    Direct Landlords
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    0% middleman agent fees
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3.5 lg:px-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
                  <FileCheck2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    Itemized Upfront Costs
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Clear rent & caution fees
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3.5 lg:px-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
                  <CalendarCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    Physical Inspection
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Inspect room before paying
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3.5 lg:px-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    Campus Proximity
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Walking distance to gates
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SECTION 1: "Browse Verified Accommodations" */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
              Browse Verified Accommodations
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl text-pretty">
              Verified student accommodations with running water, power amenities, and 0% agent markups.
            </p>
          </div>

          {/* Quick Campus Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CAMPUS_FILTER_TABS.map((tab) => {
              const isActive = activeCampusTab === tab.slug;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveCampusTab(tab.slug)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.96] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${isActive
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-emerald-500 dark:text-slate-950'
                      : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white border border-slate-300/80 dark:border-slate-700/80'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section1Lodges.map((lodge) => (
            <LodgeCard
              key={lodge.id}
              lodge={lodge}
              onBookInspection={handleOpenInspection}
            />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SECTION 2: "Curated Campus Accommodations" */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            Curated Campus Accommodations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-pretty">
            Handpicked student residences selected for security, perimeter fencing, and conducive academic learning environments.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section2Lodges.map((lodge) => (
            <LodgeCard
              key={lodge.id}
              lodge={lodge}
              onBookInspection={handleOpenInspection}
            />
          ))}
        </div>

        {/* Explore All Campus Lodges Action */}
        <div className="pt-4 text-center">
          <Link href="/explore">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-7 py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs hover:border-slate-400 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              <span>Explore All Verified Lodges</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. HOW LODGEHERE WORKS (Step-by-step Trust Flow) */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-3.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            How LodgeHere Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-pretty">
            Built specifically for Nigerian student realities. Every step enforces verification, zero surprises, and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Campus Discovery</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-pretty">
              Filter by university, neighbourhood, budget, and accommodation type (self-con, single room, flat).
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Upfront Total Costs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-pretty">
              See the full financial picture before leaving home: annual rent, caution deposit, and agreement fees.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Physical Inspection</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-pretty">
              Schedule a physical inspection on a chosen date. Confirm water, light, and security in person with the caretaker.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Confirmed Booking</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-pretty">
              Pick your exact room number. Agree on terms directly with the verified landlord with zero middleman scams.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. LANDLORD CALL-TO-ACTION BANNER */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl sm:rounded-[2.5rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3.5 py-1 rounded-full">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>For Property Owners & Caretakers</span>
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white text-balance">
                List Your Campus Lodge with 0% Agency Markup
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
                Connect directly with verified university students searching for off-campus accommodation. Fill vacancies without agent middleman disputes, fake inquiries, or delayed remittances.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
              <Link href="/landlord/properties">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-7 py-3.5 shadow-md gap-2 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>List Your Property</span>
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-full px-7 py-3.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none">
                  <span>How Verification Works</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Booking Modal (Interactive on click) */}
      <InspectionModal
        lodge={selectedLodgeForInspection}
        isOpen={inspectionModalOpen}
        onClose={() => {
          setInspectionModalOpen(false);
          setSelectedLodgeForInspection(null);
        }}
        onSuccess={() => {
          setInspectionModalOpen(false);
          setSelectedLodgeForInspection(null);
        }}
      />
    </div>
  );
}
