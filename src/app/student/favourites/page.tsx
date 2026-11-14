import React from 'react';
import Link from 'next/link';
import { Heart, Search, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentFavouritesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Saved Lodges</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Lodges you have saved to compare rent, amenities, and schedule inspections.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
          <Heart className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">No saved lodges yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click the heart icon on any approved lodge in the marketplace to keep track of your choices.
          </p>
        </div>
        <Link href="/explore">
          <Button size="sm" variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            <span>Browse Lodges</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
