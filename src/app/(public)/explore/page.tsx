'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Droplets,
  Sun,
  Lock,
  Wifi,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { getLodges, AMENITIES_CATALOG } from '@/lib/data/lodges-data';
import { Lodge, AmenityKey, AccommodationType } from '@/types/database';
import { LodgeCard } from '@/components/lodges/lodge-card';
import { InspectionModal } from '@/components/lodges/inspection-modal';

function ExploreContent() {
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
    };
    load();

    const handleDataChange = () => load();
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  // Update selected university if query param changes
  useEffect(() => {
    if (initialUniSlug) {
      setSelectedUniSlug(initialUniSlug);
    }
  }, [initialUniSlug]);

  // Toggle individual amenity in filter
  const toggleAmenity = (key: AmenityKey) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedUniSlug('');
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

        // University filter
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
        // Recommended default: rating and review count
        return b.rating * b.review_count - a.rating * a.review_count;
      });
  }, [
    lodges,
    selectedUniSlug,
    accommodationType,
    verifiedOnly,
    maxBudget,
    selectedAmenities,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedUniSlug) ||
    Boolean(accommodationType) ||
    Boolean(maxBudget) ||
    selectedAmenities.length > 0 ||
    !verifiedOnly;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>100% Physical-Inspection Verified Inventory</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Explore Student Lodges
          </h1>
          <p className="text-sm text-slate-500">
            Discover verified student accommodation with zero agent markup and upfront fee transparency.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by lodge name, area, or road..."
            className="pl-9 text-xs h-10 rounded-xl"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* University Filter */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">University Campus</label>
            <select
              value={selectedUniSlug}
              onChange={(e) => setSelectedUniSlug(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Nigerian Universities</option>
              {NIGERIAN_UNIVERSITIES.map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name} ({u.acronym})
                </option>
              ))}
            </select>
          </div>

          {/* Accommodation Type */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Lodge Type</label>
            <select
              value={accommodationType}
              onChange={(e) => setAccommodationType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
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
            <label className="font-semibold text-slate-700">Max Annual Budget (₦)</label>
            <input
              type="number"
              placeholder="e.g. 400000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="recommended">Recommended & Top Rated</option>
              <option value="price_asc">Annual Rent: Low to High</option>
              <option value="price_desc">Annual Rent: High to Low</option>
              <option value="availability">Most Available Vacancies</option>
            </select>
          </div>
        </div>

        {/* Amenities Checklist Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Must-Have Amenities
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verifiedOnly"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="verifiedOnly" className="text-xs font-semibold text-slate-700 cursor-pointer">
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
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span className="font-semibold text-slate-500">Active Filters:</span>
              {selectedUni && (
                <Badge variant="outline" className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                  Uni: {selectedUni.acronym}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedUniSlug('')} />
                </Badge>
              )}
              {accommodationType && (
                <Badge variant="outline" className="gap-1 bg-slate-100 text-slate-800 border-slate-200">
                  Type: {accommodationType.replace(/_/g, ' ')}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setAccommodationType('')} />
                </Badge>
              )}
              {maxBudget && (
                <Badge variant="outline" className="gap-1 bg-slate-100 text-slate-800 border-slate-200">
                  Under ₦{Number(maxBudget).toLocaleString()}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMaxBudget('')} />
                </Badge>
              )}
              {selectedAmenities.map((a) => (
                <Badge key={a} variant="outline" className="gap-1 bg-slate-100 text-slate-800 border-slate-200">
                  {a.replace(/_/g, ' ')}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAmenity(a)} />
                </Badge>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs h-7 gap-1 text-slate-500 hover:text-slate-800"
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
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              {filteredLodges.length} {filteredLodges.length === 1 ? 'Lodge' : 'Lodges'} Found
            </span>
            {selectedUni && (
              <span className="text-xs text-slate-500">
                around {selectedUni.name} ({selectedUni.acronym})
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
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
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">
                No verified lodges matched your specific filters
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Try widening your price range, clearing selected amenities, or switching to all universities to view available student accommodations.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={resetFilters} className="gap-1.5">
                <RotateCcw className="h-4 w-4" />
                <span>Clear All Filters</span>
              </Button>
              <Link href="/landlord/properties">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>List a Lodge Around Here</span>
                </Button>
              </Link>
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

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading lodges...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
