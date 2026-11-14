import React from 'react';
import { CalendarCheck, Clock, UserCheck } from 'lucide-react';

export default function LandlordInspectionsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inspection Requests</h1>
        <p className="text-xs text-slate-500">
          Respond to student inspection bookings, propose rescheduled times, and confirm completion.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          <CalendarCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-bold text-sm text-slate-900">No pending inspection requests</h3>
          <p className="text-xs text-slate-500">
            When students request to physically inspect your lodges, their requested dates and contact details will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

