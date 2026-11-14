'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Building2,
  CalendarCheck,
  BookmarkCheck,
  GraduationCap,
  Moon,
  Sun,
  User,
  ArrowRight,
  SlidersHorizontal,
  X,
  Compass,
  ArrowRightLeft,
} from 'lucide-react';
import { getLodges } from '@/lib/data/lodges-data';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { useDevRole } from '@/lib/dev-role';
import { useTheme } from '@/lib/theme';
import { Lodge } from '@/types/database';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const router = useRouter();
  const { role, switchRole } = useDevRole();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLodges(getLodges());
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle global escape
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

  const filteredLodges = lodges
    .filter(
      (l) =>
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.address.toLowerCase().includes(query.toLowerCase()) ||
        l.campus_name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  const filteredUnis = NIGERIAN_UNIVERSITIES.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.acronym.toLowerCase().includes(query.toLowerCase()) ||
      u.city.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const navigationItems = [
    {
      title: 'Dashboard Overview',
      subtitle: role === 'student' ? 'Student housing overview' : 'Landlord portfolio overview',
      icon: Building2,
      action: () => router.push(role === 'student' ? '/student/overview' : '/landlord/overview'),
      category: 'Navigation',
    },
    {
      title: 'Explore Lodges',
      subtitle: 'Browse all campus accommodations',
      icon: Compass,
      action: () => router.push(role === 'student' ? '/student/explore' : '/explore'),
      category: 'Navigation',
    },
    {
      title: 'Universities Directory',
      subtitle: 'Browse campuses and student areas',
      icon: GraduationCap,
      action: () => router.push(role === 'student' ? '/student/universities' : '/universities'),
      category: 'Navigation',
    },
    {
      title: 'My Inspections',
      subtitle: 'Manage upcoming physical room inspections',
      icon: CalendarCheck,
      action: () => router.push(role === 'student' ? '/student/inspections' : '/landlord/inspections'),
      category: 'Navigation',
    },
    {
      title: 'Room Bookings',
      subtitle: 'Mutual booking records and deposits',
      icon: BookmarkCheck,
      action: () => router.push('/student/bookings'),
      category: 'Navigation',
    },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const actionItems = [
    {
      title: `Switch to ${role === 'student' ? 'Landlord' : 'Student'} Persona`,
      subtitle: `Currently operating as ${role}`,
      icon: ArrowRightLeft,
      action: () => {
        switchRole(role === 'student' ? 'landlord' : 'student');
        onClose();
      },
      category: 'Quick Actions',
    },
    {
      title: `Toggle Theme (Current: ${theme})`,
      subtitle: 'Switch between light and dark modes',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
      category: 'Quick Actions',
    },
    {
      title: 'Account Profile',
      subtitle: 'Manage your profile and contact info',
      icon: User,
      action: () => router.push(role === 'student' ? '/student/profile' : '/landlord/profile'),
      category: 'Quick Actions',
    },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/50 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-slate-200/80 bg-white/95 dark:border-slate-800/80 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5">
          <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lodges, campuses, or type a quick command..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 scrollbar-thin">
          {/* Lodges Jump */}
          {filteredLodges.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                Lodges & Properties
              </span>
              {filteredLodges.map((lodge) => (
                <button
                  key={lodge.id}
                  type="button"
                  onClick={() => handleSelect(() => router.push(`/lodges/${lodge.slug}`))}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <Building2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {lodge.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{lodge.campus_name} • ₦{lodge.pricing.min_price.toLocaleString()}/yr</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Universities Jump */}
          {filteredUnis.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                Campuses
              </span>
              {filteredUnis.map((uni) => (
                <button
                  key={uni.slug}
                  type="button"
                  onClick={() => handleSelect(() => router.push(`/universities?search=${uni.slug}`))}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      <GraduationCap className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {uni.name} ({uni.acronym})
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{uni.city}, {uni.state} State</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Navigation Items */}
          {navigationItems.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                Navigation
              </span>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelect(item.action)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Actions */}
          {actionItems.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                Quick Actions
              </span>
              {actionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleSelect(item.action)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          )}

          {filteredLodges.length === 0 &&
            filteredUnis.length === 0 &&
            navigationItems.length === 0 &&
            actionItems.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching results for &ldquo;{query}&rdquo;
              </div>
            )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-850/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or keyboard</span>
          <div className="flex items-center gap-2">
            <span>Close: <kbd className="font-mono font-semibold">ESC</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
}
