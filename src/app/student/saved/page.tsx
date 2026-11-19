'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bookmark,
  MapPin,
  Trash2,
  ExternalLink,
  Map,
  List,
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  CalendarCheck,
} from 'lucide-react';
import { Lodge } from '@/types/database';
import { getAllAvailableLodges, fetchLodges } from '@/lib/data/lodges-data';
import { formatNaira } from '@/lib/utils';
import { LodgeMap } from '@/components/maps/lodge-map';

export default function StudentSavedPage() {
  const [allLodges, setAllLodges] = useState<Lodge[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedLodge, setSelectedLodge] = useState<Lodge | null>(null);

  useEffect(() => {
    // 1. Read saved IDs from localStorage
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('lodgehere_saved_lodges');
        if (raw) setSavedIds(JSON.parse(raw));
      } catch {}
    }

    // 2. Load lodges
    const load = () => {
      setAllLodges(getAllAvailableLodges());
      fetchLodges().then((data) => {
        if (data && data.length > 0) setAllLodges(data);
      });
    };
    load();

    const handleDataChange = () => setAllLodges(getAllAvailableLodges());
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  const savedLodges = useMemo(() => {
    return allLodges.filter((lodge) => savedIds.includes(lodge.id));
  }, [allLodges, savedIds]);

  const handleRemoveSaved = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = savedIds.filter((i) => i !== id);
    setSavedIds(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lodgehere_saved_lodges', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('lodgehere-data-change'));
      } catch {}
    }
  };

  return (
    <div className="space-y-5 px-3 pt-2 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#24272B]">
            Saved Places
          </h1>
          <p className="text-xs text-slate-500">
            {savedLodges.length} {savedLodges.length === 1 ? 'lodge' : 'lodges'} saved for comparison
          </p>
        </div>

        {/* List / Map view toggle */}
        {savedLodges.length > 0 && (
          <div className="flex items-center p-1 bg-white rounded-xl border border-[#E8E8E5] shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-[#F45B2A] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#24272B]'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#F45B2A] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#24272B]'
              }`}
              title="Map view"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedLodges.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E8E8E5] bg-white p-10 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A]">
            <Bookmark className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-xs mx-auto">
            <h3 className="font-extrabold text-base text-[#24272B]">No saved places yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tap the bookmark or heart icon on any accommodation marker on the discovery map to save it here.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-[#F45B2A] hover:bg-[#DE4C1D] text-white font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <Search className="h-4 w-4" />
            <span>Explore Campus Lodges</span>
          </Link>
        </div>
      ) : viewMode === 'map' ? (
        /* Map View of Saved Lodges */
        <div className="space-y-3">
          <LodgeMap
            lodges={savedLodges}
            selectedLodgeId={selectedLodge?.id}
            onSelectLodge={(l) => setSelectedLodge(l)}
            height="460px"
            radiusMiles={10}
            className="shadow-md"
          />
          {selectedLodge && (
            <div className="p-3.5 bg-white rounded-2xl border border-[#E8E8E5] shadow-md flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black text-[#24272B] truncate">{selectedLodge.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{selectedLodge.address}</p>
                <p className="text-xs font-bold text-[#F45B2A] mt-0.5">
                  {formatNaira(selectedLodge.pricing.min_price)} / yr
                </p>
              </div>
              <Link
                href={`/lodges/${selectedLodge.slug}`}
                className="py-2 px-3.5 bg-[#F45B2A] text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-xs"
              >
                View
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* List View of Saved Lodges */
        <div className="space-y-3">
          {savedLodges.map((lodge) => (
            <div
              key={lodge.id}
              className="bg-white rounded-3xl border border-[#E8E8E5] p-3.5 shadow-sm hover:border-[#F45B2A] transition-all flex flex-col sm:flex-row gap-3.5"
            >
              <div className="relative h-40 sm:h-28 sm:w-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                <Image
                  src={
                    lodge.images[0] ||
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={lodge.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 150px"
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 text-[9px] font-black uppercase text-[#F45B2A] bg-white/95 px-2 py-0.5 rounded-full shadow-xs">
                  {lodge.accommodation_type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-[#24272B] leading-snug">
                      {lodge.title}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveSaved(lodge.id, e)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove from saved"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{lodge.distance_to_campus}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E8E8E5]">
                  <div>
                    <span className="text-sm font-extrabold text-[#24272B]">
                      {formatNaira(lodge.pricing.min_price)}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">/ year</span>
                  </div>

                  <Link
                    href={`/lodges/${lodge.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#F45B2A] hover:underline"
                  >
                    <span>View lodge</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
