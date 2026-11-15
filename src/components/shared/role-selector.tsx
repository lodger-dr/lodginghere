'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Building2, Check, ArrowRight, ShieldCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDevRole, DevRole } from '@/lib/dev-role';

/**
 * Modern startup segmented control for Navbar and headers.
 */
export function NavbarRoleSelector() {
  const { role, switchRole, mounted } = useDevRole();
  const router = useRouter();

  if (!mounted) {
    return <div className="h-9 w-44 rounded-full bg-slate-100 animate-pulse" />;
  }

  const handleSelectRole = (newRole: DevRole) => {
    switchRole(newRole);
    if (newRole === 'student') {
      router.push('/student/overview');
    } else {
      router.push('/landlord/overview');
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Segmented Persona Pill Switcher */}
      <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/80 text-xs">
        <button
          type="button"
          onClick={() => handleSelectRole('student')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all duration-200 ${role === 'student'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          title="Switch to Student view"
        >
          <User className="h-3.5 w-3.5" />
          <span>Student</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectRole('landlord')}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all duration-200 ${role === 'landlord'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          title="Switch to Landlord view"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Landlord</span>
        </button>
      </div>

      {/* Direct Portal Link */}
      <Link href={role === 'student' ? '/student/overview' : '/landlord/overview'}>
        <Button
          size="sm"
          className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-semibold text-xs px-4 h-9 gap-1.5 shadow-xs transition-transform active:scale-95"
        >
          <span>{role === 'student' ? 'Student Portal' : 'Landlord Portal'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}

/**
 * Mobile-friendly selector for mobile drawer.
 */
export function MobileRoleSelector({ onSelect }: { onSelect?: () => void }) {
  const { role, switchRole } = useDevRole();
  const router = useRouter();

  const handleSelectRole = (newRole: DevRole) => {
    switchRole(newRole);
    if (onSelect) onSelect();
    if (newRole === 'student') {
      router.push('/student/overview');
    } else {
      router.push('/landlord/overview');
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Active Workspace
        </span>
        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
          Instant Access
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleSelectRole('student')}
          className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-semibold border transition-all ${role === 'student'
              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
          <User className="h-4 w-4" />
          <span>Student</span>
          {role === 'student' && <Check className="h-3.5 w-3.5 ml-auto text-white" />}
        </button>

        <button
          type="button"
          onClick={() => handleSelectRole('landlord')}
          className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-semibold border transition-all ${role === 'landlord'
              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Landlord</span>
          {role === 'landlord' && <Check className="h-3.5 w-3.5 ml-auto text-white" />}
        </button>
      </div>

      <Link
        href={role === 'student' ? '/student/overview' : '/landlord/overview'}
        onClick={onSelect}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-black transition-colors"
      >
        <span>Open {role === 'student' ? 'Student' : 'Landlord'} Dashboard</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/**
 * Full page selection view for /login, /register, and onboarding.
 */
export function RoleSelectionView({
  title = 'Choose Your Experience',
  subtitle = 'Select whether you are searching for verified student accommodation, or managing properties as a landlord.',
}: {
  title?: string;
  subtitle?: string;
}) {
  const { role, switchRole } = useDevRole();
  const router = useRouter();

  const handleChoose = (selectedRole: DevRole) => {
    switchRole(selectedRole);
    if (selectedRole === 'student') {
      router.push('/student/overview');
    } else {
      router.push('/landlord/overview');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>LodgeHere Verified Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Experience Card */}
        <div
          onClick={() => handleChoose('student')}
          className={`cursor-pointer rounded-3xl border bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${role === 'student' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-slate-300'
            }`}
        >
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <User className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Student</h3>
                {role === 'student' && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Discover verified lodges around campuses, check upfront fees, and schedule physical inspections.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Search verified campus listings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Zero hidden agency fees</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Schedule physical inspections</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleChoose('student');
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-xs font-semibold text-white transition-colors hover:bg-black shadow-xs focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              <span>Continue as Student</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Landlord Experience Card */}
        <div
          onClick={() => handleChoose('landlord')}
          className={`cursor-pointer rounded-3xl border bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${role === 'landlord' ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-slate-300'
            }`}
        >
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Landlord</h3>
                {role === 'landlord' && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                List campus accommodation, manage room inventory, and coordinate student inspections.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                <span>Publish verified lodge listings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                <span>Live room vacancy management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600 shrink-0" aria-hidden="true" />
                <span>Direct student inspection bookings</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleChoose('landlord');
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-xs font-semibold text-white transition-colors hover:bg-black shadow-xs focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              <span>Continue as Landlord</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Explicit Form & Account Consent Notice */}
      <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2">
        By continuing, you agree to LodgeHere&apos;s{' '}
        <Link href="/terms" className="font-semibold text-blue-600 underline dark:text-blue-400 hover:text-blue-700">
          Terms of Service
        </Link>
        ,{' '}
        <Link href="/privacy" className="font-semibold text-blue-600 underline dark:text-blue-400 hover:text-blue-700">
          Privacy Policy
        </Link>
        , and{' '}
        <Link href="/cookies" className="font-semibold text-blue-600 underline dark:text-blue-400 hover:text-blue-700">
          Cookie Policy
        </Link>
        .
      </p>
    </div>
  );
}
