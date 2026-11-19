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
      <div className="w-full min-h-[350px] rounded-3xl bg-[#FFF0E9]/40 border border-[#E8E8E5] flex flex-col items-center justify-center gap-3 text-slate-600">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md border border-[#E8E8E5]">
          <MapPin className="h-6 w-6 text-[#F45B2A] animate-bounce" />
        </div>
        <div className="text-center space-y-0.5">
          <span className="text-xs font-bold text-[#24272B]">
            Loading interactive discovery map...
          </span>
          <p className="text-[10px] text-slate-500">Centering around campus accommodation</p>
        </div>
      </div>
    ),
  }
);
