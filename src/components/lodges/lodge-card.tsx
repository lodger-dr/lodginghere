'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Star,
  ArrowRight,
  Heart,
  CalendarCheck,
} from 'lucide-react';
import { Lodge } from '@/types/database';
import { formatNaira } from '@/lib/utils';

interface LodgeCardProps {
  lodge: Lodge;
  onBookInspection?: (lodge: Lodge) => void;
}

const TYPE_LABELS: Record<string, string> = {
  self_contained: 'Self-Contained',
  single_room: 'Single Room',
  shared_apartment: 'Shared Flat',
  one_bedroom: '1-Bedroom Flat',
  two_bedroom: '2-Bedroom Flat',
  hostel: 'Hostel Room',
  other: 'Student Lodge',
};

export function LodgeCard({ lodge, onBookInspection }: LodgeCardProps) {
  const primaryImage =
    lodge.images[0] ||
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const totalUpfront =
    lodge.pricing.min_price +
    (lodge.pricing.caution_deposit || 0) +
    (lodge.pricing.service_charge || 0) +
    (lodge.pricing.legal_agency_fee || 0);

  const rating = lodge.rating || 5.0;
  const reviewCount = lodge.review_count || 18;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Property Cover Image (Matching Template rounded-2xl) */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
        <img
          src={primaryImage}
          alt={lodge.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {lodge.landlord_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-900 shadow-xs backdrop-blur-md dark:bg-slate-900/95 dark:text-white">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verified</span>
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md dark:bg-black/80">
            {TYPE_LABELS[lodge.accommodation_type] || lodge.accommodation_type}
          </span>
        </div>

        {/* Top-Right Favorite Button */}
        <button
          type="button"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-xs backdrop-blur-md transition-colors hover:text-rose-600 hover:bg-white dark:bg-slate-900/90 dark:text-slate-200 dark:hover:text-rose-400 dark:hover:bg-slate-900 cursor-pointer"
          aria-label="Save to favourites"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Bottom Availability Pill */}
        <div className="absolute bottom-3 left-3">
          {lodge.available_rooms > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span>{lodge.available_rooms} room{lodge.available_rooms > 1 ? 's' : ''} available</span>
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
              Occupied
            </span>
          )}
        </div>
      </div>

      {/* Lodge Details (Precise template format: Title & Price on row 1, Location & Upfront on row 2, Stars on row 3) */}
      <div className="flex flex-1 flex-col pt-3.5 px-1 space-y-2.5">
        {/* Row 1: Title & Price */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/lodges/${lodge.slug}`} className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
              {lodge.title}
            </h3>
          </Link>
          <div className="text-right shrink-0">
            <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatNaira(lodge.pricing.min_price)}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">/yr</span>
          </div>
        </div>

        {/* Row 2: Location & Total Upfront */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 min-w-0 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{lodge.neighbourhood} • {lodge.distance_to_campus}</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Total: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatNaira(totalUpfront)}</span>
            </span>
          </div>
        </div>

        {/* Row 3: 5 Amber Stars & Actions (Matching template star rating display) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
              {rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              ({reviewCount})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onBookInspection?.(lodge)}
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 hover:bg-black dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <CalendarCheck className="h-3 w-3" />
              <span>Inspect</span>
            </button>
            <Link
              href={`/lodges/${lodge.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
