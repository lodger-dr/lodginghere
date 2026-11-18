'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  LogOut,
  ChevronLeft,
  Building2,
  SlidersHorizontal,
  Compass,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { CommandMenu } from './command-menu';
import { useAuth } from '@/context/auth-context';
import { useDevRole } from '@/lib/dev-role';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { user, profile, role: authRole, isAuthenticated, signOut } = useAuth();
  const { role: devRole, switchRole } = useDevRole();
  const pathname = usePathname();
  const router = useRouter();

  const effectiveRole = authRole || devRole || 'student';
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'My Account';
  const initialLetter = displayName.charAt(0).toUpperCase();

  // Listen for Command+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine if on a sub-route where a back button makes sense
  const isRootTab =
    pathname === '/' ||
    pathname === '/explore' ||
    pathname === '/student/overview' ||
    pathname === '/landlord/overview' ||
    pathname === '/admin/dashboard';

  const isLodgeDetail = pathname.startsWith('/lodges/');

  const getPageTitle = () => {
    if (pathname === '/') return 'LodgeHere';
    if (pathname === '/explore') return 'Explore Lodges';
    if (pathname === '/universities') return 'Campuses';
    if (pathname === '/how-it-works') return 'How It Works';
    if (pathname.startsWith('/student/overview')) return 'Student Portal';
    if (pathname.startsWith('/student/inspections')) return 'My Inspections';
    if (pathname.startsWith('/student/bookings')) return 'Room Bookings';
    if (pathname.startsWith('/student/favourites')) return 'Saved Lodges';
    if (pathname.startsWith('/student/profile')) return 'My Profile';
    if (pathname.startsWith('/landlord/overview')) return 'Landlord Portal';
    if (pathname.startsWith('/landlord/properties')) return 'My Properties';
    if (pathname.startsWith('/landlord/rooms')) return 'Rooms & Vacancy';
    if (pathname.startsWith('/landlord/inspections')) return 'Inspection Requests';
    if (pathname.startsWith('/landlord/verification')) return 'Verification';
    if (pathname.startsWith('/landlord/profile')) return 'Host Profile';
    if (pathname.startsWith('/admin')) return 'Admin Console';
    if (pathname === '/login') return 'Sign In';
    if (pathname === '/register') return 'Create Account';
    if (pathname === '/onboarding') return 'Get Started';
    return 'LodgeHere';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 dark:bg-slate-900/95 dark:border-slate-800/80 backdrop-blur-xl transition-colors">
        <div className="flex h-14 items-center justify-between px-3 sm:px-4">
          {/* Left: Back button (if subpage) or Brand Logo */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isRootTab ? (
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}

            <Link href="/" className="flex items-center gap-1.5">
              <Logo />
            </Link>
          </div>

          {/* Center Title (Clean Mobile Header) */}
          <div className="flex-1 text-center truncate px-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
              {getPageTitle()}
            </span>
          </div>

          {/* Right: Search, Theme Toggle, and Profile/More Menu */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Quick search"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* More / Menu Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Quick Drawer / More Sheet */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200/90 bg-white/98 px-4 pt-3 pb-6 space-y-3 dark:border-slate-800 dark:bg-slate-900/98 shadow-xl animate-in slide-in-from-top-2 duration-150">
            {/* Search Trigger inside drawer */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setCommandOpen(true);
              }}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400" />
                <span>Search lodges, campuses...</span>
              </div>
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono dark:border-slate-700 dark:bg-slate-900">
                ⌘K
              </kbd>
            </button>

            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-2xs">
                      {initialLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate capitalize">
                        {effectiveRole} Account
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-1 text-xs text-rose-600 font-semibold px-2 py-1 rounded hover:bg-rose-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                {/* Persona Switcher inside Mobile App */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-850/50 p-2 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                    Persona Switcher
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('student');
                        setMobileMenuOpen(false);
                        router.push('/student/overview');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold text-center transition-all ${effectiveRole === 'student'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      Student View
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('landlord');
                        setMobileMenuOpen(false);
                        router.push('/landlord/overview');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold text-center transition-all ${effectiveRole === 'landlord'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      Landlord View
                    </button>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <Link
                    href="/explore"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Compass className="h-4 w-4 text-slate-400" />
                    <span>Explore Lodges</span>
                  </Link>
                  <Link
                    href="/universities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span>Universities Directory</span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    <span>How It Works & Pricing</span>
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span>Admin Moderation Console</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <Link
                    href="/explore"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Compass className="h-4 w-4 text-slate-400" />
                    <span>Explore Lodges</span>
                  </Link>
                  <Link
                    href="/universities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span>Universities Directory</span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    <span>How It Works</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 py-2.5 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Command K Search & Action Palette */}
      <CommandMenu isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
