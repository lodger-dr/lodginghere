'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
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
    { name: 'Verifications', href: '/admin/verifications', icon: FileCheck2 },
    { name: 'Properties', href: '/admin/properties', icon: Building2 },
    { name: 'Disputes', href: '/admin/reports', icon: AlertTriangle },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-slate-900 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950 p-3 shrink-0 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
            Admin Moderation
          </span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Public App</span>
          </Link>
        </div>

        {/* Mobile Horizontal Tab Navigation */}
        <nav className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors shrink-0 whitespace-nowrap ${isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-2xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 p-3 sm:p-4 w-full pb-24">{children}</main>
    </div>
  );
}
