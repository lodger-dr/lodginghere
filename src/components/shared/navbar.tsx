'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, LogOut } from 'lucide-react';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { CommandMenu } from './command-menu';
import { useAuth } from '@/context/auth-context';
import { useDevRole } from '@/lib/dev-role';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { user, profile, role: authRole, isAuthenticated, signOut } = useAuth();
  const { role: devRole } = useDevRole();
  const pathname = usePathname();

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

  const isDashboard = Boolean(
    pathname &&
    (pathname.startsWith('/student') ||
      pathname.startsWith('/landlord') ||
      pathname.startsWith('/admin'))
  );

  const isLinkActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/90 dark:bg-slate-900/90 dark:border-slate-800/70 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Logo />
          </div>

          {/* Middle: Nav Links & Search Bar (Centered) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {!isDashboard && (
              <nav className="flex items-center gap-5 lg:gap-7">
                <Link
                  href="/explore"
                  className={`text-xs font-medium transition-colors hover:text-slate-900 dark:hover:text-white ${isLinkActive('/explore')
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                  Explore Lodges
                </Link>
                <Link
                  href="/universities"
                  className={`text-xs font-medium transition-colors hover:text-slate-900 dark:hover:text-white ${isLinkActive('/universities')
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                  Universities
                </Link>
                <Link
                  href="/how-it-works"
                  className={`text-xs font-medium transition-colors hover:text-slate-900 dark:hover:text-white ${isLinkActive('/how-it-works')
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                  How It Works
                </Link>
              </nav>
            )}

            {/* Compact Search Trigger */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-slate-100/70 hover:bg-slate-100/90 px-3.5 py-1.5 text-xs text-slate-500 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-2xs"
            >
              <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors shrink-0" />
              <span className="text-slate-400 dark:text-slate-400 text-xs truncate max-w-[140px] lg:max-w-[180px]">
                Search lodges...
              </span>
              <kbd className="ml-1 inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:border-slate-700 dark:bg-slate-900 shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Auth Controls & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isDashboard ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-4 py-1.5 text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            ) : isAuthenticated ? (
              <>
                {/* Account Role Badge */}
                <Link
                  href={effectiveRole === 'student' ? '/student/profile' : '/landlord/profile'}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title={`Account role: ${effectiveRole === 'student' ? 'Student' : 'Landlord'}`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="capitalize">{effectiveRole}</span>
                </Link>

                {/* User Profile Pill & Sign Out */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href={effectiveRole === 'student' ? '/student/profile' : '/landlord/profile'}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 transition-colors shadow-2xs"
                    title={displayName}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {initialLetter}
                    </div>
                    <span className="hidden md:inline max-w-[90px] truncate">{displayName}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 dark:border-slate-800 dark:bg-slate-900">
            {/* Mobile Search Button */}
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
                <span>Quick search lodges, campuses...</span>
              </div>
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono dark:border-slate-700 dark:bg-slate-900">
                ⌘K
              </kbd>
            </button>

            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {initialLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
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

                <div className="space-y-1 pt-1">
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

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={effectiveRole === 'student' ? '/student/overview' : '/landlord/overview'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Open {effectiveRole === 'student' ? 'Student' : 'Landlord'} Dashboard
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-3 pt-1">
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

      {/* Global Command K Quick Actions Modal */}
      <CommandMenu isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
