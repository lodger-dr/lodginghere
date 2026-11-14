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
  LogOut,
} from 'lucide-react';
import { signOutAction } from '@/app/(auth)/actions';

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
      <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-950 p-4 shrink-0 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full">
            Admin Console
          </span>
          <h2 className="text-base font-bold text-white pt-1">Platform Moderation</h2>
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
                    ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 font-semibold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 pt-4">
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-rose-950/40 hover:text-rose-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit Admin Console</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-5xl">{children}</main>
    </div>
  );
}

