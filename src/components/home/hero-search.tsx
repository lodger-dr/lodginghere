'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Home,
  Banknote,
  Search,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';

const PROPERTY_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Self-Contained', value: 'self_contained' },
  { label: 'Single Room', value: 'single_room' },
  { label: '1-Bed Flat', value: 'one_bedroom' },
  { label: 'Shared Flat', value: 'shared_apartment' },
  { label: 'Hostel Room', value: 'hostel' },
];

const BUDGET_OPTIONS = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₦250k', value: '250000' },
  { label: '₦250k - ₦400k', value: '400000' },
  { label: '₦400k - ₦600k', value: '600000' },
  { label: 'Above ₦600k', value: '1000000' },
];

const AVAILABILITY_OPTIONS = [
  { label: 'Available Now', value: 'available' },
  { label: 'All Lodges', value: '' },
  { label: 'Next Semester', value: 'upcoming' },
];

export function HeroSearch() {
  const router = useRouter();
  const [selectedUniSlug, setSelectedUniSlug] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('available');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedUniSlug) params.set('university', selectedUniSlug);
    if (selectedType) params.set('type', selectedType);
    if (selectedBudget) params.set('maxPrice', selectedBudget);
    if (selectedAvailability) params.set('status', selectedAvailability);

    const query = params.toString();
    router.push(query ? `/explore?${query}` : '/explore');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Floating Pill Search Bar (Matching Template Reference) */}
      <div className="rounded-3xl lg:rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-950/25 p-2 sm:p-3 transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0 lg:divide-x lg:divide-slate-200/80 dark:lg:divide-slate-800">
          {/* Segment 1: Location / Campus */}
          <div className="flex-1 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl lg:rounded-l-full lg:rounded-r-none transition-colors group cursor-pointer relative">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Campus / Location</span>
            </label>
            <div className="relative mt-0.5">
              <select
                value={selectedUniSlug}
                onChange={(e) => setSelectedUniSlug(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-5 appearance-none truncate"
                aria-label="Campus / Location"
              >
                <option value="" className="text-slate-700 dark:text-slate-300 dark:bg-slate-900">
                  Select University (All Campuses)
                </option>
                {NIGERIAN_UNIVERSITIES.slice(0, 30).map((uni) => (
                  <option
                    key={uni.slug}
                    value={uni.slug}
                    className="text-slate-900 dark:text-slate-100 dark:bg-slate-900"
                  >
                    {uni.acronym} — {uni.name} ({uni.city})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Segment 2: Accommodation Type */}
          <div className="flex-1 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl lg:rounded-none transition-colors group cursor-pointer relative">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <Home className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Property Type</span>
            </label>
            <div className="relative mt-0.5">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-5 appearance-none truncate"
                aria-label="Property Type"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                    className="text-slate-900 dark:text-slate-100 dark:bg-slate-900"
                  >
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Segment 3: Budget Range */}
          <div className="flex-1 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl lg:rounded-none transition-colors group cursor-pointer relative">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <Banknote className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Budget (₦/yr)</span>
            </label>
            <div className="relative mt-0.5">
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-5 appearance-none truncate"
                aria-label="Budget"
              >
                {BUDGET_OPTIONS.map((b) => (
                  <option
                    key={b.value}
                    value={b.value}
                    className="text-slate-900 dark:text-slate-100 dark:bg-slate-900"
                  >
                    {b.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Segment 4: Availability */}
          <div className="flex-1 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl lg:rounded-none transition-colors group cursor-pointer relative">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Availability</span>
            </label>
            <div className="relative mt-0.5">
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-5 appearance-none truncate"
                aria-label="Availability"
              >
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option
                    key={a.value}
                    value={a.value}
                    className="text-slate-900 dark:text-slate-100 dark:bg-slate-900"
                  >
                    {a.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Action: Dark Pill Search Button (matches template's right pill button) */}
          <div className="p-1 lg:pl-2">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-2xl lg:rounded-full bg-slate-950 hover:bg-black dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold px-8 py-3.5 text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
