import React from 'react';
import Link from 'next/link';
import { BookmarkCheck, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Room Bookings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mutually confirmed room records and agreed terms snapshots.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <BookmarkCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">No active room bookings</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Booking requests require a completed physical inspection first. Once inspected, you can submit a booking
            request for a specific available room.
          </p>
        </div>
        <Link href="/explore">
          <Button size="sm" variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            <span>Discover Lodges</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
