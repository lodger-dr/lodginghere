'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Heart,
  CalendarCheck,
  BookmarkCheck,
  Building2,
  Search,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/student/overview', icon: Building2 },
    { name: 'Explore Lodges', href: '/explore', icon: Search },
    { name: 'Favourites', href: '/student/favourites', icon: Heart },
    { name: 'My Inspections', href: '/student/inspections', icon: CalendarCheck },
    { name: 'My Bookings', href: '/student/bookings', icon: BookmarkCheck },
    { name: 'Profile Settings', href: '/student/profile', icon: User },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row bg-slate-50">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 border-r border-slate-200 bg-white p-4 shrink-0 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Student Persona
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Dev Mode
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 pt-1">My Accommodation</h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 pt-4 space-y-2">
          <Link
            href="/landlord/overview"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <ArrowRightLeft className="h-4 w-4 text-emerald-600" />
            <span>Switch to Landlord Portal</span>
          </Link>
          <Link
            href="/"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span>Public Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Main portal content */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl">{children}</main>
    </div>
  );
}
