'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, User, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface NavbarProps {
  initialUserRole?: UserRole | null;
  initialUserEmail?: string | null;
}

export function Navbar({ initialUserRole = null, initialUserEmail = null }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(initialUserRole ?? (initialUserEmail ? 'student' : null));
  const [userEmail, setUserEmail] = useState<string | null>(initialUserEmail);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUserEmail(user.email || null);
          supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile?.role) {
                setUserRole(profile.role as UserRole);
              }
            });
        } else {
          setUserRole(null);
          setUserEmail(null);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email || null);
          supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile?.role) {
                setUserRole(profile.role as UserRole);
              }
            });
        } else {
          setUserRole(null);
          setUserEmail(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Graceful fallback when supabase is unconfigured
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Graceful fallback
    }
    window.location.href = '/login';
  };

  const isLinkActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Title (Neutral category descriptor per instructions: no brand name yet) */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 leading-tight">Student Accommodation</span>
            <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
              Verified Campus Lodges
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/explore"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              isLinkActive('/explore') ? 'text-emerald-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Explore Lodges
          </Link>
          <Link
            href="/universities"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              isLinkActive('/universities') ? 'text-emerald-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Universities
          </Link>
          <Link
            href="/how-it-works"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              isLinkActive('/how-it-works') ? 'text-emerald-600 font-semibold' : 'text-slate-600'
            }`}
          >
            How It Works
          </Link>
        </nav>

        {/* Auth / Profile Actions */}
        <div className="hidden md:flex items-center gap-3">
          {userRole ? (
            <div className="flex items-center gap-3">
              {userRole === 'student' && (
                <Link href="/student/overview">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span>Student Portal</span>
                  </Button>
                </Link>
              )}
              {userRole === 'landlord' && (
                <Link href="/landlord/overview">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <span>Landlord Portal</span>
                  </Button>
                </Link>
              )}
              {userRole === 'admin' && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm" className="gap-2 border-emerald-300 bg-emerald-50 text-emerald-800">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>Admin Dashboard</span>
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="sm" onClick={handleSignOut} title="Sign Out">
                <LogOut className="h-4 w-4 text-slate-500 hover:text-rose-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Explore Lodges
            </Link>
            <Link
              href="/universities"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Universities
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </Link>
          </div>

          <div className="border-t border-slate-200 pt-3">
            {userRole ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-500 px-3">Signed in as {userEmail}</div>
                {userRole === 'student' && (
                  <Link
                    href="/student/overview"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-emerald-700 bg-emerald-50"
                  >
                    <User className="h-5 w-5" />
                    <span>Student Portal</span>
                  </Link>
                )}
                {userRole === 'landlord' && (
                  <Link
                    href="/landlord/overview"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-emerald-700 bg-emerald-50"
                  >
                    <Building2 className="h-5 w-5" />
                    <span>Landlord Portal</span>
                  </Link>
                )}
                {userRole === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-emerald-700 bg-emerald-50"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

