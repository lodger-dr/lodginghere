'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  BedDouble,
  CalendarCheck,
  ShieldAlert,
  ShieldCheck,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getLodges, getInspections } from '@/lib/data/lodges-data';
import { Lodge, Inspection } from '@/types/database';

export default function LandlordOverviewPage() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);

  useEffect(() => {
    const load = () => {
      setLodges(getLodges());
      setInspections(getInspections());
    };
    load();

    const handleDataChange = () => load();
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  const totalRooms = lodges.reduce((acc, l) => acc + (l.total_rooms || 0), 0);
  const totalAvailable = lodges.reduce((acc, l) => acc + (l.available_rooms || 0), 0);
  const pendingInspections = inspections.filter(
    (i) => i.status === 'pending' || i.status === 'reschedule_requested'
  ).length;

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
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Add Property Listing</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Properties</span>
              <p className="text-2xl font-black text-slate-900">{lodges.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Available Vacancies</span>
              <p className="text-2xl font-black text-emerald-600">{totalAvailable}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BedDouble className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-700">Pending Inspections</span>
              <p className="text-2xl font-black text-amber-600">{pendingInspections}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Alert Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 mt-0.5">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900">Provider Verification Active</h4>
            <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
              Your provider profile is marked verified. Your lodges and rooms are publicly discoverable on the explore page and ready for student inspection booking.
            </p>
          </div>
        </div>
        <Link href="/landlord/verification">
          <Button size="sm" variant="outline" className="border-amber-300 bg-white text-amber-900 shrink-0">
            View Documents
          </Button>
        </Link>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Manage Lodge Listings</h3>
            <p className="text-xs text-slate-500">
              Update photos, transparent pricing, distances to university gates, and amenities.
            </p>
          </div>
          <Link href="/landlord/properties">
            <Button size="sm" variant="outline" className="text-xs gap-1.5 text-emerald-700">
              <span>View All Properties ({lodges.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Room Vacancy & Codes</h3>
            <p className="text-xs text-slate-500">
              Add individual units (e.g. Room 101), set rents, and toggle vacancies when students move in.
            </p>
          </div>
          <Link href="/landlord/rooms">
            <Button size="sm" variant="outline" className="text-xs gap-1.5 text-emerald-700">
              <span>Manage Room Inventory ({totalRooms})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
