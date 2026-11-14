import React from 'react';
import { FileCheck2 } from 'lucide-react';

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Provider Verification Queue</h1>
        <p className="text-xs text-slate-400">
          Inspect submitted government ID and property authority evidence before approving provider status.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-12 text-center space-y-3">
        <FileCheck2 className="mx-auto h-8 w-8 text-slate-600" />
        <h3 className="font-bold text-sm text-slate-300">All submissions reviewed</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          When landlords submit identity documents or authority documents, they appear here for your approval or rejection.
        </p>
      </div>
    </div>
  );
}

