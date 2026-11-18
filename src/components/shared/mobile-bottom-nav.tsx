'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Compass,
  GraduationCap,
  Heart,
  User,
  Building2,
  CalendarCheck,
  BookmarkCheck,
  BedDouble,
  FileCheck2,
  AlertTriangle,
  History,
  ShieldCheck,
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
  const [pendingInspectionsCount, setPendingInspectionsCount] = useState(0);

  const effectiveRole = authRole || devRole || 'student';

  // Read inspections count for badge
  useEffect(() => {
    const updateCounts = () => {
      try {
        const all = getInspections();
        setActiveInspectionsCount(
          all.filter((i) => i.status === 'pending' || i.status === 'accepted' || i.status === 'reschedule_requested').length
        );
        setPendingInspectionsCount(
          all.filter((i) => i.status === 'pending').length
        );
      } catch { }
    };
    updateCounts();

    const handleChange = () => updateCounts();
    window.addEventListener('lodgehere-data-change', handleChange);
    return () => window.removeEventListener('lodgehere-data-change', handleChange);
  }, []);

  // Routes where mobile bottom navigation should NOT appear
  if (!pathname) return null;

  // Hide on lodge details page to give full prominence to the sticky "Schedule Inspection" action bar
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
    if (href === '/' || href === '/student/overview' || href === '/landlord/overview' || href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  let tabs: NavTab[] = [];

  if (pathname.startsWith('/student')) {
    tabs = [
      { name: 'Overview', href: '/student/overview', icon: Building2 },
      { name: 'Explore', href: '/student/explore', icon: Search },
      {
        name: 'Inspections',
        href: '/student/inspections',
        icon: CalendarCheck,
        badge: activeInspectionsCount > 0 ? activeInspectionsCount : undefined,
      },
      { name: 'Bookings', href: '/student/bookings', icon: BookmarkCheck },
      { name: 'Profile', href: '/student/profile', icon: User },
    ];
  } else if (pathname.startsWith('/landlord')) {
    tabs = [
      { name: 'Overview', href: '/landlord/overview', icon: Building2 },
      { name: 'Properties', href: '/landlord/properties', icon: Home },
      { name: 'Rooms', href: '/landlord/rooms', icon: BedDouble },
      {
        name: 'Inspections',
        href: '/landlord/inspections',
        icon: CalendarCheck,
        badge: pendingInspectionsCount > 0 ? pendingInspectionsCount : undefined,
      },
      { name: 'Profile', href: '/landlord/profile', icon: User },
    ];
  } else if (pathname.startsWith('/admin')) {
    tabs = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: ShieldCheck },
      { name: 'Verifications', href: '/admin/verifications', icon: FileCheck2 },
      { name: 'Properties', href: '/admin/properties', icon: Building2 },
      { name: 'Disputes', href: '/admin/reports', icon: AlertTriangle },
      { name: 'Logs', href: '/admin/audit-logs', icon: History },
    ];
  } else {
    // Public / Visitor tabs
    const accountHref = isAuthenticated
      ? effectiveRole === 'landlord'
        ? '/landlord/overview'
        : '/student/overview'
      : '/login';

    tabs = [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Explore', href: '/explore', icon: Search },
      { name: 'Campuses', href: '/universities', icon: GraduationCap },
      { name: 'Saved', href: '/student/favourites', icon: Heart },
      { name: isAuthenticated ? 'Account' : 'Sign In', href: accountHref, icon: User },
    ];
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl px-2 pt-1.5 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] transition-colors"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isLinkActive(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 ${active
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
                }`}
            >
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${active
                  ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[62px]">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
