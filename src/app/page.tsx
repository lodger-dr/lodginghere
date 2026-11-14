'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Search,
  ShieldCheck,
  CalendarCheck2,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  MapPin,
  Lock,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UniversitySelector } from '@/components/shared/university-selector';
import { SeedUniversity } from '@/lib/data/nigerian-universities';

export default function HomePage() {
  const router = useRouter();
  const [selectedUni, setSelectedUni] = useState<SeedUniversity | null>(null);

  const handleUniversitySelect = (uni: SeedUniversity) => {
    setSelectedUni(uni);
  };

  const handleSearch = () => {
    if (selectedUni) {
      router.push(`/explore?university=${selectedUni.slug}`);
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-900 pt-16 pb-20 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            <span>National Reach • Local Relevance • Verified Supply</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
              Find your next lodge. <br />
              <span className="text-emerald-400">Without the stress.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300">
              The trusted student accommodation discovery platform across Nigerian universities. Discover approved lodges,
              see transparent charges, schedule physical inspections, and lock in your room.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-2xl text-left text-slate-900">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  1. Select your university to start discovery
                </span>
                {selectedUni && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Selected: {selectedUni.acronym}
                  </span>
                )}
              </div>

              <UniversitySelector
                onSelect={handleUniversitySelect}
                selectedSlug={selectedUni?.slug}
                showFilters={true}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Real approved lodges only. Zero fabricated listings.</span>
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Search className="h-4 w-4" />
                  <span>Explore Lodges {selectedUni ? `at ${selectedUni.acronym}` : ''}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Verified Workflow */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How The Discovery & Booking Journey Works
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            A trusted coordination layer designed for Nigerian student realities. Every step enforces transparency and mutual confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200 hover:border-emerald-300 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                1
              </div>
              <h3 className="font-semibold text-base text-slate-900">Campus Discovery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your university and campus. Filter by budget, accommodation type (self-con, single room, flat), and verified amenities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:border-emerald-300 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                2
              </div>
              <h3 className="font-semibold text-base text-slate-900">Transparent Costs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Understand full upfront charges before travelling: annual rent, agency fee, legal fee, and service charges. No hidden surprises.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:border-emerald-300 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                3
              </div>
              <h3 className="font-semibold text-base text-slate-900">Physical Inspection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Schedule a physical inspection on a chosen date. You must physically inspect the lodge before booking can ever be unlocked.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:border-emerald-300 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                4
              </div>
              <h3 className="font-semibold text-base text-slate-900">Room Booking Record</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pick an exact available room code. Agree on rental terms with the landlord and mutually confirm the booking record.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust & Verification Pillars */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              <ShieldCheck className="h-4 w-4" />
              <span>Independent Verification Model</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Three Independent Layers of Accountability
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              We never lump trust into a vague badge. Each listing maintains three distinct, verifiable records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">1. Identity Verified</h3>
                <span className="text-xs font-semibold text-blue-600">Government ID & Provider Check</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The landlord or property manager has submitted verifiable identification reviewed by platform administrators.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">2. Property Authority Verified</h3>
                <span className="text-xs font-semibold text-purple-600">Proof of Ownership or Authority</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evidence proving legal ownership or documented, signed authority to rent the property on behalf of the owner.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarCheck2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">3. Availability Reconfirmed</h3>
                <span className="text-xs font-semibold text-emerald-600">Freshness & Room-Level Status</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Room-by-room status tracked with explicit reconfirmation timestamps. Stale listings are flagged and excluded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Students and Landlords */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Are you a Student?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Browse approved lodges near your institution, save your favourite properties, and request physical inspections
              with responsive landlords.
            </p>
            <div className="pt-2">
              <Link href="/register?role=student">
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <span>Sign Up as a Student</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Are you a Property Owner or Manager?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Reach thousands of prospective student tenants, manage your room availability, and easily coordinate physical
              inspections with verified students.
            </p>
            <div className="pt-2">
              <Link href="/register?role=landlord">
                <Button variant="secondary" className="gap-2">
                  <span>List Your Property</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
