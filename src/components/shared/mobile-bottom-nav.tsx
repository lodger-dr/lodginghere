'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Compass,
  Bookmark,
  MessageSquare,
  User,
  Home,
  Building2,
  BedDouble,
  CalendarCheck,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  History,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useDevRole } from '@/lib/dev-role';
import { getInspections } from '@/lib/data/lodges-data';

interface NavTab {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, role: authRole, isAuthenticated } = useAuth();
  const { role: devRole } = useDevRole();
  const [activeInspectionsCount, setActiveInspectionsCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const effectiveRole = authRole || devRole || 'student';

  // Read inspections and saved items count for badges
  useEffect(() => {
    const updateCounts = () => {
      try {
        const all = getInspections();
        setActiveInspectionsCount(
          all.filter(
            (i) =>
              i.status === 'pending' ||
              i.status === 'accepted' ||
              i.status === 'reschedule_requested'
          ).length
        );

        if (typeof window !== 'undefined') {
          const rawSaved = localStorage.getItem('lodgehere_saved_lodges');
          if (rawSaved) {
            const arr = JSON.parse(rawSaved);
            setSavedCount(Array.isArray(arr) ? arr.length : 0);
          }
        }
      } catch { }
    };
    updateCounts();

    const handleChange = () => updateCounts();
    window.addEventListener('lodgehere-data-change', handleChange);
    return () => window.removeEventListener('lodgehere-data-change', handleChange);
  }, []);

  if (!pathname) return null;

  // Hide on lodge details page to give full prominence to the inspection action bar
  if (pathname.startsWith('/lodges/')) return null;

  // Hide on full-screen authentication and onboarding screens
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/onboarding')
  ) {
    return null;
  }

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/student/explore' || pathname === '/explore';
    }
    if (href === '/student/saved') {
      return pathname.startsWith('/student/saved') || pathname.startsWith('/student/favourites');
    }
    if (href === '/student/enquiries') {
      return pathname.startsWith('/student/enquiries') || pathname.startsWith('/student/inspections');
    }
    if (href === '/student/profile') {
      return pathname.startsWith('/student/profile');
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  let tabs: NavTab[] = [];

  // Landlord Dashboard Navigation
  if (pathname.startsWith('/landlord')) {
    tabs = [
      { name: 'Overview', href: '/landlord/overview', icon: Building2 },
      { name: 'Properties', href: '/landlord/properties', icon: Home },
      { name: 'Rooms', href: '/landlord/rooms', icon: BedDouble },
      {
        name: 'Inspections',
        href: '/landlord/inspections',
        icon: CalendarCheck,
        badge: activeInspectionsCount > 0 ? activeInspectionsCount : undefined,
      },
      { name: 'Profile', href: '/landlord/profile', icon: User },
    ];
  } else if (pathname.startsWith('/admin')) {
    // Admin Console Navigation
    tabs = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: ShieldCheck },
      { name: 'Verifications', href: '/admin/verifications', icon: FileCheck2 },
      { name: 'Properties', href: '/admin/properties', icon: Building2 },
      { name: 'Disputes', href: '/admin/reports', icon: AlertTriangle },
      { name: 'Logs', href: '/admin/audit-logs', icon: History },
    ];
  } else {
    // 4 MAIN STUDENT APPLICATION TABS (Redesigned Screen 4 Reference)
    // 1. Explore (Map-First Homepage)
    // 2. Saved (Bookmark / Favorites)
    // 3. Enquiries (Inspections / Student interactions)
    // 4. Profile (Student profile, school, preferences, PWA install)
    tabs = [
      {
        name: 'Explore',
        href: '/',
        icon: Search,
      },
      {
        name: 'Saved',
        href: '/student/saved',
        icon: Bookmark,
        badge: savedCount > 0 ? savedCount : undefined,
      },
      {
        name: 'Enquiries',
        href: '/student/enquiries',
        icon: MessageSquare,
        badge: activeInspectionsCount > 0 ? activeInspectionsCount : undefined,
      },
      {
        name: 'Profile',
        href: isAuthenticated && effectiveRole === 'landlord' ? '/landlord/profile' : '/student/profile',
        icon: User,
      },
    ];
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/95 border-t border-[#E8E8E5] backdrop-blur-xl px-2 pt-1 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)] transition-colors"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isLinkActive(tab.href);

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center min-w-[62px] py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 ${active ? 'text-[#F45B2A] font-bold' : 'text-slate-500 hover:text-[#24272B] font-medium'
                }`}
            >
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${active ? 'text-[#F45B2A]' : 'text-slate-400'
                  }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#F45B2A] px-1 text-[9px] font-black text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[68px] ${active ? 'font-black text-[#F45B2A]' : 'font-medium text-slate-500'
                }`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
