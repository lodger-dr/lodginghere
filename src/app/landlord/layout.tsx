'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Home,
  BedDouble,
  CalendarCheck,
  ShieldCheck,
  User,
  ArrowRightLeft,
  ExternalLink,
} from 'lucide-react';

interface LandlordLayoutProps {
  children: React.ReactNode;
}

export default function LandlordLayout({ children }: LandlordLayoutProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/landlord/overview') return pathname === href;
    return pathname.startsWith(href);
  };

  const menuGroups = [
    {
      label: 'PORTFOLIO MANAGEMENT',
      items: [
        { name: 'Dashboard Overview', href: '/landlord/overview', icon: Building2 },
        { name: 'Properties', href: '/landlord/properties', icon: Home },
        { name: 'Rooms & Vacancy', href: '/landlord/rooms', icon: BedDouble },
      ],
    },
    {
      label: 'STUDENT PIPELINE',
      items: [
        { name: 'Inspection Requests', href: '/landlord/inspections', icon: CalendarCheck },
        { name: 'Identity & Authority', href: '/landlord/verification', icon: ShieldCheck },
      ],
    },
    {
      label: 'PREFERENCES',
      items: [
        { name: 'Provider Profile', href: '/landlord/profile', icon: User },
      ],
    },
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Ambient background light gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/15" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-80 w-80 rounded-full bg-emerald-500/8 blur-3xl dark:bg-emerald-500/10" />

      {/* Frosted Glass Left Navigation Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 hidden md:flex md:flex-col justify-between transition-colors z-20">
        <div className="space-y-6">
          <div className="space-y-6">
            {menuGroups.map((group) => (
              <div key={group.label} className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                  {group.label}
                </span>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isLinkActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all ${active
                            ? 'bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 font-bold shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200 font-medium'
                          }`}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors ${active
                              ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950'
                              : 'text-slate-400 dark:text-slate-500'
                            }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate">{item.name}</span>
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User Card */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
          <Link
            href="/student/overview"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:bg-slate-800/60 transition-colors"
            title="Switch to Student workspace"
          >
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="h-3.5 w-3.5 text-slate-400" />
              <span>Switch to Student</span>
            </span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
              Role
            </span>
          </Link>

          <div className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-200/60 bg-white/60 dark:border-slate-800/60 dark:bg-slate-800/40 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                A
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Chief Adebayo</p>
                <p className="text-[10px] text-slate-400 truncate">adebayo@lodgehere.ng</p>
              </div>
            </div>
            <Link href="/" title="Public view">
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex-1 p-4 sm:p-6 md:p-8 max-w-6xl z-10 pb-24 md:pb-8">{children}</main>

      {/* Mobile Bottom Navigation Bar (iOS/Android style native tab bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-1 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { name: 'Overview', href: '/landlord/overview', icon: Building2 },
          { name: 'Properties', href: '/landlord/properties', icon: Building2 },
          { name: 'Rooms', href: '/landlord/rooms', icon: BedDouble },
          { name: 'Inspections', href: '/landlord/inspections', icon: CalendarCheck },
          { name: 'Profile', href: '/landlord/profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = isLinkActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl transition-all ${active
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
                }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${active
                    ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950'
                    : 'text-slate-500 dark:text-slate-400'
                  }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
