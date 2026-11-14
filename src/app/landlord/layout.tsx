'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  BedDouble,
  CalendarCheck,
  BookmarkCheck,
  ShieldCheck,
  User,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import { signOutAction } from '@/app/(auth)/actions';

interface LandlordLayoutProps {
  children: React.ReactNode;
}

export default function LandlordLayout({ children }: LandlordLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/landlord/overview', icon: Building2 },
    { name: 'My Properties', href: '/landlord/properties', icon: Building2 },
    { name: 'Rooms & Availability', href: '/landlord/rooms', icon: BedDouble },
    { name: 'Inspection Requests', href: '/landlord/inspections', icon: CalendarCheck },
    { name: 'Identity & Authority', href: '/landlord/verification', icon: ShieldCheck },
    { name: 'Landlord Profile', href: '/landlord/profile', icon: User },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 border-r border-slate-200 bg-white p-4 shrink-0 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            Landlord Portal
          </span>
          <h2 className="text-base font-bold text-slate-900 pt-1">Property Management</h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
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

        <div className="border-t border-slate-200 pt-4">
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-5xl">{children}</main>
    </div>
  );
}
