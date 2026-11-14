import React from 'react';
import Link from 'next/link';
import { CalendarCheck, Search, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentInspectionsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Inspection Requests</h1>
        <p className="text-xs text-slate-500">
          Track inspection appointments, landlord responses, and mutual completion status.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <CalendarCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-bold text-sm text-slate-900">No scheduled inspections</h3>
          <p className="text-xs text-slate-500">
            When you find a lodge you like, request an inspection to view the rooms and facilities in person.
          </p>
        </div>
        <Link href="/explore">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Search className="h-4 w-4" />
            <span>Find a Lodge to Inspect</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

