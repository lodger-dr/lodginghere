import React from 'react';
import { History, ShieldCheck } from 'lucide-react';

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Audit Log</h1>
        <p className="text-xs text-slate-400">
          Immutable audit record of all administrative approvals, rejections, suspensions, and manual overrides.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-12 text-center space-y-3">
        <History className="mx-auto h-8 w-8 text-slate-600" />
        <h3 className="font-bold text-sm text-slate-300">Audit trail active</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Every moderation and verification decision is recorded with timestamps, administrator ID, before/after
          state, and reason notes.
        </p>
      </div>
    </div>
  );
}

