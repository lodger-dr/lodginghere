'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Logo } from './logo';
import { NavbarRoleSelector, MobileRoleSelector } from './role-selector';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Startup Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/explore"
            className={`text-sm font-medium transition-colors hover:text-slate-900 ${isLinkActive('/explore') ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
          >
            Explore Lodges
          </Link>
          <Link
            href="/universities"
            className={`text-sm font-medium transition-colors hover:text-slate-900 ${isLinkActive('/universities') ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
          >
            Universities
          </Link>
          <Link
            href="/how-it-works"
            className={`text-sm font-medium transition-colors hover:text-slate-900 ${isLinkActive('/how-it-works') ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
          >
            How It Works
          </Link>
        </nav>

        {/* Startup Role Selector (Student vs Landlord toggle) */}
        <div className="hidden md:flex items-center gap-3">
          <NavbarRoleSelector />
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Explore Lodges
            </Link>
            <Link
              href="/universities"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Universities
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              How It Works
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <MobileRoleSelector onSelect={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
