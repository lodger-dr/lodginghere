'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileCheck2,
  CalendarCheck,
  MapPin,
  ArrowRight,
  Building2,
  Plus,
} from 'lucide-react';
import { HeroSearch } from '@/components/home/hero-search';
import { fetchLodges, getLodges } from '@/lib/data/lodges-data';
import { LodgeCard } from '@/components/lodges/lodge-card';
import { InspectionModal } from '@/components/lodges/inspection-modal';
import { Lodge } from '@/types/database';
import { Button } from '@/components/ui/button';
import { FaqJsonLd } from '@/components/shared/json-ld';

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

const CAMPUS_TABS = [
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

  const allLodges: Lodge[] = useMemo(() => {
    const combined = [...liveLodges];
    for (const showcase of CURATED_SHOWCASE_LODGES) {
      if (!combined.some((l) => l.slug === showcase.slug)) {
        combined.push(showcase);
      }
    }
    return combined;
  }, [liveLodges]);

  const displayedLodges = useMemo(() => {
    if (!activeCampusTab) return allLodges.slice(0, 6);
    return allLodges.filter((l) => l.university_slug === activeCampusTab).slice(0, 6);
  }, [allLodges, activeCampusTab]);

  const handleOpenInspection = (lodge: Lodge) => {
    setSelectedLodgeForInspection(lodge);
    setInspectionModalOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <FaqJsonLd />
      {/* ======================================================== */}
      {/* 1. MINIMALIST HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-6 text-center">
        <div className="mx-auto max-w-3xl space-y-5">
          {/* Clean Focused Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
            Find verified lodges <br className="hidden sm:block" />
            near your campus.
          </h1>

          {/* Clean Subheadline */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed text-pretty">
            Connect directly with verified landlords. Transparent pricing, zero agent exploitation,
            and free physical inspections before you pay.
          </p>

          {/* Clean Horizontal Search Bar */}
          <div className="pt-4 sm:pt-6">
            <HeroSearch />
          </div>
        </div>

        {/* 4 Minimalist Assurances in a clean single row */}
        <div className="mx-auto max-w-4xl mt-12 sm:mt-16 pt-8 border-t border-slate-200/70 dark:border-slate-800/70">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Direct Landlords</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">0% agent markup</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Clear Pricing</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Itemized rent & caution</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 shrink-0">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Physical Inspection</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Inspect before paying</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Campus Proximity</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Walking distance to gates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. AVAILABLE VERIFIED LODGES */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Available Lodges
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Verified off-campus accommodations ready for physical inspection.
            </p>
          </div>

          {/* Campus Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CAMPUS_TABS.map((tab) => {
              const isActive = activeCampusTab === tab.slug;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveCampusTab(tab.slug)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lodge Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedLodges.map((lodge) => (
            <LodgeCard
              key={lodge.id}
              lodge={lodge}
              onBookInspection={handleOpenInspection}
            />
          ))}
        </div>

        {/* Explore All Lodges Button */}
        <div className="pt-4 text-center">
          <Link href="/explore">
            <Button
              variant="outline"
              className="rounded-full px-6 py-2.5 text-xs font-semibold gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>Explore All Available Lodges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW IT WORKS (Simple 3 Steps) */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              How LodgeHere Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Three simple steps to secure your student accommodation with zero stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-2.5 shadow-2xs">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">01</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Search & Filter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter by your university, room type, and budget to find verified lodges within walking distance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-2.5 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">02</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inspect for Free</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pick a date and inspect the room, light, and water supply in person with the caretaker before committing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-2.5 shadow-2xs">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">03</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pay Directly & Move In</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Agree on terms directly with the verified landlord with zero middleman agent commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. MINIMALIST LANDLORD BANNER */}
      {/* ======================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5" />
              <span>For Lodge Owners & Managers</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              List your student property on LodgeHere
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Reach thousands of verified Nigerian university students looking for off-campus accommodation. Fill rooms faster with 0% commission.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/register">
              <Button className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 text-xs font-bold gap-2">
                <Plus className="h-4 w-4" />
                <span>List Your Property</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Inspection Modal */}
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
