'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  BookmarkCheck,
  Heart,
  Search,
  ShieldCheck,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getInspections, fetchInspections } from '@/lib/data/lodges-data';
import { Inspection } from '@/types/database';

export default function StudentOverviewPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);

  useEffect(() => {
    const load = () => {
      setInspections(getInspections());
      fetchInspections().then((data) => setInspections(data));
    };
    load();

    const handleDataChange = () => {
      setInspections(getInspections());
    };
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  const activeInspections = inspections.filter(
    (i) => i.status === 'pending' || i.status === 'accepted' || i.status === 'reschedule_requested'
  );

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
              <p className="text-2xl font-extrabold text-slate-900">{activeInspections.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Completed Inspections</span>
              <p className="text-2xl font-extrabold text-emerald-600">
                {inspections.filter((i) => i.status === 'completed').length}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BookmarkCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Requests</span>
              <p className="text-2xl font-extrabold text-purple-600">{inspections.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inspections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Inspection Appointments</h2>
          <Link href="/student/inspections">
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-emerald-700">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {activeInspections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeInspections.slice(0, 2).map((insp) => (
              <div
                key={insp.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={insp.property_image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                    alt={insp.property_title}
                    className="h-14 w-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        insp.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {insp.status === 'accepted' ? 'Confirmed by Landlord' : 'Awaiting Response'}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 truncate">{insp.property_title}</h4>
                    <p className="text-[11px] text-slate-500">
                      {insp.requested_date} ({insp.time_slot})
                    </p>
                  </div>
                </div>

                <Link href="/student/inspections">
                  <Button size="sm" variant="outline" className="text-xs h-8 px-2.5">
                    Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
            No active inspection requests. Find a lodge and schedule a free inspection.
          </div>
        )}
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
