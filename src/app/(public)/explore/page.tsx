'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Building2, Search, Filter, ShieldCheck, MapPin, Eye, AlertCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialUniSlug = searchParams.get('university') || '';

  const [selectedUniSlug, setSelectedUniSlug] = useState(initialUniSlug);
  const [accommodationType, setAccommodationType] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  const selectedUni = NIGERIAN_UNIVERSITIES.find((u) => u.slug === selectedUniSlug);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Explore Student Lodges</h1>
        <p className="text-sm text-slate-500">
          Search approved accommodation listings around universities across Nigeria.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* University Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">University</label>
            <select
              value={selectedUniSlug}
              onChange={(e) => setSelectedUniSlug(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Universities</option>
              {NIGERIAN_UNIVERSITIES.map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name} ({u.acronym})
                </option>
              ))}
            </select>
          </div>

          {/* Accommodation Type */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Lodge Type</label>
            <select
              value={accommodationType}
              onChange={(e) => setAccommodationType(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="self_contained">Self-Contained</option>
              <option value="single_room">Single Room</option>
              <option value="one_bedroom">1-Bedroom Flat</option>
              <option value="two_bedroom">2-Bedroom Flat</option>
              <option value="shared_apartment">Shared Apartment</option>
              <option value="hostel">Private Hostel</option>
            </select>
          </div>

          {/* Max Budget */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Max Annual Budget (₦)</label>
            <input
              type="number"
              placeholder="e.g. 350000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="verifiedOnly"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="verifiedOnly" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Verified Listings Only
            </label>
          </div>
        </div>
      </div>

      {/* Listing Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">
            {selectedUni
              ? `Showing results for ${selectedUni.name} (${selectedUni.acronym})`
              : 'Showing all active approved listings'}
          </span>
          <span className="text-xs text-slate-400">Strict transparency: No unverified inventory</span>
        </div>

        {/* Truthful Empty State (per PRD Rule 5 & Rule 7) */}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              No verified accommodation currently listed around this campus
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never fabricate mock listings or fake inventory. As property owners submit and pass admin
              identity and authority checks, approved lodges will appear here immediately.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/register?role=landlord">
              <Button size="sm" variant="secondary" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span>Are you a landlord here? Add your lodge</span>
              </Button>
            </Link>
            <Link href="/universities">
              <Button size="sm" variant="outline">
                Browse other universities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading explore lodges...</div>}>
      <ExploreContent />
    </Suspense>
  );
}


