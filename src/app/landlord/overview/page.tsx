import React from 'react';
import Link from 'next/link';
import {
  Building2,
  BedDouble,
  CalendarCheck,
  ShieldAlert,
  ShieldCheck,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LandlordOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Landlord Overview</h1>
          <p className="text-xs text-slate-500">
            Manage your lodges, update room availability, and respond to student inspections.
          </p>
        </div>
        <Link href="/landlord/properties">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Add Property Listing</span>
          </Button>
        </Link>
      </div>

      {/* Verification Alert Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 mt-0.5">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900">Provider Verification Pending</h4>
            <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
              Please submit your government ID and documented authority/ownership proof. Platform administrators must
              verify your provider status before your listings become publicly discoverable to students.
            </p>
          </div>
        </div>
        <Link href="/landlord/verification">
          <Button size="sm" variant="outline" className="border-amber-300 bg-white text-amber-900 shrink-0">
            Submit Documents
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Properties</span>
              <p className="text-2xl font-extrabold text-slate-900">0</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Available Rooms</span>
              <p className="text-2xl font-extrabold text-slate-900">0</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BedDouble className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Pending Inspections</span>
              <p className="text-2xl font-extrabold text-slate-900">0</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Landlord Onboarding Steps</CardTitle>
          <CardDescription className="text-xs">
            Complete the 3 verification and onboarding steps to publish your lodge to students.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                1
              </div>
              <div>
                <p className="font-semibold text-slate-900">Upload Identity & Authority Evidence</p>
                <p className="text-slate-500 text-[11px]">National ID, Voter&apos;s Card, or legal authority letter</p>
              </div>
            </div>
            <Link href="/landlord/verification">
              <Button size="sm" variant="ghost" className="text-xs text-emerald-600">
                Start
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                2
              </div>
              <div>
                <p className="font-semibold text-slate-900">Add Property Details & Transparent Pricing</p>
                <p className="text-slate-500 text-[11px]">Rent, caution deposit, agency & agreement charges</p>
              </div>
            </div>
            <Link href="/landlord/properties">
              <Button size="sm" variant="ghost" className="text-xs text-emerald-600">
                Add
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                3
              </div>
              <div>
                <p className="font-semibold text-slate-900">Setup Rooms & Availability</p>
                <p className="text-slate-500 text-[11px]">Room codes (e.g. A1, A2), private bathroom, status</p>
              </div>
            </div>
            <Link href="/landlord/rooms">
              <Button size="sm" variant="ghost" className="text-xs text-emerald-600">
                Manage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
