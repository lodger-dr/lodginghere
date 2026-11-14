import React from 'react';
import Link from 'next/link';
import { Building2, Plus, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandlordPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Properties</h1>
          <p className="text-xs text-slate-500">
            Create, edit, and review your student accommodation listings.
          </p>
        </div>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add New Property</span>
        </Button>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-bold text-sm text-slate-900">No properties added yet</h3>
          <p className="text-xs text-slate-500">
            List your lodge with full upfront charges, photos, and university location to start receiving student inspections.
          </p>
        </div>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
          <Plus className="h-4 w-4" />
          <span>Create First Listing</span>
        </Button>
      </div>
    </div>
  );
}
