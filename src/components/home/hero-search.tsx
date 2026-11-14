'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { UniversitySelector } from '@/components/shared/university-selector';
import { SeedUniversity } from '@/lib/data/nigerian-universities';

const QUICK_FILTERS = [
  { label: 'All Lodges', value: '' },
  { label: 'Self-Con', value: 'self_contained' },
  { label: 'Single Room', value: 'single_room' },
  { label: '1-Bed Flat', value: 'one_bedroom' },
  { label: 'Private Hostel', value: 'hostel' },
];

export function HeroSearch() {
  const router = useRouter();
  const [selectedUni, setSelectedUni] = useState<SeedUniversity | null>(null);
  const [activeType, setActiveType] = useState<string>('');

  const handleUniversitySelect = (uni: SeedUniversity) => {
    setSelectedUni(uni);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedUni) params.set('university', selectedUni.slug);
    if (activeType) params.set('type', activeType);

    const query = params.toString();
    router.push(query ? `/explore?${query}` : '/explore');
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl shadow-slate-900/10 text-left text-slate-900 border border-slate-100 space-y-6">
      {/* Category Filter Pills (matching reference UI) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_FILTERS.map((f) => {
          const isActive = activeType === f.value;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => setActiveType(f.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* University Search Field */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          <span>Select University or Campus</span>
        </label>

        <UniversitySelector
          onSelect={handleUniversitySelect}
          selectedSlug={selectedUni?.slug}
          showFilters={true}
        />
      </div>

      {/* Bottom Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Direct landlord contact. 100% verified listings.</span>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black shadow-md active:scale-95"
        >
          <span>Start Searching</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
