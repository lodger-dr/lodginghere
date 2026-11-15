'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ExternalLink, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UniversitySelector } from '@/components/shared/university-selector';
import { SeedUniversity } from '@/lib/data/nigerian-universities';

interface UniversitiesViewProps {
  isDashboard?: boolean;
}

export function UniversitiesView({ isDashboard = false }: UniversitiesViewProps) {
  const [selectedUni, setSelectedUni] = useState<SeedUniversity | null>(null);

  const exploreHref = isDashboard
    ? `/student/explore?university=${selectedUni?.slug || ''}`
    : `/explore?university=${selectedUni?.slug || ''}`;

  return (
    <div className={`space-y-6 sm:space-y-8 ${isDashboard ? 'w-full' : 'mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10'}`}>
      <div className="space-y-2">
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Nigerian Universities Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Discover verified student accommodation, campus neighbourhoods, and approved lodges across federal,
          state, and private universities in Nigeria.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4 dark:border-slate-800 dark:bg-slate-900">
        <UniversitySelector
          onSelect={(uni) => setSelectedUni(uni)}
          selectedSlug={selectedUni?.slug}
          showFilters={true}
        />

        {selectedUni && (
          <div className="mt-4 sm:mt-6 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-850 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{selectedUni.name}</h3>
                <span className="text-xs font-semibold text-slate-700 bg-slate-200 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded">
                  {selectedUni.acronym}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Location: {selectedUni.city}, {selectedUni.state} State • Type: {selectedUni.university_type.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {selectedUni.website_url && (
                <a
                  href={selectedUni.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-md border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <span>Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <Link href={exploreHref}>
                <Button size="sm" className="gap-1.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
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
