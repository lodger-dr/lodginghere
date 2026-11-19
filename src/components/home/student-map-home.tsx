'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Heart,
  ExternalLink,
  ChevronRight,
  X,
  Crosshair,
  Building2,
  Check,
  BedDouble,
  Navigation,
  Sparkles,
  ArrowRight,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { Lodge, AmenityKey } from '@/types/database';
import {
  fetchLodges,
  getAllAvailableLodges,
  getLodges,
  AMENITIES_CATALOG,
} from '@/lib/data/lodges-data';
import {
  getUniversityCoordinates,
  getLodgeCoordinates,
  calculateDistanceMiles,
  isWithinRadius,
  UNIVERSITY_COORDINATES,
  Coordinates,
} from '@/lib/data/maps-data';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { formatNaira } from '@/lib/utils';
import { LodgeMap } from '@/components/maps/lodge-map';
import { InspectionModal } from '@/components/lodges/inspection-modal';

interface StudentMapHomeProps {
  initialUniversitySlug?: string;
}

export function StudentMapHome({ initialUniversitySlug }: StudentMapHomeProps) {
  const router = useRouter();

  // All accommodation inventory
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [savedLodgeIds, setSavedLodgeIds] = useState<string[]>([]);

  // Primary Anchor & Search Settings
  const [selectedUniSlug, setSelectedUniSlug] = useState<string>(
    initialUniversitySlug || 'abia-state-university'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusMiles, setRadiusMiles] = useState<5 | 10>(5);
  const [isRadiusDropdownOpen, setIsRadiusDropdownOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');

  // Location mode: 'school' (default) vs 'gps'
  const [locationMode, setLocationMode] = useState<'school' | 'gps'>('school');
  const [userGpsCoords, setUserGpsCoords] = useState<Coordinates | null>(null);
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);

  // Four connected map states:
  // State 1: Default preview peek
  // State 2: Selected property preview
  // State 3: Expanded bottom sheet (See all)
  // State 4: Wider search (radius 10 mi)
  const [selectedLodge, setSelectedLodge] = useState<Lodge | null>(null);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  // Filter & Inspection modal states
  const [accommodationTypeFilter, setAccommodationTypeFilter] = useState<string>('all');
  const [inspectionLodge, setInspectionLodge] = useState<Lodge | null>(null);

  // 1. Initial Load of Lodges & Saved Favorites from localStorage
  useEffect(() => {
    // Check if user has already set a university in onboarding
    if (typeof window !== 'undefined') {
      const storedUni = localStorage.getItem('lodgehere_user_university');
      if (storedUni) {
        setSelectedUniSlug(storedUni);
      }
      try {
        const storedSaved = localStorage.getItem('lodgehere_saved_lodges');
        if (storedSaved) setSavedLodgeIds(JSON.parse(storedSaved));
      } catch {}
    }

    const loadData = () => {
      const local = getAllAvailableLodges();
      setLodges(local);
      fetchLodges().then((data) => {
        if (data && data.length > 0) setLodges(data);
      });
    };
    loadData();

    const handleDataChange = () => setLodges(getAllAvailableLodges());
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  // Sync saved favorites to localStorage
  const toggleSaveLodge = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSavedLodgeIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('lodgehere_saved_lodges', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  // Determine current map center
  const uniCenter = useMemo(
    () => getUniversityCoordinates(selectedUniSlug),
    [selectedUniSlug]
  );

  const activeCenter: Coordinates =
    locationMode === 'gps' && userGpsCoords ? userGpsCoords : uniCenter;

  const currentSchoolObj = useMemo(() => {
    return (
      NIGERIAN_UNIVERSITIES.find((u) => u.slug === selectedUniSlug) || {
        name: uniCenter.campusName,
        acronym: 'Campus',
        slug: selectedUniSlug,
      }
    );
  }, [selectedUniSlug, uniCenter]);

  // Handle GPS location toggle
  const handleToggleGps = () => {
    if (locationMode === 'gps') {
      setLocationMode('school');
      setGpsNotification(`Centred back on ${currentSchoolObj.name}`);
      setTimeout(() => setGpsNotification(null), 3000);
      return;
    }

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsNotification('GPS is not supported on this device');
      setTimeout(() => setGpsNotification(null), 3000);
      return;
    }

    setGpsNotification('Locating your position...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserGpsCoords(coords);
        setLocationMode('gps');
        setGpsNotification('Centred on your current location');
        setTimeout(() => setGpsNotification(null), 3500);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsNotification('Location permission denied or unavailable');
        setTimeout(() => setGpsNotification(null), 3000);
      },
      { timeout: 7000 }
    );
  };

  // Filter Lodges based on:
  // 1. Geographical Radius (5 mi or 10 mi from anchor)
  // 2. Search query (lodge name, area, address, school)
  // 3. Accommodation type
  const nearbyLodges = useMemo(() => {
    return lodges
      .map((lodge) => {
        const coords = getLodgeCoordinates(lodge);
        const distance = calculateDistanceMiles(
          activeCenter.lat,
          activeCenter.lng,
          coords.lat,
          coords.lng
        );
        return {
          ...lodge,
          calculatedDistanceMiles: distance,
        };
      })
      .filter((lodge) => {
        // Radius filter
        const withinRadius = lodge.calculatedDistanceMiles <= radiusMiles;
        // If it explicitly belongs to this university, also include
        const matchesUni = lodge.university_slug === selectedUniSlug;
        const matchesLocation = locationMode === 'gps' ? withinRadius : withinRadius || matchesUni;

        if (!matchesLocation) return false;

        // Accommodation Type Filter
        if (
          accommodationTypeFilter !== 'all' &&
          lodge.accommodation_type !== accommodationTypeFilter
        ) {
          return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = lodge.title.toLowerCase().includes(q);
          const matchNeighbourhood = lodge.neighbourhood.toLowerCase().includes(q);
          const matchAddress = lodge.address.toLowerCase().includes(q);
          const matchUni = lodge.university_name.toLowerCase().includes(q);
          return matchTitle || matchNeighbourhood || matchAddress || matchUni;
        }

        return true;
      })
      .sort((a, b) => a.calculatedDistanceMiles - b.calculatedDistanceMiles);
  }, [lodges, activeCenter, radiusMiles, selectedUniSlug, locationMode, accommodationTypeFilter, searchQuery]);

  // University Switcher Filter
  const filteredModalSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) {
      return [
        {
          name: 'Abia State University (ABSU)',
          slug: 'abia-state-university',
          acronym: 'ABSU',
          city: 'Uturu',
        },
        {
          name: 'University of Nigeria, Nsukka (UNN)',
          slug: 'university-of-nigeria-nsukka',
          acronym: 'UNN',
          city: 'Nsukka',
        },
        {
          name: 'Michael Okpara University (MOUAU)',
          slug: 'michael-okpara-university-of-agriculture-umudike',
          acronym: 'MOUAU',
          city: 'Umudike',
        },
        {
          name: 'University of Lagos (UNILAG)',
          slug: 'university-of-lagos',
          acronym: 'UNILAG',
          city: 'Akoka',
        },
        {
          name: 'University of Ibadan (UI)',
          slug: 'university-of-ibadan',
          acronym: 'UI',
          city: 'Ibadan',
        },
        {
          name: 'Obafemi Awolowo University (OAU)',
          slug: 'obafemi-awolowo-university',
          acronym: 'OAU',
          city: 'Ile-Ife',
        },
        {
          name: 'University of Benin (UNIBEN)',
          slug: 'university-of-benin',
          acronym: 'UNIBEN',
          city: 'Benin City',
        },
        {
          name: 'FUTA Akure',
          slug: 'federal-university-of-technology-akure',
          acronym: 'FUTA',
          city: 'Akure',
        },
      ];
    }
    const q = schoolSearchQuery.toLowerCase().trim();
    return NIGERIAN_UNIVERSITIES.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.acronym.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [schoolSearchQuery]);

  return (
    <div className="relative min-h-screen bg-[#F8F8F6] text-[#24272B] pb-24 flex flex-col">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & SEARCH BAR (Screen 4 reference) */}
      {/* ======================================================== */}
      <section className="px-4 pt-3 pb-3 space-y-3 bg-[#F8F8F6] z-20 shrink-0">
        {/* Title & Dropdown Switcher */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#24272B]">
              Find your place.
            </h1>

            {/* School / Location Badge Button */}
            <button
              type="button"
              onClick={() => setIsSchoolModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F45B2A] hover:opacity-85 active:scale-95 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-[#F45B2A] shrink-0" />
              <span>
                {locationMode === 'gps'
                  ? 'Around my current location'
                  : `Around ${currentSchoolObj.name}`}
              </span>
              <ChevronDown className="h-3 w-3 text-[#F45B2A] stroke-[2.5]" />
            </button>
          </div>

          {/* Filter button */}
          <button
            type="button"
            onClick={() => setIsSheetExpanded(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#E8E8E5] text-[#24272B] shadow-2xs hover:border-[#F45B2A] active:scale-95 transition-all"
            aria-label="Filter accommodation"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Prominent Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search an area, school or lodge"
            className="w-full pl-10 pr-9 py-2.5 bg-white rounded-2xl border border-[#E8E8E5] text-xs sm:text-sm text-[#24272B] placeholder:text-slate-400 focus:outline-none focus:border-[#F45B2A] focus:ring-2 focus:ring-[#F45B2A]/10 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </section>

      {/* GPS Notification Toast Banner */}
      {gpsNotification && (
        <div className="px-4 py-1.5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#24272B] text-white text-[11px] font-bold shadow-md justify-center">
            <Sparkles className="h-3.5 w-3.5 text-[#F45B2A]" />
            <span>{gpsNotification}</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. INTERACTIVE MAP SECTION WITH FLOATING RADIUS & GPS */}
      {/* ======================================================== */}
      <section className="relative px-3 flex-1 min-h-[380px] max-h-[58vh]">
        {/* Floating Radius Selector (Top Right of Map) */}
        <div className="absolute top-4 right-6 z-20">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRadiusDropdownOpen(!isRadiusDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#24272B] border border-[#E8E8E5] shadow-md text-xs font-extrabold hover:border-[#F45B2A] active:scale-95 transition-all"
            >
              <span>Radius {radiusMiles} mi</span>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            {isRadiusDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-2xl border border-[#E8E8E5] shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setRadiusMiles(5);
                    setIsRadiusDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between ${
                    radiusMiles === 5 ? 'text-[#F45B2A] bg-[#FFF0E9]' : 'text-[#24272B] hover:bg-slate-50'
                  }`}
                >
                  <span>5 miles</span>
                  {radiusMiles === 5 && <Check className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRadiusMiles(10);
                    setIsRadiusDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between ${
                    radiusMiles === 10 ? 'text-[#F45B2A] bg-[#FFF0E9]' : 'text-[#24272B] hover:bg-slate-50'
                  }`}
                >
                  <span>10 miles</span>
                  {radiusMiles === 10 && <Check className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Leaflet Map Centered around Selected School */}
        <LodgeMap
          lodges={nearbyLodges}
          universitySlug={selectedUniSlug}
          selectedLodgeId={selectedLodge?.id}
          onSelectLodge={(lodge) => {
            setSelectedLodge(lodge);
            setIsSheetExpanded(false);
          }}
          radiusMiles={radiusMiles}
          centerCoordinates={activeCenter}
          centerName={currentSchoolObj.name}
          height="100%"
          className="min-h-[380px] h-[52vh]"
          showGpsButton={true}
          isGpsActive={locationMode === 'gps'}
          onGpsClick={handleToggleGps}
        />
      </section>

      {/* ======================================================== */}
      {/* 3. CONNECTED BOTTOM SHEET (4 CONNECTED STATES) */}
      {/* ======================================================== */}
      <section className="px-3 pt-2">
        {/* STATE 2: SELECTED PROPERTY PREVIEW CARD */}
        {selectedLodge && !isSheetExpanded ? (
          <div className="bg-white rounded-3xl border border-[#E8E8E5] p-3.5 shadow-xl space-y-3 animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="relative h-20 w-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                <Image
                  src={
                    selectedLodge.images[0] ||
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={selectedLodge.title}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#F45B2A] bg-[#FFF0E9] px-2 py-0.5 rounded-full">
                    {selectedLodge.accommodation_type.replace('_', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedLodge(null)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-[#24272B]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="font-extrabold text-sm text-[#24272B] truncate">
                  {selectedLodge.title}
                </h3>

                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>{selectedLodge.distance_to_campus}</span>
                </p>

                <div className="flex items-baseline gap-1 pt-0.5">
                  <span className="text-sm font-extrabold text-[#24272B]">
                    {formatNaira(selectedLodge.pricing.min_price)}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">/ year</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#E8E8E5]">
              <Link
                href={`/lodges/${selectedLodge.slug}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#F45B2A] text-white text-center font-bold text-xs shadow-xs hover:bg-[#DE4C1D] active:scale-98 transition-all"
              >
                View Full Details
              </Link>
              <button
                type="button"
                onClick={(e) => toggleSaveLodge(selectedLodge.id, e)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
                  savedLodgeIds.includes(selectedLodge.id)
                    ? 'border-[#F45B2A] bg-[#FFF0E9] text-[#F45B2A]'
                    : 'border-[#E8E8E5] text-slate-400 hover:text-[#F45B2A]'
                }`}
                title="Save lodge"
              >
                <Heart
                  className={`h-4 w-4 ${
                    savedLodgeIds.includes(selectedLodge.id) ? 'fill-[#F45B2A]' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        ) : (
          /* STATE 1: DEFAULT BOTTOM SHEET PEEK (Places near your school) */
          <div className="bg-white rounded-3xl border border-[#E8E8E5] p-4 shadow-lg space-y-3">
            {/* Drag Handle */}
            <div className="flex justify-center -mt-1">
              <div className="h-1 w-10 rounded-full bg-[#E8E8E5]" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-[#24272B]">
                  Places near your school
                </h2>
                <p className="text-[11px] text-slate-500">
                  {nearbyLodges.length} available within {radiusMiles} miles
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSheetExpanded(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#F45B2A] hover:underline"
              >
                <span>See all</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Quick Preview Cards Carousel (Horizontal) */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pt-1">
              {nearbyLodges.slice(0, 4).map((lodge) => {
                const isSaved = savedLodgeIds.includes(lodge.id);
                return (
                  <div
                    key={lodge.id}
                    onClick={() => setSelectedLodge(lodge)}
                    className="min-w-[210px] max-w-[210px] bg-[#F8F8F6] rounded-2xl border border-[#E8E8E5] p-2.5 shrink-0 cursor-pointer hover:border-[#F45B2A] active:scale-98 transition-all"
                  >
                    <div className="relative h-24 w-full rounded-xl overflow-hidden mb-2 bg-slate-200">
                      <Image
                        src={
                          lodge.images[0] ||
                          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={lodge.title}
                        fill
                        sizes="210px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => toggleSaveLodge(lodge.id, e)}
                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 hover:text-[#F45B2A] shadow-xs"
                      >
                        <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#F45B2A] text-[#F45B2A]' : ''}`} />
                      </button>
                    </div>

                    <h4 className="font-extrabold text-xs text-[#24272B] truncate">
                      {lodge.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {lodge.distance_to_campus}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="font-extrabold text-xs text-[#24272B]">
                        {formatNaira(lodge.pricing.min_price)}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        {lodge.available_rooms > 0 ? `${lodge.available_rooms} left` : 'Occupied'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* STATE 3: FULL EXPANDED RESULTS DRAWER */}
      {/* ======================================================== */}
      {isSheetExpanded && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full mx-auto bg-white rounded-t-3xl border-t border-[#E8E8E5] max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header & Close */}
            <div className="px-5 pt-4 pb-3 border-b border-[#E8E8E5] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#24272B]">
                  Accommodation near {currentSchoolObj.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {nearbyLodges.length} lodges within {radiusMiles} miles
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetExpanded(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="px-5 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#E8E8E5]">
              {['all', 'self_contained', 'single_room', 'shared_apartment'].map((typeKey) => (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setAccommodationTypeFilter(typeKey)}
                  className={`py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    accommodationTypeFilter === typeKey
                      ? 'bg-[#F45B2A] text-white shadow-xs'
                      : 'bg-[#F8F8F6] text-slate-600 border border-[#E8E8E5]'
                  }`}
                >
                  {typeKey === 'all'
                    ? 'All Places'
                    : typeKey === 'self_contained'
                    ? 'Self-contained'
                    : typeKey === 'single_room'
                    ? 'Single Room'
                    : 'Shared'}
                </button>
              ))}
            </div>

            {/* Scrollable Accommodation Listings */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5 no-scrollbar">
              {nearbyLodges.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A]">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#24272B]">No lodges found</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Try expanding your search radius to 10 miles or switching accommodation filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRadiusMiles(10)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F45B2A] text-white text-xs font-bold"
                  >
                    <span>Expand to 10 miles</span>
                  </button>
                </div>
              ) : (
                nearbyLodges.map((lodge) => {
                  const isSaved = savedLodgeIds.includes(lodge.id);
                  return (
                    <div
                      key={lodge.id}
                      className="flex gap-3.5 p-3 rounded-2xl bg-[#F8F8F6] border border-[#E8E8E5] hover:border-[#F45B2A] transition-all"
                    >
                      <div className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                        <Image
                          src={
                            lodge.images[0] ||
                            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={lodge.title}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase text-[#F45B2A] bg-[#FFF0E9] px-2 py-0.5 rounded-full">
                            {lodge.accommodation_type.replace('_', ' ')}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => toggleSaveLodge(lodge.id, e)}
                            className="text-slate-400 hover:text-[#F45B2A]"
                          >
                            <Heart
                              className={`h-4 w-4 ${isSaved ? 'fill-[#F45B2A] text-[#F45B2A]' : ''}`}
                            />
                          </button>
                        </div>

                        <h4 className="font-extrabold text-xs sm:text-sm text-[#24272B] truncate">
                          {lodge.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 truncate">
                          {lodge.distance_to_campus}
                        </p>

                        <div className="flex items-baseline justify-between pt-1">
                          <span className="font-extrabold text-xs sm:text-sm text-[#24272B]">
                            {formatNaira(lodge.pricing.min_price)}{' '}
                            <span className="text-[10px] font-normal text-slate-500">/yr</span>
                          </span>
                          <Link
                            href={`/lodges/${lodge.slug}`}
                            className="text-[11px] font-bold text-[#F45B2A] hover:underline"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* QUICK SCHOOL SELECTOR MODAL */}
      {/* ======================================================== */}
      {isSchoolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E8E8E5] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#24272B]">
                Choose Campus Anchor
              </h3>
              <button
                type="button"
                onClick={() => setIsSchoolModalOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* School Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={schoolSearchQuery}
                onChange={(e) => setSchoolSearchQuery(e.target.value)}
                placeholder="Search university..."
                className="w-full pl-9 pr-3 py-2 bg-[#F8F8F6] rounded-xl border border-[#E8E8E5] text-xs text-[#24272B] focus:outline-none focus:border-[#F45B2A]"
              />
            </div>

            {/* Option to use GPS */}
            <button
              type="button"
              onClick={() => {
                handleToggleGps();
                setIsSchoolModalOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#F45B2A]/40 bg-[#FFF0E9]/50 text-left hover:bg-[#FFF0E9] transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F45B2A] text-white">
                <Crosshair className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F45B2A]">Use my current location</p>
                <p className="text-[10px] text-slate-500">Discover places right where you stand</p>
              </div>
            </button>

            {/* List of Universities */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar">
              {filteredModalSchools.map((uni) => {
                const isSelected = selectedUniSlug === uni.slug && locationMode === 'school';
                return (
                  <button
                    key={uni.slug}
                    type="button"
                    onClick={() => {
                      setSelectedUniSlug(uni.slug);
                      setLocationMode('school');
                      if (typeof window !== 'undefined') {
                        try {
                          localStorage.setItem('lodgehere_user_university', uni.slug);
                        } catch {}
                      }
                      setIsSchoolModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-[#F45B2A] bg-[#FFF0E9] font-bold'
                        : 'border-[#E8E8E5] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs text-[#24272B] truncate">{uni.name}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#F45B2A] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Physical Inspection Schedule Modal */}
      {inspectionLodge && (
        <InspectionModal
          lodge={inspectionLodge}
          isOpen={true}
          onClose={() => setInspectionLodge(null)}
        />
      )}
    </div>
  );
}
