'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  Search,
  ShieldCheck,
  X,
  RotateCcw,
  SlidersHorizontal,
  Map,
  LayoutGrid,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { getLodges, fetchLodges, AMENITIES_CATALOG } from '@/lib/data/lodges-data';
import { Lodge, AmenityKey } from '@/types/database';
import { LodgeCard } from '@/components/lodges/lodge-card';
import { InspectionModal } from '@/components/lodges/inspection-modal';
import { MobileFilterDrawer } from '@/components/lodges/mobile-filter-drawer';
import { LodgeMap } from '@/components/maps/lodge-map';

interface ExploreViewProps {
  isDashboard?: boolean;
}

export function ExploreView({ isDashboard = false }: ExploreViewProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialUniSlug = searchParams.get('university') || '';

  // Filter States
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniSlug, setSelectedUniSlug] = useState(initialUniSlug);
  const [accommodationType, setAccommodationType] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityKey[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'availability'>('recommended');

  // Inspection modal state
  const [inspectLodge, setInspectLodge] = useState<Lodge | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [highlightedLodgeId, setHighlightedLodgeId] = useState<string | undefined>();

  // Load and subscribe to live lodges data
  useEffect(() => {
    const load = () => {
      setLodges(getLodges());
      fetchLodges().then((data) => setLodges(data));
    };
    load();

    const handleDataChange = () => {
      setLodges(getLodges());
    };
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  // Set university based on URL param, onboarding selection, or user metadata
  useEffect(() => {
    if (initialUniSlug) {
      setSelectedUniSlug(initialUniSlug);
      return;
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lodgehere_user_university');
      if (stored) {
        setSelectedUniSlug(stored);
        return;
      }
    }

    const userUni = user?.user_metadata?.university_slug;
    if (userUni) {
      setSelectedUniSlug(userUni);
      return;
    }

    setSelectedUniSlug((prev) => prev || 'university-of-lagos');
  }, [initialUniSlug, user]);

  // Toggle individual amenity in filter
  const toggleAmenity = (key: AmenityKey) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Reset all filters (preserves the student's selected university)
  const resetFilters = () => {
    setSearchQuery('');
    setAccommodationType('');
    setMaxBudget('');
    setSelectedAmenities([]);
    setVerifiedOnly(false);
    setSortBy('recommended');
  };

  const selectedUni = NIGERIAN_UNIVERSITIES.find((u) => u.slug === selectedUniSlug);

  // Filter & Sort Logic
  const filteredLodges = useMemo(() => {
    return lodges
      .filter((lodge) => {
        // Must be approved listing for public explore
        if (lodge.status !== 'approved') return false;

        // University filter (works with the school the user picked during onboarding)
        if (selectedUniSlug && lodge.university_slug !== selectedUniSlug) {
          return false;
        }

        // Accommodation type filter
        if (accommodationType && lodge.accommodation_type !== accommodationType) {
          return false;
        }

        // Verified landlord filter
        if (verifiedOnly && !lodge.landlord_verified) {
          return false;
        }

        // Max budget filter
        if (maxBudget) {
          const budgetNum = Number(maxBudget);
          if (!isNaN(budgetNum) && budgetNum > 0 && lodge.pricing.min_price > budgetNum) {
            return false;
          }
        }

        // Amenities filter (must have all selected amenities)
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) =>
            lodge.amenities.includes(amenity)
          );
          if (!hasAll) return false;
        }

        // Search Query filter (matches title, address, neighbourhood, or university)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = lodge.title.toLowerCase().includes(q);
          const matchAddress = lodge.address.toLowerCase().includes(q);
          const matchNeighbourhood = lodge.neighbourhood.toLowerCase().includes(q);
          const matchUni = lodge.university_name.toLowerCase().includes(q);
          if (!matchTitle && !matchAddress && !matchNeighbourhood && !matchUni) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.pricing.min_price - b.pricing.min_price;
        }
        if (sortBy === 'price_desc') {
          return b.pricing.min_price - a.pricing.min_price;
        }
        if (sortBy === 'availability') {
          return b.available_rooms - a.available_rooms;
        }
        // Default: recommended (verified first, then vacancy)
        if (a.landlord_verified !== b.landlord_verified) {
          return a.landlord_verified ? -1 : 1;
        }
        return b.available_rooms - a.available_rooms;
      });
  }, [
    lodges,
    searchQuery,
    selectedUniSlug,
    accommodationType,
    maxBudget,
    selectedAmenities,
    verifiedOnly,
    sortBy,
  ]);

  const hasActiveFilters = Boolean(
    accommodationType ||
    maxBudget ||
    selectedAmenities.length > 0 ||
    searchQuery.trim()
  );

  const activeFilterCount =
    (accommodationType ? 1 : 0) +
    (maxBudget ? 1 : 0) +
    selectedAmenities.length +
    (verifiedOnly ? 1 : 0);

  return (
    <div className={`space-y-4 ${isDashboard ? 'w-full' : 'w-full px-4 pt-2 pb-24'}`}>
      {/* Page Header */}
      <div className="flex flex-col gap-2.5">
        <div className="space-y-1">
          {selectedUni && (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80 border border-blue-200 px-3 py-0.5 rounded-full mb-0.5">
              <Building2 className="h-3 w-3" />
              <span>{selectedUni.name} ({selectedUni.acronym})</span>
            </div>
          )}
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Explore Campus Lodges
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedUni
              ? `Verified accommodations near ${selectedUni.acronym} with zero agent fees.`
              : 'Verified accommodations with 0% agent markup & fee transparency.'}
          </p>
        </div>

        {/* Search Input & Filter Toggle Bar */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lodge name, area..."
              className="pl-9 pr-8 text-xs h-10 rounded-xl glass-card border-slate-200/80 dark:border-slate-800/80 shadow-2xs"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 h-10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs shrink-0 cursor-pointer active:scale-95 transition-all"
            aria-label="Open filter drawer"
          >
            <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-black text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {[
          { label: 'All Lodges', value: '' },
          { label: 'Self-Con', value: 'self_contained' },
          { label: 'Single Room', value: 'single_room' },
          { label: '1-Bedroom Flat', value: 'one_bedroom' },
          { label: '2-Bedroom Flat', value: 'two_bedroom' },
          { label: 'Private Hostel', value: 'hostel' },
        ].map((item) => {
          const isActive = accommodationType === item.value;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setAccommodationType(item.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${isActive
                ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Active Filter Tags & Reset */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {accommodationType && (
              <Badge variant="outline" className="gap-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] py-0.5">
                {accommodationType.replace(/_/g, ' ')}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setAccommodationType('')} />
              </Badge>
            )}
            {maxBudget && (
              <Badge variant="outline" className="gap-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] py-0.5">
                ≤ ₦{Number(maxBudget).toLocaleString()}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setMaxBudget('')} />
              </Badge>
            )}
            {selectedAmenities.map((a) => (
              <Badge key={a} variant="outline" className="gap-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] py-0.5">
                {a.replace(/_/g, ' ')}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAmenity(a)} />
              </Badge>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-[11px] h-6 px-2 gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-3">
        {/* Count Bar with View Mode Toggle */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
              {filteredLodges.length} {filteredLodges.length === 1 ? 'Lodge' : 'Lodges'} Found
            </span>
            {selectedUni && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                around {selectedUni.acronym}
              </span>
            )}
          </div>

          {/* View Toggle */}
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${viewMode === 'grid'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              aria-label="Feed View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${viewMode === 'map'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              aria-label="Map View"
            >
              <Map className="h-3.5 w-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Interactive Map View */}
        {viewMode === 'map' && filteredLodges.length > 0 && (
          <div className="space-y-2">
            <LodgeMap
              lodges={filteredLodges}
              universitySlug={selectedUniSlug}
              selectedLodgeId={highlightedLodgeId}
              onSelectLodge={(lodge) => setHighlightedLodgeId(lodge.id)}
              height="360px"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
              Tap any pin for details, or click directions for walking route.
            </p>
          </div>
        )}

        {/* Lodge Feed Stream */}
        {filteredLodges.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredLodges.map((lodge) => (
              <div
                key={lodge.id}
                className={highlightedLodgeId === lodge.id ? 'ring-2 ring-blue-500 rounded-3xl' : ''}
              >
                <LodgeCard
                  lodge={lodge}
                  onBookInspection={(l) => setInspectLodge(l)}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No verified lodges matched your specific filters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Try widening your price range or clearing selected amenities to view available student accommodations.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={resetFilters} className="gap-1.5">
                <RotateCcw className="h-4 w-4" />
                <span>Clear All Filters</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Inspection Modal */}
      <InspectionModal
        lodge={inspectLodge}
        isOpen={Boolean(inspectLodge)}
        onClose={() => setInspectLodge(null)}
      />

      {/* Mobile Filter Bottom Sheet Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedUniSlug={selectedUniSlug}
        onSelectUni={setSelectedUniSlug}
        accommodationType={accommodationType}
        onChangeAccommodationType={setAccommodationType}
        maxBudget={maxBudget}
        onChangeMaxBudget={setMaxBudget}
        selectedAmenities={selectedAmenities}
        onToggleAmenity={toggleAmenity}
        verifiedOnly={verifiedOnly}
        onToggleVerifiedOnly={setVerifiedOnly}
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        totalResultsCount={filteredLodges.length}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
