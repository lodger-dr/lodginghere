'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  FileCheck2,
  AlertTriangle,
  History,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ShieldCheck },
    { name: 'Provider Verifications', href: '/admin/verifications', icon: FileCheck2 },
    { name: 'Property Approvals', href: '/admin/properties', icon: Building2 },
    { name: 'Reports & Disputes', href: '/admin/reports', icon: AlertTriangle },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row bg-slate-900 text-slate-100">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 p-3 sm:p-4 shrink-0 space-y-3 md:space-y-6">
        <div className="flex items-center justify-between md:block space-y-0 md:space-y-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">
            Admin Console
          </span>
          <h2 className="hidden md:block text-base font-bold text-white pt-1">Platform Moderation</h2>
          <Link
            href="/"
            className="md:hidden flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Marketplace</span>
          </Link>
        </div>

        <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 md:gap-3 rounded-lg px-2.5 md:px-3 py-1.5 md:py-2 text-xs font-medium transition-colors shrink-0 whitespace-nowrap ${isActive
                    ? 'bg-slate-800 text-white border border-slate-700 font-semibold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block border-t border-slate-800 pt-4">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl pb-24 md:pb-8">{children}</main>
    </div>
  );
}

