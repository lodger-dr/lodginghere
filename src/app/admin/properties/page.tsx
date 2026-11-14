import React from 'react';
import { Building2 } from 'lucide-react';

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Property Review Queue</h1>
        <p className="text-xs text-slate-400">
          Moderate submitted accommodation listings before they appear in public search.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-12 text-center space-y-3">
        <Building2 className="mx-auto h-8 w-8 text-slate-600" />
        <h3 className="font-bold text-sm text-slate-300">Listing moderation queue empty</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Properties submitted by landlords will appear here for you to verify charges, location accuracy, and photos.
        </p>
      </div>
    </div>
  );
}

