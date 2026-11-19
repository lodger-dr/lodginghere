'use client';

import React, { useEffect } from 'react';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';
import { AmenityKey } from '@/types/database';
import { AMENITIES_CATALOG } from '@/lib/data/lodges-data';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { Button } from '@/components/ui/button';

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUniSlug: string;
  onSelectUni: (slug: string) => void;
  accommodationType: string;
  onChangeAccommodationType: (type: string) => void;
  maxBudget: string;
  onChangeMaxBudget: (budget: string) => void;
  selectedAmenities: AmenityKey[];
  onToggleAmenity: (amenity: AmenityKey) => void;
  verifiedOnly: boolean;
  onToggleVerifiedOnly: (verified: boolean) => void;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'availability';
  onChangeSortBy: (sort: 'recommended' | 'price_asc' | 'price_desc' | 'availability') => void;
  totalResultsCount: number;
  onReset: () => void;
  activeFilterCount: number;
}

const ACCOMMODATION_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Self-Con', value: 'self_contained' },
  { label: 'Single Room', value: 'single_room' },
  { label: '1-Bed Flat', value: 'one_bedroom' },
  { label: '2-Bed Flat', value: 'two_bedroom' },
  { label: 'Shared Flat', value: 'shared_apartment' },
  { label: 'Hostel', value: 'hostel' },
];

const BUDGET_PRESETS = [
  { label: 'Any', value: '' },
  { label: '< ₦250k', value: '250000' },
  { label: '< ₦400k', value: '400000' },
  { label: '< ₦600k', value: '600000' },
  { label: '< ₦1M', value: '1000000' },
];

export function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedUniSlug,
  onSelectUni,
  accommodationType,
  onChangeAccommodationType,
  maxBudget,
  onChangeMaxBudget,
  selectedAmenities,
  onToggleAmenity,
  verifiedOnly,
  onToggleVerifiedOnly,
  sortBy,
  onChangeSortBy,
  totalResultsCount,
  onReset,
  activeFilterCount,
}: MobileFilterDrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter accommodation listings"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[88vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drag Handle Indicator */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Filter Lodges
            </h2>
            {activeFilterCount > 0 && (
              <span className="flex h-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/70 px-2 text-[10px] font-black text-blue-700 dark:text-blue-300">
                {activeFilterCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Filter Form Controls */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 text-xs">
          {/* 1. Target University */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Campus / University</span>
            </label>
            <select
              value={selectedUniSlug}
              onChange={(e) => onSelectUni(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="">All Nigerian Campuses</option>
              {NIGERIAN_UNIVERSITIES.map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name} ({u.acronym})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Accommodation Type Pills */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white block">
              Accommodation Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ACCOMMODATION_TYPES.map((type) => {
                const isSelected = accommodationType === type.value;
                return (
                  <button
                    key={type.label}
                    type="button"
                    onClick={() => onChangeAccommodationType(type.value)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all border ${isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300'
                      }`}
                  >
                    <span>{type.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Max Annual Budget */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white">
                Max Annual Rent
              </label>
              {maxBudget && (
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  Under ₦{Number(maxBudget).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {BUDGET_PRESETS.map((preset) => {
                const isActive = maxBudget === preset.value;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onChangeMaxBudget(preset.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border ${isActive
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                      : 'border-slate-200 bg-slate-100/80 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <input
              type="number"
              placeholder="Or enter custom budget (e.g. 350000)"
              value={maxBudget}
              onChange={(e) => onChangeMaxBudget(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* 4. Verified Landlords Only Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Verified Landlords Only
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct verified property managers & surveyed buildings
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              id="mobileVerifiedOnly"
              checked={verifiedOnly}
              onChange={(e) => onToggleVerifiedOnly(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* 5. Must-Have Amenities */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white block">
              Must-Have Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_CATALOG.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.key);
                return (
                  <button
                    key={amenity.key}
                    type="button"
                    onClick={() => onToggleAmenity(amenity.key)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${isSelected
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                  >
                    <span>{amenity.label}</span>
                    {isSelected && <Check className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Sort By */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 dark:text-white block">
              Sort Results By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="recommended">Recommended & Top Rated</option>
              <option value="price_asc">Annual Rent: Low to High</option>
              <option value="price_desc">Annual Rent: High to Low</option>
              <option value="availability">Most Available Vacancies</option>
            </select>
          </div>
        </div>

        {/* Drawer Sticky Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 pb-safe flex items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All</span>
          </Button>

          <Button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold text-xs h-11 shadow-sm"
          >
            <span>Show {totalResultsCount} {totalResultsCount === 1 ? 'Lodge' : 'Lodges'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
