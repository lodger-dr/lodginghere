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

  return (
    <div className={`space-y-8 ${isDashboard ? 'w-full' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'}`}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/80 border border-emerald-200 px-3 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Physical-Inspection Verified Inventory</span>
            </div>
            {selectedUni && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80 border border-blue-200 px-3 py-1 rounded-full">
                <Building2 className="h-3.5 w-3.5" />
                <span>{selectedUni.name} ({selectedUni.acronym})</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Student Lodges
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {selectedUni
              ? `Discover verified student accommodations near ${selectedUni.name} (${selectedUni.acronym}) with zero agent markup and upfront fee transparency.`
              : 'Discover verified student accommodation with zero agent markup and upfront fee transparency.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by lodge name, area, or road..."
            className="pl-9 pr-14 text-xs h-10 rounded-xl glass-card border-slate-200/80 dark:border-slate-800/80 shadow-2xs"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex absolute right-2.5 top-2.5 items-center rounded border border-slate-200/80 bg-slate-100/70 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:border-slate-800 dark:bg-slate-800/80">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Category Filter Pills (PrimeHouse aesthetic) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
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
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                : 'glass-card text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Filter Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Accommodation Type */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Lodge Type</label>
            <select
              value={accommodationType}
              onChange={(e) => setAccommodationType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">All Accommodation Types</option>
              <option value="self_contained">Self-Contained</option>
              <option value="single_room">Single Room</option>
              <option value="one_bedroom">1-Bedroom Mini Flat</option>
              <option value="two_bedroom">2-Bedroom Flat</option>
              <option value="shared_apartment">Shared Apartment</option>
              <option value="hostel">Private Hostel</option>
            </select>
          </div>

          {/* Max Budget */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Max Annual Budget (₦)</label>
            <input
              type="number"
              placeholder="e.g. 400000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="recommended">Recommended & Top Rated</option>
              <option value="price_asc">Annual Rent: Low to High</option>
              <option value="price_desc">Annual Rent: High to Low</option>
              <option value="availability">Most Available Vacancies</option>
            </select>
          </div>
        </div>

        {/* Amenities Checklist Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Must-Have Amenities
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verifiedOnly"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <label htmlFor="verifiedOnly" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Verified Landlords Only
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {AMENITIES_CATALOG.slice(0, 7).map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.key);
              return (
                <button
                  key={amenity.key}
                  type="button"
                  onClick={() => toggleAmenity(amenity.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                >
                  <span>{amenity.label}</span>
                  {isSelected && <X className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Tags & Reset */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Active Filters:</span>
              {accommodationType && (
                <Badge variant="outline" className="gap-1 bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                  Type: {accommodationType.replace(/_/g, ' ')}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setAccommodationType('')} />
                </Badge>
              )}
              {maxBudget && (
                <Badge variant="outline" className="gap-1 bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                  Under ₦{Number(maxBudget).toLocaleString()}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMaxBudget('')} />
                </Badge>
              )}
              {selectedAmenities.map((a) => (
                <Badge key={a} variant="outline" className="gap-1 bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                  {a.replace(/_/g, ' ')}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAmenity(a)} />
                </Badge>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs h-7 gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </Button>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {/* Count Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {filteredLodges.length} {filteredLodges.length === 1 ? 'Lodge' : 'Lodges'} Found
            </span>
            {selectedUni && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                around {selectedUni.name} ({selectedUni.acronym})
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
            Direct landlord listings • 0% agency fees
          </span>
        </div>

        {/* Lodge Grid */}
        {filteredLodges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLodges.map((lodge) => (
              <LodgeCard
                key={lodge.id}
                lodge={lodge}
                onBookInspection={(l) => setInspectLodge(l)}
              />
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
    </div>
  );
}
