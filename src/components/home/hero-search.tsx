'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Home,
  Banknote,
  Search,
  CheckCircle2,
  ChevronDown,
  Check,
} from 'lucide-react';
import { NIGERIAN_UNIVERSITIES, SeedUniversity } from '@/lib/data/nigerian-universities';

const PROPERTY_TYPES = [
  { label: 'All Property Types', value: '', desc: 'Browse all student housing options' },
  { label: 'Self-Contained', value: 'self_contained', desc: 'Private room with ensuite bathroom & kitchen' },
  { label: 'Single Room', value: 'single_room', desc: 'Private bedroom with shared amenities' },
  { label: '1-Bedroom Flat', value: 'one_bedroom', desc: 'Separate living room, bedroom & kitchen' },
  { label: 'Shared Apartment', value: 'shared_apartment', desc: 'Flatshare with student roommates' },
  { label: 'Private Hostel', value: 'hostel', desc: 'Serviced hostel inside or near campus' },
];

const BUDGET_OPTIONS = [
  { label: 'Any Budget', value: '', desc: 'Show all pricing tiers' },
  { label: 'Under ₦250,000 / yr', value: '250000', desc: 'Budget-friendly student rooms' },
  { label: '₦250,000 – ₦400,000 / yr', value: '400000', desc: 'Standard ensuite lodges' },
  { label: '₦400,000 – ₦600,000 / yr', value: '600000', desc: 'Premium self-con & executive units' },
  { label: 'Above ₦600,000 / yr', value: '1000000', desc: 'Luxury serviced student apartments' },
];

const AVAILABILITY_OPTIONS = [
  { label: 'Available Now', value: 'available', desc: 'Ready for immediate move-in' },
  { label: 'All Lodges', value: '', desc: 'All active verified properties' },
  { label: 'Next Semester', value: 'upcoming', desc: 'Pre-book for next academic term' },
];

export function HeroSearch() {
  const router = useRouter();

  const [selectedUni, setSelectedUni] = useState<SeedUniversity | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('available');

  // Popover toggle states
  const [activeDropdown, setActiveDropdown] = useState<'uni' | 'type' | 'budget' | 'avail' | null>(null);
  const [uniSearchQuery, setUniSearchQuery] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredUnis = NIGERIAN_UNIVERSITIES.filter((uni) => {
    const q = uniSearchQuery.toLowerCase();
    return (
      uni.name.toLowerCase().includes(q) ||
      uni.acronym.toLowerCase().includes(q) ||
      uni.city.toLowerCase().includes(q)
    );
  }).slice(0, 12);

  const handleSearch = () => {
    setActiveDropdown(null);
    const params = new URLSearchParams();
    if (selectedUni) params.set('university', selectedUni.slug);
    if (selectedType) params.set('type', selectedType);
    if (selectedBudget) params.set('maxPrice', selectedBudget);
    if (selectedAvailability) params.set('status', selectedAvailability);

    const query = params.toString();
    router.push(query ? `/explore?${query}` : '/explore');
  };

  const getActiveTypeLabel = () => {
    const found = PROPERTY_TYPES.find((t) => t.value === selectedType);
    return found ? found.label : 'All Types';
  };

  const getActiveBudgetLabel = () => {
    const found = BUDGET_OPTIONS.find((b) => b.value === selectedBudget);
    return found ? found.label : 'Any Budget';
  };

  const getActiveAvailabilityLabel = () => {
    const found = AVAILABILITY_OPTIONS.find((a) => a.value === selectedAvailability);
    return found ? found.label : 'Available Now';
  };

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto relative z-30">
      {/* Floating Capsule Bar (Elevated architectural luxury aesthetic) */}
      <div className="rounded-2xl sm:rounded-3xl lg:rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] p-2 sm:p-2.5 transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-1.5 lg:gap-0 lg:divide-x lg:divide-slate-200/80 dark:lg:divide-slate-800">

          {/* Segment 1: Campus / Location (Full width on mobile) */}
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'uni' ? null : 'uni')}
              className={`w-full text-left px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl lg:rounded-l-full lg:rounded-r-none transition-all duration-150 flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                activeDropdown === 'uni'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30'
                  : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="space-y-0.5 min-w-0 pr-2">
                <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Campus Location</span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {selectedUni ? `${selectedUni.acronym} — ${selectedUni.name}` : 'Select University / Campus'}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  activeDropdown === 'uni' ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>
          </div>

          {/* Segment 2 & 3: Property Type & Budget (2 columns on mobile, flat flex on desktop) */}
          <div className="grid grid-cols-2 lg:contents gap-1.5">
            {/* Segment 2: Accommodation Type */}
            <div className="lg:flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                className={`w-full text-left px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl lg:rounded-none transition-all duration-150 flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                  activeDropdown === 'type'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30'
                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="space-y-0.5 min-w-0 pr-1 sm:pr-2">
                  <span className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <Home className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Type</span>
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {getActiveTypeLabel()}
                  </p>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    activeDropdown === 'type' ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
            </div>

            {/* Segment 3: Budget Range */}
            <div className="lg:flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'budget' ? null : 'budget')}
                className={`w-full text-left px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl lg:rounded-none transition-all duration-150 flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                  activeDropdown === 'budget'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30'
                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="space-y-0.5 min-w-0 pr-1 sm:pr-2">
                  <span className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <Banknote className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Budget</span>
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate tabular-nums">
                    {getActiveBudgetLabel()}
                  </p>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    activeDropdown === 'budget' ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Segment 4: Availability / Timing */}
          <div className="hidden sm:block lg:flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'avail' ? null : 'avail')}
              className={`w-full text-left px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl lg:rounded-none transition-all duration-150 flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${
                activeDropdown === 'avail'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500/30'
                  : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="space-y-0.5 min-w-0 pr-2">
                <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Timing</span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {getActiveAvailabilityLabel()}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  activeDropdown === 'avail' ? 'rotate-180 text-emerald-600' : ''
                }`}
              />
            </button>
          </div>

          {/* Action: Search Pill Button */}
          <div className="p-0.5 sm:p-1 lg:pl-2 shrink-0">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full lg:w-auto flex items-center justify-center gap-2 rounded-xl lg:rounded-full bg-slate-950 hover:bg-black dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold px-6 py-3 sm:py-3.5 text-xs sm:text-sm transition-all duration-150 shadow-md hover:shadow-xl active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              <Search className="h-4 w-4" />
              <span>Search Accommodations</span>
            </button>
          </div>

        </div>
      </div>

      {/* Popovers rendered full-width on mobile and targeted on desktop */}
      {/* 1. University Dropdown Popover */}
      {activeDropdown === 'uni' && (
        <div className="absolute left-0 right-0 lg:right-auto lg:left-0 top-full mt-2 w-full lg:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search UNILAG, UI, OAU, UNIBEN..."
                value={uniSearchQuery}
                onChange={(e) => setUniSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto pt-2 space-y-1">
            <button
              type="button"
              onClick={() => {
                setSelectedUni(null);
                setActiveDropdown(null);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                !selectedUni
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>All Universities & Campuses</span>
              {!selectedUni && <Check className="h-3.5 w-3.5 text-emerald-600" />}
            </button>

            {filteredUnis.map((uni) => {
              const isSelected = selectedUni?.slug === uni.slug;
              return (
                <button
                  key={uni.slug}
                  type="button"
                  onClick={() => {
                    setSelectedUni(uni);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{uni.acronym}</span>
                      <span>•</span>
                      <span className="truncate">{uni.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      {uni.city}, {uni.state}
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Type Dropdown Popover */}
      {activeDropdown === 'type' && (
        <div className="absolute left-0 right-0 lg:right-auto lg:left-[24%] top-full mt-2 w-full lg:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {PROPERTY_TYPES.map((type) => {
              const isSelected = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{type.label}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{type.desc}</div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Budget Dropdown Popover */}
      {activeDropdown === 'budget' && (
        <div className="absolute left-0 right-0 lg:right-auto lg:left-[48%] top-full mt-2 w-full lg:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {BUDGET_OPTIONS.map((budget) => {
              const isSelected = selectedBudget === budget.value;
              return (
                <button
                  key={budget.value}
                  type="button"
                  onClick={() => {
                    setSelectedBudget(budget.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white tabular-nums">{budget.label}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{budget.desc}</div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Availability Dropdown Popover */}
      {activeDropdown === 'avail' && (
        <div className="absolute left-0 right-0 lg:left-auto lg:right-28 top-full mt-2 w-full lg:w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {AVAILABILITY_OPTIONS.map((avail) => {
              const isSelected = selectedAvailability === avail.value;
              return (
                <button
                  key={avail.value}
                  type="button"
                  onClick={() => {
                    setSelectedAvailability(avail.value);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{avail.label}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{avail.desc}</div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
