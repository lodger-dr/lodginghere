import React from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  BookmarkCheck,
  Heart,
  Search,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function StudentOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
        <p className="text-xs text-slate-500">
          Track your lodge inspections, saved properties, and booking confirmation status.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Active Inspections</span>
              <p className="text-2xl font-extrabold text-slate-900">0</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Confirmed Bookings</span>
              <p className="text-2xl font-extrabold text-slate-900">0</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BookmarkCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Saved Lodges</span>
              <p className="text-2xl font-extrabold text-slate-900">0</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Heart className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action & Status Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            <h3 className="font-bold text-sm text-emerald-950">Ready to find your accommodation?</h3>
          </div>
          <p className="text-xs text-emerald-800">
            Browse verified listings around your campus and schedule a physical inspection with accountable landlords.
          </p>
        </div>
        <Link href="/explore">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shrink-0">
            <Search className="h-4 w-4" />
            <span>Explore Lodges</span>
          </Button>
        </Link>
      </div>

      {/* Inspection Rules Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Inspection Before Booking Guarantee</CardTitle>
          <CardDescription className="text-xs">
            In accordance with platform rules, booking a room is disabled until you have attended and recorded a completed physical inspection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <span>Schedule your preferred date & time directly with the verified landlord.</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <span>Inspect the exact room, water access, security, and electricity facilities.</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <span>Mark completion mutually with the landlord to unlock room booking.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

