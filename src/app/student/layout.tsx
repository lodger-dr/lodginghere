'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Search,
  Heart,
  CalendarCheck,
  BookmarkCheck,
  User,
  ArrowRightLeft,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { Logo } from '@/components/shared/logo';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => pathname === href;

  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/student/overview', icon: Building2 },
      ],
    },
    {
      title: 'DISCOVERY',
      items: [
        { name: 'Explore Lodges', href: '/student/explore', icon: Search },
        { name: 'Universities', href: '/student/universities', icon: Building2 },
      ],
    },
    {
      title: 'ACCOMMODATION',
      items: [
        { name: 'Favourites', href: '/student/favourites', icon: Heart },
        { name: 'My Inspections', href: '/student/inspections', icon: CalendarCheck },
        { name: 'My Bookings', href: '/student/bookings', icon: BookmarkCheck },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Profile Settings', href: '/student/profile', icon: User },
      ],
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Dojah-style Left Navigation Sidebar */}
      <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0 hidden md:flex md:flex-col justify-between transition-colors">
        <div className="space-y-4">
          {/* Grouped Sidebar Navigation */}
          <div className="space-y-5">
            {sections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 block">
                  {sec.title}
                </span>
                <nav className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const active = isLinkActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition-colors ${active
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200 font-medium'
                          }`}
                      >
                        <Icon className={`h-4 w-4 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User Card (Dojah style) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <Link
            href="/landlord/overview"
            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Switch to Landlord workspace"
          >
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="h-3.5 w-3.5 text-slate-400" />
              <span>Switch to Landlord</span>
            </span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
              Role
            </span>
          </Link>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                D
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Daniel Okafor</p>
                <p className="text-[10px] text-slate-400 truncate">daniel@lodgehere.ng</p>
              </div>
            </div>
            <Link href="/" title="Public view">
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl">{children}</main>
    </div>
  );
}
