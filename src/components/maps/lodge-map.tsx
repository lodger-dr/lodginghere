'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { MapPin } from 'lucide-react';
import type { LeafletMapViewProps } from './leaflet-map-view';

export const LodgeMap = dynamic<LeafletMapViewProps>(
  () => import('./leaflet-map-view').then((mod) => mod.LeafletMapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[350px] rounded-2xl bg-slate-100 dark:bg-slate-850 animate-pulse flex flex-col items-center justify-center gap-2.5 text-slate-400 border border-slate-200 dark:border-slate-800">
        <MapPin className="h-7 w-7 text-blue-500 animate-bounce" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Loading Campus Map...
        </span>
      </div>
    ),
  }
);
