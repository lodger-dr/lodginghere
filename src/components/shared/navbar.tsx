'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, ShieldCheck } from 'lucide-react';
import { NavbarRoleSelector, MobileRoleSelector } from './role-selector';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Title */}
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
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isLinkActive('/explore') ? 'text-emerald-600 font-semibold' : 'text-slate-600'
              }`}
          >
            Explore Lodges
          </Link>
          <Link
            href="/universities"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isLinkActive('/universities') ? 'text-emerald-600 font-semibold' : 'text-slate-600'
              }`}
          >
            Universities
          </Link>
          <Link
            href="/how-it-works"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isLinkActive('/how-it-works') ? 'text-emerald-600 font-semibold' : 'text-slate-600'
              }`}
          >
            How It Works
          </Link>
        </nav>

        {/* Role Selector (Testing Mode: Student vs Landlord) */}
        <div className="hidden md:flex items-center gap-3">
          <NavbarRoleSelector />
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
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-4">
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
            <MobileRoleSelector onSelect={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
