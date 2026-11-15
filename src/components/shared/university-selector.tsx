'use client';

import React, { useState, useMemo } from 'react';
import { Search, GraduationCap, MapPin, Building } from 'lucide-react';
import { NIGERIAN_UNIVERSITIES, SeedUniversity } from '@/lib/data/nigerian-universities';
import { NIGERIAN_STATES } from '@/lib/data/nigerian-states';

interface UniversitySelectorProps {
  onSelect?: (university: SeedUniversity) => void;
  selectedSlug?: string;
  className?: string;
  showFilters?: boolean;
}

export function UniversitySelector({
  onSelect,
  selectedSlug,
  className = '',
  showFilters = true,
}: UniversitySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredUniversities = useMemo(() => {
    return NIGERIAN_UNIVERSITIES.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.state.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState = stateFilter ? uni.state === stateFilter : true;
      const matchesType = typeFilter ? uni.university_type === typeFilter : true;

      return matchesSearch && matchesState && matchesType;
    });
  }, [searchTerm, stateFilter, typeFilter]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search by university name, acronym (e.g. UNILAG, UI, UNIBEN), or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>

      {/* Filter Row */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All States ({NIGERIAN_STATES.length})</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s.code} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">All Types</option>
            <option value="federal">Federal Universities</option>
            <option value="state">State Universities</option>
            <option value="private">Private Universities</option>
          </select>

          {(searchTerm || stateFilter || typeFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStateFilter('');
                setTypeFilter('');
              }}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline self-center px-1"
            >
              Reset filters
            </button>
          )}

          <div className="ml-auto text-xs text-slate-500 dark:text-slate-400 self-center">
            Found {filteredUniversities.length} institutions
          </div>
        </div>
      )}

      {/* University List Grid / Results */}
      <div className="max-h-96 overflow-y-auto space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-900/60">
        {filteredUniversities.length === 0 ? (
          <div className="p-8 text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No universities found matching your filter
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try searching by state or acronym</p>
          </div>
        ) : (
          filteredUniversities.map((uni) => {
            const isSelected = selectedSlug === uni.slug;
            return (
              <div
                key={uni.slug}
                onClick={() => onSelect && onSelect(uni)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-100 shadow-xs dark:bg-slate-800 dark:border-white'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{uni.name}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 uppercase dark:bg-slate-700 dark:text-slate-200">
                      {uni.acronym}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${
                        uni.university_type === 'federal'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : uni.university_type === 'state'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {uni.university_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {uni.city}, {uni.state} State
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  {isSelected ? (
                    <span className="text-xs font-semibold text-white bg-slate-900 px-2.5 py-1 rounded-full dark:bg-white dark:text-slate-900">
                      Selected
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium">
                      Select
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
