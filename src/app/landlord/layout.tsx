'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  BedDouble,
  CalendarCheck,
  ShieldCheck,
  User,
  ArrowRightLeft,
  Search,
} from 'lucide-react';

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
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 border-r border-slate-200/80 bg-white p-5 shrink-0 space-y-6">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-800">
            <Building2 className="h-3.5 w-3.5 text-slate-700" />
            <span>Landlord Portal</span>
          </span>
          <h2 className="text-base font-extrabold text-slate-900 pt-1.5">Property Management</h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 pt-4 space-y-2">
          <Link
            href="/student/overview"
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 transition-colors"
          >
            <ArrowRightLeft className="h-4 w-4 text-slate-500" />
            <span>Switch to Student Portal</span>
          </Link>
          <Link
            href="/"
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span>Browse All Lodges</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-5xl">{children}</main>
    </div>
  );
}
