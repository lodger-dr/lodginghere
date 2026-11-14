'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Building2, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDevRole, DevRole } from '@/lib/dev-role';

/**
 * Compact toggle button group for Navbar and headers.
 */
export function NavbarRoleSelector() {
  const { role, switchRole, mounted } = useDevRole();
  const router = useRouter();

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-32 rounded-lg bg-slate-100 animate-pulse" />
      </div>
    );
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
    <div className="flex items-center gap-2">
      {/* Dev Mode Badge */}
      <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
        <Sparkles className="h-3 w-3 text-amber-500" />
        <span>Testing Mode</span>
      </span>

      {/* Role Switcher Pill */}
      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
        <button
          type="button"
          onClick={() => handleSelectRole('student')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
            role === 'student'
              ? 'bg-white text-emerald-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Switch to Student testing persona"
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Student</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectRole('landlord')}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
            role === 'landlord'
              ? 'bg-white text-emerald-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Switch to Landlord testing persona"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Landlord</span>
        </button>
      </div>

      {/* Quick link into active portal */}
      {role === 'student' ? (
        <Link href="/student/overview">
          <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Student Portal</span>
          </Button>
        </Link>
      ) : (
        <Link href="/landlord/overview">
          <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs">
            <Building2 className="h-3.5 w-3.5" />
            <span>Landlord Portal</span>
          </Button>
        </Link>
      )}
    </div>
  );
}

/**
 * Mobile-friendly selector for mobile navigation menu.
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
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Testing Role
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          No login needed
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleSelectRole('student')}
          className={`flex items-center justify-center gap-2 rounded-lg p-2.5 text-xs font-semibold border transition-all ${
            role === 'student'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="h-4 w-4 text-emerald-600" />
          <span>Student</span>
          {role === 'student' && <Check className="h-3.5 w-3.5 text-emerald-600 ml-auto" />}
        </button>

        <button
          type="button"
          onClick={() => handleSelectRole('landlord')}
          className={`flex items-center justify-center gap-2 rounded-lg p-2.5 text-xs font-semibold border transition-all ${
            role === 'landlord'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Building2 className="h-4 w-4 text-emerald-600" />
          <span>Landlord</span>
          {role === 'landlord' && <Check className="h-3.5 w-3.5 text-emerald-600 ml-auto" />}
        </button>
      </div>

      <Link
        href={role === 'student' ? '/student/overview' : '/landlord/overview'}
        onClick={onSelect}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
      >
        <span>Open {role === 'student' ? 'Student' : 'Landlord'} Dashboard</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/**
 * Full page / card role selector used for /login, /register, or hero onboarding.
 */
export function RoleSelectionView({
  title = 'Testing Stage: Select Who You Are',
  subtitle = 'Login and registration are bypassed for development. Select your persona to test all features of the app:',
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
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Development & Testing Stage Active</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Option */}
        <Card
          className={`cursor-pointer transition-all hover:border-emerald-500 hover:shadow-md ${
            role === 'student' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : ''
          }`}
          onClick={() => handleChoose('student')}
        >
          <CardHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center justify-between">
                <span>Student</span>
                {role === 'student' && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Explore campus lodges, schedule physical inspections, and manage booking records.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Explore verified lodges around campuses</li>
              <li>Schedule physical inspections</li>
              <li>View transparent rent, caution & agency fees</li>
              <li>Track mutual room booking confirmations</li>
            </ul>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleChoose('student');
              }}
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 mt-2"
            >
              <span>Continue as Student</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Landlord Option */}
        <Card
          className={`cursor-pointer transition-all hover:border-emerald-500 hover:shadow-md ${
            role === 'landlord' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : ''
          }`}
          onClick={() => handleChoose('landlord')}
        >
          <CardHeader className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center justify-between">
                <span>Landlord / Manager</span>
                {role === 'landlord' && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                List lodges, configure room availability, and respond to student inspections.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Create property listings with clear fees</li>
              <li>Manage rooms and live availability</li>
              <li>Accept or reschedule student inspections</li>
              <li>Submit identity & authority documents</li>
            </ul>

            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleChoose('landlord');
              }}
              className="w-full gap-2 mt-2"
            >
              <span>Continue as Landlord</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-xs text-slate-500">
        <span>
          💡 In testing stage, you can seamlessly switch between Student and Landlord roles anytime from the header
          selector.
        </span>
      </div>
    </div>
  );
}
