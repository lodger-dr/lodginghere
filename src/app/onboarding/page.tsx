'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Check,
  ChevronRight,
  MapPin,
  Bell,
  ArrowRight,
  ShieldCheck,
  Building2,
  Home,
  CheckCircle2,
  BedDouble,
  Users,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { completeOnboardingAction } from '../(auth)/actions';

// Popular schools featured on Screen 1 of reference design
const POPULAR_SCHOOLS = [
  {
    acronym: 'ABSU',
    name: 'Abia State University (ABSU)',
    slug: 'abia-state-university',
    state: 'Abia',
    city: 'Uturu',
    badgeBg: 'bg-[#0B3B60]',
    badgeColor: 'text-white',
  },
  {
    acronym: 'UNN',
    name: 'University of Nigeria, Nsukka (UNN)',
    slug: 'university-of-nigeria-nsukka',
    state: 'Enugu',
    city: 'Nsukka',
    badgeBg: 'bg-[#186036]',
    badgeColor: 'text-white',
  },
  {
    acronym: 'MOU',
    name: 'Michael Okpara University (MOU)',
    slug: 'michael-okpara-university-of-agriculture-umudike',
    state: 'Abia',
    city: 'Umudike',
    badgeBg: 'bg-[#1F4E34]',
    badgeColor: 'text-white',
  },
];

// Room type options for Screen 2
const ACCOMMODATION_TYPES = [
  {
    id: 'single_room',
    title: 'Single room',
    description: 'A room of your own.',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'self_contained',
    title: 'Self-contained',
    description: 'Private room and facilities.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'shared_apartment',
    title: 'Shared apartment',
    description: 'Share with others.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
  },
];

// Budget options for Screen 2
const BUDGET_OPTIONS = [
  { id: 'under_100k', label: 'Under ₦100k', maxBudget: 100000 },
  { id: '100k_200k', label: '₦100k – ₦200k', maxBudget: 200000 },
  { id: '200k_plus', label: '₦200k+', maxBudget: 500000 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, updateProfileState, refreshProfile } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Mode: Student onboarding (default from reference design) or Landlord fallback
  const [roleMode, setRoleMode] = useState<'student' | 'landlord'>('student');

  // Multi-step student flow: 1 (School Selection), 2 (Preferences), 3 (Permissions)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: School Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('abia-state-university');

  // Step 2: Preferences (Optional)
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Step 3: Permissions (Optional)
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationStatusText, setLocationStatusText] = useState('Enable location →');
  const [notificationStatusText, setNotificationStatusText] = useState('Turn on notifications →');

  // Landlord fallback states (preserving existing backend capabilities)
  const [landlordName, setLandlordName] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [operatingArea, setOperatingArea] = useState('');

  // Hydrate if user already has partial profile
  useEffect(() => {
    if (profile?.role === 'landlord') {
      setRoleMode('landlord');
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lodgehere_user_university');
      if (stored) setSelectedSchoolSlug(stored);
    }
  }, [profile]);

  // Filter universities for Step 1
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return NIGERIAN_UNIVERSITIES.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.acronym.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [searchQuery]);

  // Request browser location permission optionally
  const handleRequestLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatusText('Not supported on this browser');
      return;
    }
    setLocationStatusText('Requesting...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationEnabled(true);
        setLocationStatusText('Location enabled ✓');
        try {
          localStorage.setItem(
            'lodgehere_user_gps',
            JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          );
        } catch {}
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err);
        setLocationStatusText('Location access skipped');
      },
      { timeout: 8000 }
    );
  };

  // Request browser notification permission optionally
  const handleRequestNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationStatusText('Not supported on this browser');
      return;
    }
    setNotificationStatusText('Requesting...');
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        setNotificationStatusText('Notifications enabled ✓');
      } else {
        setNotificationStatusText('Notifications skipped');
      }
    } catch {
      setNotificationStatusText('Notifications skipped');
    }
  };

  // Step transitions
  const handleContinueFromStep1 = () => {
    if (!selectedSchoolSlug) return;
    setStep(2);
  };

  const handleContinueFromStep2 = () => {
    setStep(3);
  };

  const handleSkipPreferences = () => {
    setSelectedBudget(null);
    setSelectedType(null);
    setStep(3);
  };

  // Final submission and redirect to map-first homepage
  const handleFinishOnboarding = () => {
    startTransition(async () => {
      // 1. Persist to local storage for fast client hydration
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('lodgehere_user_university', selectedSchoolSlug);
          localStorage.setItem(
            'lodgehere_user_preferences',
            JSON.stringify({
              budget: selectedBudget,
              accommodationType: selectedType,
              locationEnabled,
              notificationsEnabled,
            })
          );
          localStorage.setItem('lodgehere_onboarding_completed', 'true');
        } catch {}
      }

      // 2. Persist to Supabase if authenticated
      try {
        const formData = new FormData();
        formData.append('role', 'student');
        formData.append('fullName', profile?.full_name || user?.email?.split('@')[0] || 'Student');
        if (profile?.phone) formData.append('phone', profile.phone);
        formData.append('universityId', selectedSchoolSlug);
        if (selectedType) formData.append('preferredRoomType', selectedType);

        await completeOnboardingAction(formData);

        updateProfileState({
          onboarding_completed: true,
          student_profile: {
            university_slug: selectedSchoolSlug,
            department: '',
          },
        });
        await refreshProfile();
      } catch (err) {
        console.warn('Server onboarding sync note:', err);
      }

      // 3. Take student directly to the map-first discovery homepage
      router.push('/');
    });
  };

  // Landlord submission handler
  const handleCompleteLandlordOnboarding = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('role', 'landlord');
        formData.append('fullName', landlordName || 'Property Owner');
        if (landlordPhone) formData.append('phone', landlordPhone);
        formData.append('providerType', 'owner');
        if (businessName) formData.append('businessName', businessName);
        if (operatingArea) formData.append('operatingArea', operatingArea);

        await completeOnboardingAction(formData);
        router.push('/landlord/overview');
      } catch {
        router.push('/landlord/overview');
      }
    });
  };

  // Selected school object for title display
  const currentSelectedSchool =
    POPULAR_SCHOOLS.find((s) => s.slug === selectedSchoolSlug) ||
    NIGERIAN_UNIVERSITIES.find((u) => u.slug === selectedSchoolSlug) ||
    POPULAR_SCHOOLS[0];

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#24272B] flex flex-col justify-between">
      {/* ======================================================== */}
      {/* TOP HEADER: BRAND LOGO & SWITCHER */}
      {/* ======================================================== */}
      <header className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* LodgeHere Orange House Badge Logo */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E9] text-[#F45B2A] border border-[#F45B2A]/20 shadow-xs">
            <Home className="h-5 w-5 fill-[#F45B2A] text-[#F45B2A]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#24272B]">
            Lodge<span className="text-[#F45B2A]">Here</span>
          </span>
        </div>

        {/* Subtle toggle for Landlord/Student */}
        <button
          type="button"
          onClick={() => setRoleMode(roleMode === 'student' ? 'landlord' : 'student')}
          className="text-[11px] font-semibold text-slate-500 hover:text-[#24272B] underline"
        >
          {roleMode === 'student' ? 'Landlord Onboarding' : 'Student Mode'}
        </button>
      </header>

      {/* ======================================================== */}
      {/* LANDLORD ONBOARDING FALLBACK (Preserves existing stack) */}
      {/* ======================================================== */}
      {roleMode === 'landlord' ? (
        <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#24272B]">Host &amp; Landlord Setup</h1>
            <p className="text-xs text-slate-600">
              List and manage student properties with verified direct inquiries.
            </p>
          </div>
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-[#E8E8E5] shadow-xs">
            <div>
              <label className="block text-xs font-bold text-[#24272B] mb-1">Full Name</label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="Chief Adebayo Olanrewaju"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] text-sm focus:outline-none focus:border-[#F45B2A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24272B] mb-1">Phone Number</label>
              <input
                type="tel"
                value={landlordPhone}
                onChange={(e) => setLandlordPhone(e.target.value)}
                placeholder="0803 234 5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] text-sm focus:outline-none focus:border-[#F45B2A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24272B] mb-1">Property / Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Emerald Properties Ltd"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] text-sm focus:outline-none focus:border-[#F45B2A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24272B] mb-1">Primary Operating Campus / Area</label>
              <input
                type="text"
                value={operatingArea}
                onChange={(e) => setOperatingArea(e.target.value)}
                placeholder="UNILAG Akoka / Yaba"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] text-sm focus:outline-none focus:border-[#F45B2A]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleCompleteLandlordOnboarding}
            className="w-full py-3.5 px-4 rounded-xl bg-[#F45B2A] text-white font-bold text-sm shadow-md hover:bg-[#DE4C1D] transition-colors"
          >
            Enter Landlord Dashboard
          </button>
        </main>
      ) : (
        /* ======================================================== */
        /* STUDENT ONBOARDING (Reference design 3 steps) */
        /* ======================================================== */
        <main className="flex-1 flex flex-col justify-between px-5 pt-3 pb-8 max-w-md mx-auto w-full">
          <div>
            {/* STEP PROGRESS BAR & STEPPER HEADER */}
            <div className="space-y-2 mb-6">
              <div className="flex gap-2 w-full">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    step >= 1 ? 'bg-[#F45B2A]' : 'bg-[#E8E8E5]'
                  }`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    step >= 2 ? 'bg-[#F45B2A]' : 'bg-[#E8E8E5]'
                  }`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    step >= 3 ? 'bg-[#F45B2A]' : 'bg-[#E8E8E5]'
                  }`}
                />
              </div>

              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                {step === 1 && "LET'S GET YOU STARTED · 1 OF 3"}
                {step === 2 && 'A FEW QUICK PREFERENCES · 2 OF 3'}
                {step === 3 && 'ONE LAST THING · 3 OF 3'}
              </p>
            </div>

            {/* ======================================================== */}
            {/* STEP 1: SCHOOL SELECTION */}
            {/* ======================================================== */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24272B] leading-tight">
                    Where do you go to school?
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We&apos;ll use your school to find places to stay nearby — not where you&apos;re standing right now.
                  </p>
                </div>

                {/* Search your school input */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your school"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E8E8E5] text-xs sm:text-sm text-[#24272B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F45B2A]/20 focus:border-[#F45B2A] transition-all shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Search Results (if typing) */}
                {searchQuery.trim().length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Search Results ({filteredUniversities.length})
                    </p>
                    <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                      {filteredUniversities.length === 0 ? (
                        <div className="p-4 rounded-xl bg-white border border-[#E8E8E5] text-center text-xs text-slate-500">
                          No universities found matching &quot;{searchQuery}&quot;
                        </div>
                      ) : (
                        filteredUniversities.map((uni) => {
                          const isSelected = selectedSchoolSlug === uni.slug;
                          return (
                            <button
                              key={uni.slug}
                              type="button"
                              onClick={() => {
                                setSelectedSchoolSlug(uni.slug);
                                setSearchQuery('');
                              }}
                              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left border transition-all ${
                                isSelected
                                  ? 'border-[#F45B2A] bg-[#FFF0E9]/60 ring-2 ring-[#F45B2A]/20'
                                  : 'border-[#E8E8E5] bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white font-extrabold text-[10px]">
                                  {uni.acronym.slice(0, 4)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#24272B] truncate">{uni.name}</p>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {uni.city}, {uni.state} State
                                  </p>
                                </div>
                              </div>
                              {isSelected ? (
                                <Check className="h-4 w-4 text-[#F45B2A] shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : (
                  /* Popular Schools from Reference Design */
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      POPULAR SCHOOLS
                    </p>
                    <div className="space-y-2.5">
                      {POPULAR_SCHOOLS.map((school) => {
                        const isSelected = selectedSchoolSlug === school.slug;
                        return (
                          <button
                            key={school.slug}
                            type="button"
                            onClick={() => setSelectedSchoolSlug(school.slug)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all ${
                              isSelected
                                ? 'border-[#F45B2A] bg-white shadow-sm ring-2 ring-[#F45B2A]/20'
                                : 'border-[#E8E8E5] bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${school.badgeBg} ${school.badgeColor} font-black text-xs shadow-xs`}
                              >
                                {school.acronym}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-[#24272B] truncate">
                                  {school.name}
                                </p>
                              </div>
                            </div>
                            {isSelected ? (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F45B2A] text-white">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: ACCOMMODATION PREFERENCES */}
            {/* ======================================================== */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24272B] leading-tight">
                    Let&apos;s find a place that feels right.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    These help us sort the options. You can skip anything and change it later.
                  </p>
                </div>

                {/* Section 1: Budget */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🛍️</span>
                    <span className="text-xs sm:text-sm font-bold text-[#24272B]">What&apos;s your budget?</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {BUDGET_OPTIONS.map((opt) => {
                      const isSelected = selectedBudget === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedBudget(isSelected ? null : opt.id)}
                          className={`py-3 px-2 rounded-xl text-center border font-bold text-xs transition-all ${
                            isSelected
                              ? 'border-[#F45B2A] bg-[#FFF0E9] text-[#F45B2A] shadow-xs ring-1 ring-[#F45B2A]'
                              : 'border-[#E8E8E5] bg-white text-[#24272B] hover:border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Accommodation Type */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏠</span>
                    <span className="text-xs sm:text-sm font-bold text-[#24272B]">What kind of place?</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {ACCOMMODATION_TYPES.map((type) => {
                      const isSelected = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(isSelected ? null : type.id)}
                          className={`flex flex-col text-left p-2 rounded-2xl border transition-all overflow-hidden ${
                            isSelected
                              ? 'border-[#F45B2A] bg-white ring-2 ring-[#F45B2A]/20 shadow-xs'
                              : 'border-[#E8E8E5] bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="relative w-full h-20 rounded-xl overflow-hidden mb-2 bg-slate-100">
                            <Image
                              src={type.image}
                              alt={type.title}
                              fill
                              sizes="(max-width: 640px) 100px, 120px"
                              className="object-cover"
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F45B2A] text-white">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="font-extrabold text-[11px] text-[#24272B] leading-tight line-clamp-1">
                            {type.title}
                          </span>
                          <span className="text-[9px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                            {type.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 3: OPTIONAL PERMISSIONS */}
            {/* ======================================================== */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#24272B] leading-tight">
                    Make LodgeHere work better for you.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    A couple of optional settings to make finding a place easier.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Permission Card 1: Location */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E8E8E5] shadow-xs flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0E9] text-[#F45B2A]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-[#24272B]">Use your location</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Find places near you when you choose to search around your current area. Your school remains your main search point.
                      </p>
                      <button
                        type="button"
                        onClick={handleRequestLocation}
                        className={`text-xs font-bold transition-colors inline-flex items-center gap-1 pt-1 ${
                          locationEnabled ? 'text-emerald-600' : 'text-[#F45B2A] hover:underline'
                        }`}
                      >
                        <span>{locationStatusText}</span>
                      </button>
                    </div>
                  </div>

                  {/* Permission Card 2: Notifications */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E8E8E5] shadow-xs flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0E9] text-[#F45B2A]">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-[#24272B]">Stay in the loop</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Get important updates about enquiries, saved places and booking activity.
                      </p>
                      <button
                        type="button"
                        onClick={handleRequestNotifications}
                        className={`text-xs font-bold transition-colors inline-flex items-center gap-1 pt-1 ${
                          notificationsEnabled ? 'text-emerald-600' : 'text-[#F45B2A] hover:underline'
                        }`}
                      >
                        <span>{notificationStatusText}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* BOTTOM BUTTONS & ACTIONS PER STEP */}
          {/* ======================================================== */}
          <div className="pt-6 space-y-3">
            {step === 1 && (
              <>
                <button
                  type="button"
                  onClick={handleContinueFromStep1}
                  disabled={!selectedSchoolSlug}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#F45B2A] text-white font-bold text-sm shadow-md hover:bg-[#DE4C1D] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  Continue
                </button>
                <p className="text-center text-[11px] text-slate-500">
                  You can change your school anytime.
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={handleContinueFromStep2}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#F45B2A] text-white font-bold text-sm shadow-md hover:bg-[#DE4C1D] active:scale-[0.99] transition-all"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={handleSkipPreferences}
                  className="w-full py-2.5 px-4 rounded-xl border border-transparent text-slate-500 hover:text-[#24272B] font-bold text-xs transition-colors"
                >
                  Skip for now
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  disabled={isPending}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#F45B2A] text-white font-bold text-sm shadow-md hover:bg-[#DE4C1D] active:scale-[0.99] transition-all"
                >
                  {isPending ? 'Setting up your map...' : 'Start exploring'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    className="text-[11px] text-[#F45B2A] font-semibold hover:underline"
                  >
                    You can do this later. Continue without enabling either.
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
