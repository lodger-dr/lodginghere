import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Reports & Flagged Listings</h1>
        <p className="text-xs text-slate-400">
          Investigate reported listings, inaccurate rents, fake availability, or suspicious accounts.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-12 text-center space-y-3">
        <AlertTriangle className="mx-auto h-8 w-8 text-slate-600" />
        <h3 className="font-bold text-sm text-slate-300">No open reports</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          User reports submitted via the marketplace report portal will appear here for investigation.
        </p>
      </div>
    </div>
  );
}
