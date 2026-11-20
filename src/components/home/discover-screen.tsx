'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Bell,
  Star,
  Check,
  Compass,
  MessageSquare,
  User as UserIcon,
  Home as HomeIcon,
  ChevronDown,
  X,
  Building2,
  CalendarCheck,
} from 'lucide-react';
import { Lodge } from '@/types/database';
import { getAllAvailableLodges } from '@/lib/data/lodges-data';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { formatNaira } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

interface DiscoverScreenProps {
  onOpenMap?: () => void;
  onOpenWelcome?: () => void;
}

export function DiscoverScreen({ onOpenMap, onOpenWelcome }: DiscoverScreenProps) {
  const { user } = useAuth();
  const [selectedUniSlug, setSelectedUniSlug] = useState('abia-state-university');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'self_contained' | 'single_room' | 'shared_apartment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUniSelectorOpen, setIsUniSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'locations' | 'chat' | 'settings'>('home');

  // Load all verified campus lodges
  const allLodges: Lodge[] = useMemo(() => {
    return getAllAvailableLodges();
  }, []);

  // Selected University Details
  const currentUniversity = useMemo(() => {
    return (
      NIGERIAN_UNIVERSITIES.find((u) => u.slug === selectedUniSlug) ||
      NIGERIAN_UNIVERSITIES[0]
    );
  }, [selectedUniSlug]);

  // Filtered Lodges based on University, Category & Search query
  const filteredLodges = useMemo(() => {
    return allLodges.filter((lodge) => {
      // 1. University filter: match selected uni or fallback to all if fewer matches
      const matchesUni =
        !selectedUniSlug ||
        lodge.university_slug === selectedUniSlug ||
        lodge.university_name?.toLowerCase().includes(currentUniversity.name.toLowerCase());

      // 2. Category filter
      const matchesCategory =
        selectedCategory === 'all' || lodge.accommodation_type === selectedCategory;

      // 3. Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lodge.title.toLowerCase().includes(q) ||
        lodge.address?.toLowerCase().includes(q) ||
        lodge.neighbourhood?.toLowerCase().includes(q) ||
        lodge.university_name?.toLowerCase().includes(q);

      return (matchesUni || allLodges.length <= 4) && matchesCategory && matchesSearch;
    });
  }, [allLodges, selectedUniSlug, currentUniversity, selectedCategory, searchQuery]);

  // Fallback to all lodges if filter returned empty so UI never looks vacant
  const displayLodges = filteredLodges.length > 0 ? filteredLodges : allLodges.slice(0, 8);

  const categories = [
    { id: 'all', label: 'Rental House' },
    { id: 'self_contained', label: 'Apartment' },
    { id: 'shared_apartment', label: 'Houses' },
    { id: 'single_room', label: 'Rooms' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#24272B] max-w-md mx-auto relative flex flex-col justify-between pb-24 shadow-2xl">
      <div className="p-5 space-y-5">
        {/* Top Status & Header Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Location Chip Button */}
          <button
            type="button"
            onClick={() => setIsUniSelectorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#24272B] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 text-[#F45B2A] shrink-0" />
            <span className="truncate max-w-[170px]">
              {currentUniversity.city}, {currentUniversity.state}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-300" />
          </button>

          {/* Right Action Icons: Notification Bell & Avatar */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="h-9 w-9 rounded-full bg-white border border-[#E8E8E5] flex items-center justify-center text-slate-700 hover:text-[#F45B2A] transition-colors relative shadow-xs cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#F45B2A] ring-2 ring-white" />
            </button>

            <Link
              href={user ? '/student/profile' : '/login'}
              className="h-9 w-9 rounded-full bg-[#FFF0E9] border-2 border-white shadow-xs overflow-hidden flex items-center justify-center text-xs font-bold text-[#F45B2A] hover:opacity-90 transition-opacity"
            >
              {user ? (
                <span>{user.email?.slice(0, 2).toUpperCase() || 'ST'}</span>
              ) : (
                <UserIcon className="h-4 w-4 text-[#F45B2A]" />
              )}
            </Link>
          </div>
        </div>

        {/* Hero Title */}
        <div className="space-y-0.5 pt-1">
          <h1 className="text-2xl font-black tracking-tight text-[#24272B] leading-tight">
            Discover
            <br />
            <span className="text-slate-800">Your New House</span>
          </h1>
        </div>

        {/* Search & Filter Row */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Place..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-full bg-white border border-[#E8E8E5] text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#24272B] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenMap}
            className="h-10 w-10 rounded-full bg-white border border-[#E8E8E5] flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Open Interactive Map"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#24272B] text-white shadow-xs'
                    : 'bg-white text-slate-500 border border-[#E8E8E5] hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Section Heading with Map Toggle Link */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm font-extrabold text-[#24272B] tracking-tight">
            Nearby Rental House&apos;s
          </h2>
          <button
            type="button"
            onClick={onOpenMap}
            className="text-xs font-bold text-[#F45B2A] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View on Map</span>
          </button>
        </div>

        {/* 2-Column Responsive Property Grid (Matching Reference Design) */}
        <div className="grid grid-cols-2 gap-3.5 pt-0.5">
          {displayLodges.map((lodge) => {
            const primaryImage =
              lodge.images?.[0] ||
              'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80';

            return (
              <Link
                key={lodge.id}
                href={`/lodges/${lodge.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between p-2.5 active:scale-[0.98]"
              >
                {/* Background Property Image */}
                <Image
                  src={primaryImage}
                  alt={lodge.title}
                  fill
                  sizes="(max-width: 480px) 50vw, 240px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Gradient Overlays for High Contrast Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30 pointer-events-none" />

                {/* Top Badges Row */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  {/* Verified Checkmark Pill */}
                  <div className="h-6 w-6 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shadow-xs">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>

                  {/* Translucent Price Tag Pill */}
                  <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
                    {formatNaira(lodge.pricing.min_price)} / yr
                  </div>
                </div>

                {/* Bottom Details Overlay */}
                <div className="relative z-10 space-y-1">
                  {/* Rating Chip */}
                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span>{lodge.rating.toFixed(1)}</span>
                  </div>

                  {/* Property Name */}
                  <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#FFF0E9] transition-colors drop-shadow-sm">
                    {lodge.title}
                  </h3>

                  {/* Location Info */}
                  <p className="text-[10px] text-white/80 line-clamp-1 flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5 text-slate-300 shrink-0" />
                    <span>{lodge.neighbourhood || currentUniversity.city}</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Navigation Bar (Matching Reference Design) */}
      <div className="fixed bottom-3 left-0 right-0 max-w-md mx-auto px-5 z-40">
        <div className="bg-white/95 backdrop-blur-lg border border-[#E8E8E5] rounded-full py-2 px-6 shadow-xl flex items-center justify-between">
          {/* Home Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-[#3B82F6]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'home' ? 'bg-blue-50' : ''}`}>
              <HomeIcon className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[9px] font-semibold">Home</span>
          </button>

          {/* Locations / Map Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('locations');
              onOpenMap?.();
            }}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              activeTab === 'locations' ? 'text-[#3B82F6]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'locations' ? 'bg-blue-50' : ''}`}>
              <MapPin className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[9px] font-semibold">Locations</span>
          </button>

          {/* Chat / Enquiries Tab */}
          <Link
            href="/student/enquiries"
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              activeTab === 'chat' ? 'text-[#3B82F6]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'chat' ? 'bg-blue-50' : ''}`}>
              <MessageSquare className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[9px] font-semibold">Chat</span>
          </Link>

          {/* Settings / Profile Tab */}
          <Link
            href="/student/profile"
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'text-[#3B82F6]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'settings' ? 'bg-blue-50' : ''}`}>
              <UserIcon className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[9px] font-semibold">Settings</span>
          </Link>
        </div>
      </div>

      {/* University Selector Modal Drawer */}
      {isUniSelectorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-w-md w-full mx-auto p-5 space-y-4 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-[#24272B]">Select Campus Area</h3>
                <p className="text-xs text-slate-500">Pick your institution to discover nearby lodges</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUniSelectorOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Popular Universities Quick List */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {NIGERIAN_UNIVERSITIES.slice(0, 15).map((uni) => {
                const isSelected = selectedUniSlug === uni.slug;
                return (
                  <button
                    key={uni.slug}
                    type="button"
                    onClick={() => {
                      setSelectedUniSlug(uni.slug);
                      setIsUniSelectorOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-[#24272B] bg-[#FFF0E9]/40 text-[#24272B]'
                        : 'border-[#E8E8E5] hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{uni.name}</p>
                      <p className="text-[10px] text-slate-500">{uni.city}, {uni.state} State</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-[#F45B2A] stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
