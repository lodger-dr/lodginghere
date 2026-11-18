import React from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Building2,
  AlertTriangle,
  History,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Administration</h1>
        <p className="text-xs text-slate-400">
          Supervise provider identity verification, property listing review, user reports, and audit logs.
        </p>
      </div>

      {/* Metrics Row (2x2 Mobile App Grid) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Verifications</span>
            <FileCheck2 className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">0</p>
          <span className="text-[10px] text-slate-500 block truncate">Identity & docs</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Pending</span>
            <Building2 className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-white">0</p>
          <span className="text-[10px] text-slate-500 block truncate">Awaiting review</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Approved</span>
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-white">0</p>
          <span className="text-[10px] text-slate-500 block truncate">Live listings</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Reports</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-xl font-bold text-white">0</p>
          <span className="text-[10px] text-slate-500 block truncate">Open flags</span>
        </div>
      </div>

      {/* Action Queues */}
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white">Verification Queue</h3>
              <p className="text-xs text-slate-400">Review landlord identity and ownership documents</p>
            </div>
            <Link href="/admin/verifications">
              <Button size="sm" variant="outline" className="border-slate-700 bg-slate-900 text-slate-200">
                View Queue
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-500 italic py-4 text-center">No pending verifications to review</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white">Property Review Queue</h3>
              <p className="text-xs text-slate-400">Moderate submitted property listings</p>
            </div>
            <Link href="/admin/properties">
              <Button size="sm" variant="outline" className="border-slate-700 bg-slate-900 text-slate-200">
                View Queue
              </Button>
            </Link>
          </div>
          <p className="text-xs text-slate-500 italic py-4 text-center">No pending property listings to moderate</p>
        </div>
      </div>
    </div>
  );
}

