'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Home, Wallet, Search } from 'lucide-react';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';

const ROOM_TYPES = [
  { label: 'All Room Types', value: '' },
  { label: 'Self-Contained', value: 'self_contained' },
  { label: 'Single Room', value: 'single_room' },
  { label: '1-Bedroom Flat', value: 'one_bedroom' },
  { label: 'Shared Apartment', value: 'shared_apartment' },
];

const BUDGET_RANGES = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₦250k / yr', value: '250000' },
  { label: '₦250k – ₦400k / yr', value: '400000' },
  { label: '₦400k – ₦600k / yr', value: '600000' },
  { label: 'Above ₦600k / yr', value: '1000000' },
];

const POPULAR_CAMPUSES = [
  { name: 'UNILAG', slug: 'university-of-lagos' },
  { name: 'UI Ibadan', slug: 'university-of-ibadan' },
  { name: 'OAU Ife', slug: 'obafemi-awolowo-university' },
  { name: 'UNIBEN', slug: 'university-of-benin' },
  { name: 'FUTA', slug: 'federal-university-of-technology-akure' },
  { name: 'UNN Nsukka', slug: 'university-of-nigeria' },
];

export function HeroSearch() {
  const router = useRouter();
  const [universitySlug, setUniversitySlug] = useState('');
  const [roomType, setRoomType] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (universitySlug) params.set('university', universitySlug);
    if (roomType) params.set('type', roomType);
    if (budget) params.set('maxPrice', budget);

    const query = params.toString();
    router.push(query ? `/explore?${query}` : '/explore');
  };

  const handleQuickCampus = (slug: string) => {
    setUniversitySlug(slug);
    router.push(`/explore?university=${slug}`);
  };

  return (
    <div className="w-full space-y-3">
      {/* Mobile App Search Card */}
      <form
        onSubmit={handleSearch}
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3 shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex flex-col gap-2.5 text-left"
      >
        {/* University Selector */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-[#FFF0E9]/50 border border-[#E8E8E5] focus-within:border-[#F45B2A] transition-colors">
          <MapPin className="h-4 w-4 text-[#F45B2A] shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-uni" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Campus Institution
            </label>
            <select
              id="hero-uni"
              value={universitySlug}
              onChange={(e) => setUniversitySlug(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-[#24272B] focus:outline-none cursor-pointer truncate"
            >
              <option value="" className="text-slate-800">
                All Nigerian Universities (328 Institutions)
              </option>
              {NIGERIAN_UNIVERSITIES.map((uni) => (
                <option key={uni.slug} value={uni.slug} className="text-slate-800">
                  {uni.name} ({uni.acronym})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Room Type & Budget Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Room Type */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E8E8E5] focus-within:border-[#F45B2A] transition-colors">
            <Home className="h-4 w-4 text-[#F45B2A] shrink-0" />
            <div className="flex-1 min-w-0">
              <label htmlFor="hero-type" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Type
              </label>
              <select
                id="hero-type"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#24272B] focus:outline-none cursor-pointer truncate"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="text-slate-800">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E8E8E5] focus-within:border-[#F45B2A] transition-colors">
            <Wallet className="h-4 w-4 text-[#F45B2A] shrink-0" />
            <div className="flex-1 min-w-0">
              <label htmlFor="hero-budget" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Max Budget
              </label>
              <select
                id="hero-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#24272B] focus:outline-none cursor-pointer truncate"
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b.value} value={b.value} className="text-slate-800">
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="w-full rounded-2xl bg-[#F45B2A] hover:bg-[#DE4C1D] text-white font-black px-4 py-3 text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#F45B2A]/20 cursor-pointer min-h-[44px]"
        >
          <Search className="h-4 w-4" />
          <span>Find Lodges on Interactive Map</span>
        </button>
      </form>

      {/* Quick Campus Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">Campuses:</span>
        {POPULAR_CAMPUSES.map((campus) => (
          <button
            key={campus.slug}
            type="button"
            onClick={() => handleQuickCampus(campus.slug)}
            className="rounded-full border border-[#E8E8E5] bg-white hover:border-[#F45B2A] hover:bg-[#FFF0E9] px-3 py-1 text-[11px] font-bold text-[#24272B] hover:text-[#F45B2A] transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            {campus.name}
          </button>
        ))}
      </div>
    </div>
  );
}
