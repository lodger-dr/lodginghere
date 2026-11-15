'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  BedDouble,
  Calendar,
  Search,
  ChevronDown,
  Check,
  ArrowRight,
  ArrowUpRight,
  Wallet,
} from 'lucide-react';
import { NIGERIAN_UNIVERSITIES, SeedUniversity } from '@/lib/data/nigerian-universities';

const PROPERTY_TYPES = [
  { label: 'All Property Types', value: '', desc: 'Browse all student housing options' },
  { label: 'Self-Contained', value: 'self_contained', desc: 'Private ensuite bathroom & kitchen' },
  { label: 'Single Room', value: 'single_room', desc: 'Private room with shared facilities' },
  { label: '1-Bedroom Flat', value: 'one_bedroom', desc: 'Separate living room, bedroom & kitchen' },
  { label: 'Shared Flat', value: 'shared_apartment', desc: 'Flatshare with student roommates' },
];

const BUDGET_OPTIONS = [
  { label: 'Any Budget', value: '', desc: 'Show all pricing tiers' },
  { label: 'Under ₦250,000 / yr', value: '250000', desc: 'Budget student rooms' },
  { label: '₦250,000 – ₦400,000 / yr', value: '400000', desc: 'Standard ensuite lodges' },
  { label: '₦400,000 – ₦600,000 / yr', value: '600000', desc: 'Executive self-contained' },
  { label: 'Above ₦600,000 / yr', value: '1000000', desc: 'Luxury serviced apartments' },
];

export function HeroSearch() {
  const router = useRouter();

  const [selectedUni, setSelectedUni] = useState<SeedUniversity | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');

  // Dropdown toggle state
  const [activeDropdown, setActiveDropdown] = useState<'uni' | 'type' | 'budget' | null>(null);
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
  }).slice(0, 10);

  const handleSearch = () => {
    setActiveDropdown(null);
    const params = new URLSearchParams();
    if (selectedUni) params.set('university', selectedUni.slug);
    if (selectedType) params.set('type', selectedType);
    if (selectedBudget) params.set('maxPrice', selectedBudget);

    const query = params.toString();
    router.push(query ? `/explore?${query}` : '/explore');
  };

  const getActiveTypeLabel = () => {
    const found = PROPERTY_TYPES.find((t) => t.value === selectedType);
    return found ? found.label : '1 Student, Any Room Type';
  };

  const getActiveBudgetLabel = () => {
    const found = BUDGET_OPTIONS.find((b) => b.value === selectedBudget);
    return found ? found.label : 'Select Budget / Move-in';
  };

  return (
    <div ref={containerRef} className="w-full relative z-30">
      {/* Sleek Frosted Glass Search Card matching reference template */}
      <div className="backdrop-blur-2xl bg-black/60 dark:bg-slate-950/75 border border-white/20 dark:border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3.5 text-white transition-all duration-300 ring-1 ring-white/10">
        {/* Card Header with Arrow Shortcut */}
        <div className="flex items-start justify-between gap-3 pb-1">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              Comfort, Verified <br />
              <span className="font-normal text-white/75 text-sm sm:text-base">for Students</span>
            </h3>
          </div>
          <Link
            href="/explore"
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-xs cursor-pointer"
            title="Browse all verified campus accommodations"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Input 1: Campus / Location Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'uni' ? null : 'uni')}
            className={`w-full text-left px-3.5 py-3 rounded-2xl border transition-all duration-150 flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${activeDropdown === 'uni'
                ? 'bg-white/15 border-white/40 ring-1 ring-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
                  Campus Location
                </span>
                <p className="text-xs font-semibold text-white truncate">
                  {selectedUni ? `${selectedUni.acronym} — ${selectedUni.name}` : 'Find Campus or Area'}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white/50 shrink-0 transition-transform duration-200 ${activeDropdown === 'uni' ? 'rotate-180 text-white' : ''
                }`}
            />
          </button>

          {/* University Popover */}
          {activeDropdown === 'uni' && (
            <div className="absolute left-0 right-0 top-full mt-2 w-full rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-white/20 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5">
              <div className="p-1 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search UNILAG, UI, OAU, UNIBEN..."
                    value={uniSearchQuery}
                    onChange={(e) => setUniSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-white/15 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUni(null);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${!selectedUni
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-white/80 hover:bg-white/10'
                    }`}
                >
                  <span>All Campuses & Universities</span>
                  {!selectedUni && <Check className="h-3.5 w-3.5 text-emerald-400" />}
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                          : 'text-white/80 hover:bg-white/10'
                        }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-white flex items-center gap-1.5 truncate">
                          <span className="text-emerald-400 font-bold">{uni.acronym}</span>
                          <span>•</span>
                          <span className="truncate">{uni.name}</span>
                        </div>
                        <div className="text-[10px] text-white/50">
                          {uni.city}, {uni.state}
                        </div>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input 2: Accommodation / Room Type Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
            className={`w-full text-left px-3.5 py-3 rounded-2xl border transition-all duration-150 flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${activeDropdown === 'type'
                ? 'bg-white/15 border-white/40 ring-1 ring-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <BedDouble className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
                  Accommodation Space
                </span>
                <p className="text-xs font-semibold text-white truncate">
                  {getActiveTypeLabel()}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white/50 shrink-0 transition-transform duration-200 ${activeDropdown === 'type' ? 'rotate-180 text-white' : ''
                }`}
            />
          </button>

          {/* Type Popover */}
          {activeDropdown === 'type' && (
            <div className="absolute left-0 right-0 top-full mt-2 w-full rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-white/20 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'text-white/80 hover:bg-white/10'
                      }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{type.label}</div>
                      <div className="text-[10px] text-white/50">{type.desc}</div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Input 3: Budget Range & Move-in Timing */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveDropdown(activeDropdown === 'budget' ? null : 'budget')}
            className={`w-full text-left px-3.5 py-3 rounded-2xl border transition-all duration-150 flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${activeDropdown === 'budget'
                ? 'bg-white/15 border-white/40 ring-1 ring-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <Calendar className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
                  Move-In & Budget
                </span>
                <p className="text-xs font-semibold text-white truncate tabular-nums">
                  {getActiveBudgetLabel()}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white/50 shrink-0 transition-transform duration-200 ${activeDropdown === 'budget' ? 'rotate-180 text-white' : ''
                }`}
            />
          </button>

          {/* Budget Popover */}
          {activeDropdown === 'budget' && (
            <div className="absolute left-0 right-0 top-full mt-2 w-full rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-white/20 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'text-white/80 hover:bg-white/10'
                      }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{budget.label}</div>
                      <div className="text-[10px] text-white/50">{budget.desc}</div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA: Search Button matching template's white pill */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-extrabold py-3.5 px-6 text-xs sm:text-sm shadow-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Search Lodges</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
