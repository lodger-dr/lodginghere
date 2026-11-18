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
    latitude: 6.5182,
    longitude: 3.3855,
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
    latitude: 7.4475,
    longitude: 3.9025,
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
    latitude: 7.5142,
    longitude: 4.5245,
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
    latitude: 6.4025,
    longitude: 5.6178,
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
    latitude: 7.3055,
    longitude: 5.1388,
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
    latitude: 6.8682,
    longitude: 7.4085,
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
    <div className="px-4 pt-2 pb-24 space-y-6">
      {/* ======================================================== */}
      {/* 1. MOBILE APP HERO / FEED HEADER */}
      {/* ======================================================== */}
      <section className="space-y-4">
        {/* Top Campus Pill */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 px-3 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300">
            <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span>UNILAG, UI &amp; 30+ Campuses</span>
          </div>
          <Link
            href="/explore"
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            All Lodges →
          </Link>
        </div>

        {/* Clean Mobile App Greeting */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Find verified lodges <br />near your campus.
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Connect directly with verified landlords. Transparent pricing, ₦0 agent exploitation, and free physical room inspections.
          </p>
        </div>

        {/* Touch Search Widget */}
        <HeroSearch />

        {/* 4 Assurances in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-blue-100/70 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">Direct Landlord</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">0% agent markup</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
              <FileCheck2 className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">Clear Pricing</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Itemized rent & caution</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-purple-100/70 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 shrink-0">
              <CalendarCheck className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">Free Inspection</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Inspect before paying</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800">
            <div className="p-1.5 rounded-lg bg-amber-100/70 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 shrink-0">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">Near Campus</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Walk to school gates</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. AVAILABLE VERIFIED LODGES (Mobile Feed) */}
      {/* ======================================================== */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Available Lodges
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Verified off-campus rooms ready for physical inspection.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            See all ({allLodges.length})
          </Link>
        </div>

        {/* Campus Filter Pills (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
          {CAMPUS_TABS.map((tab) => {
            const isActive = activeCampusTab === tab.slug;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveCampusTab(tab.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Lodge Cards Single-Column Mobile Stream */}
        <div className="flex flex-col gap-4">
          {displayedLodges.map((lodge) => (
            <LodgeCard
              key={lodge.id}
              lodge={lodge}
              onBookInspection={handleOpenInspection}
            />
          ))}
        </div>

        {/* Explore All Lodges Button */}
        <div className="pt-2">
          <Link href="/explore">
            <Button
              variant="outline"
              className="w-full rounded-2xl py-3 text-xs font-semibold gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
            >
              <span>Explore All Available Lodges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW IT WORKS (Mobile Step Cards) */}
      {/* ======================================================== */}
      <section className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-wider">
            How LodgeHere Works
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Three simple steps to secure your student accommodation with zero stress.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md">01</span>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Search & Filter</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter by campus, room type, and budget to find verified lodges within walking distance.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">02</span>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Inspect for Free</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Pick a date and inspect the room, light, and water supply in person with the caretaker before paying.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3 shadow-2xs">
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 font-mono bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">03</span>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Pay Directly & Move In</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Agree on terms directly with the verified landlord with zero middleman agent commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. MOBILE LANDLORD BANNER */}
      {/* ======================================================== */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <Building2 className="h-3 w-3" />
            <span>For Lodge Owners & Managers</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            List your student property on LodgeHere
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Reach thousands of verified university students looking for accommodation. Fill rooms faster with 0% commission.
          </p>
        </div>

        <Link href="/register" className="block">
          <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white px-4 py-2.5 text-xs font-bold gap-2 min-h-[44px]">
            <Plus className="h-4 w-4" />
            <span>List Your Property</span>
          </Button>
        </Link>
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
