'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, MapPin, Search, ExternalLink, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UniversitySelector } from '@/components/shared/university-selector';
import { SeedUniversity } from '@/lib/data/nigerian-universities';

export default function UniversitiesDirectoryPage() {
  const [selectedUni, setSelectedUni] = useState<SeedUniversity | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          <GraduationCap className="h-4 w-4" />
          <span>Accredited Institutions Directory</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nigerian Universities Directory</h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Discover verified student accommodation, campus neighbourhoods, and approved lodges across federal,
          state, and private universities in Nigeria.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <UniversitySelector
          onSelect={(uni) => setSelectedUni(uni)}
          selectedSlug={selectedUni?.slug}
          showFilters={true}
        />

        {selectedUni && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">{selectedUni.name}</h3>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {selectedUni.acronym}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Location: {selectedUni.city}, {selectedUni.state} State • Type: {selectedUni.university_type.toUpperCase()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedUni.website_url && (
                <a
                  href={selectedUni.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"
                >
                  <span>Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <Link href={`/explore?university=${selectedUni.slug}`}>
                <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                  <Building2 className="h-4 w-4" />
                  <span>View Lodges</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

