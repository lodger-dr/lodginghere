import React from 'react';
import { BedDouble, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandlordRoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Room Inventory & Availability</h1>
          <p className="text-xs text-slate-500">
            Manage individual rooms, codes, capacity, and live vacancy status.
          </p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5" disabled>
          <Plus className="h-4 w-4" />
          <span>Add Room</span>
        </Button>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          <BedDouble className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-bold text-sm text-slate-900">Add a property first</h3>
          <p className="text-xs text-slate-500">
            Rooms attach to specific properties. Once you create a property, you can add individual rooms and configure
            their codes (e.g. Room 101, Block B Room 4) and availability.
          </p>
        </div>
      </div>
    </div>
  );
}

