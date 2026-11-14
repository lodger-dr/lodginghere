'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Building2 } from 'lucide-react';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { useDevRole } from '@/lib/dev-role';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role } = useDevRole();
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith('/student') ||
    pathname.startsWith('/landlord') ||
    pathname.startsWith('/admin');

  const isLinkActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 dark:bg-slate-900/95 dark:border-slate-800 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Hamburger */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo />

          {/* Navigation Links: ONLY shown on public views, hidden in dashboard */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-6 ml-4">
              <Link
                href="/explore"
                className={`text-xs font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  isLinkActive('/explore')
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Explore Lodges
              </Link>
              <Link
                href="/universities"
                className={`text-xs font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  isLinkActive('/universities')
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Universities
              </Link>
              <Link
                href="/how-it-works"
                className={`text-xs font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  isLinkActive('/how-it-works')
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                How It Works
              </Link>
            </nav>
          )}
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5">
          {/* Action Button: Show Portal link on public pages; Show Explore Lodges on dashboard */}
          {!isDashboard ? (
            <Link href={role === 'student' ? '/student/overview' : '/landlord/overview'}>
              <button
                type="button"
                className="hidden sm:inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors"
              >
                {role === 'student' ? 'Student Portal' : 'Landlord Portal'}
              </button>
            </Link>
          ) : (
            <Link href="/explore">
              <button
                type="button"
                className="hidden sm:inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors"
              >
                Explore Lodges
              </button>
            </Link>
          )}

          {/* Account Role Badge: automatically carries the role selected at signup */}
          <Link
            href={role === 'student' ? '/student/profile' : '/landlord/profile'}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            title={`Account role: ${role === 'student' ? 'Student' : 'Landlord'}`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="capitalize">{role === 'student' ? 'Student' : 'Landlord'}</span>
          </Link>

          {/* Workspace Pill */}
          <div className="hidden md:flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <Building2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>LodgeHere</span>
          </div>

          {/* Dark Mode Toggle (Moon / Sun) */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isDashboard ? 'Dashboard Menu' : 'Navigation'}
            </span>
            <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="capitalize">{role === 'student' ? 'Student' : 'Landlord'}</span>
            </div>
          </div>

          {/* Mobile Links: Dashboard-specific when in dashboard; Public links when on public site */}
          {isDashboard ? (
            <div className="space-y-1">
              {pathname.startsWith('/student') && (
                <>
                  <Link
                    href="/student/overview"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/student/inspections"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    My Inspections
                  </Link>
                  <Link
                    href="/student/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/student/favourites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Favourites
                  </Link>
                  <Link
                    href="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Profile Settings
                  </Link>
                </>
              )}
              {pathname.startsWith('/landlord') && (
                <>
                  <Link
                    href="/landlord/overview"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/landlord/properties"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    My Properties
                  </Link>
                  <Link
                    href="/landlord/rooms"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Rooms & Vacancy
                  </Link>
                  <Link
                    href="/landlord/inspections"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Inspection Requests
                  </Link>
                  <Link
                    href="/landlord/verification"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Identity & Authority
                  </Link>
                  <Link
                    href="/landlord/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Provider Profile
                  </Link>
                </>
              )}
              {pathname.startsWith('/admin') && (
                <>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/verifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Provider Verifications
                  </Link>
                  <Link
                    href="/admin/properties"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Property Approvals
                  </Link>
                  <Link
                    href="/admin/reports"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Reports & Disputes
                  </Link>
                  <Link
                    href="/admin/audit-logs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Audit Logs
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Explore Lodges
              </Link>
              <Link
                href="/universities"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Universities
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                How It Works
              </Link>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {!isDashboard ? (
              <Link
                href={role === 'student' ? '/student/overview' : '/landlord/overview'}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Open {role === 'student' ? 'Student' : 'Landlord'} Dashboard
              </Link>
            ) : (
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center rounded-lg border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
              >
                Explore Lodges (Public Site)
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
