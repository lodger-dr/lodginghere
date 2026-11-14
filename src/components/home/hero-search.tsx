'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UniversitySelector } from '@/components/shared/university-selector';
import { SeedUniversity } from '@/lib/data/nigerian-universities';

export function HeroSearch() {
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
  );
}

