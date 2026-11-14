'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  BedDouble,
  Droplets,
  Zap,
  ArrowRight,
  Heart,
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

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300">
      {/* Property Cover Image */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={primaryImage}
          alt={lodge.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {lodge.landlord_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-900 shadow-xs backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verified</span>
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            {TYPE_LABELS[lodge.accommodation_type] || lodge.accommodation_type}
          </span>
        </div>

        {/* Top-Right Favorite Button */}
        <button
          type="button"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-xs backdrop-blur-md transition-colors hover:text-rose-600 hover:bg-white"
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
              Fully Occupied
            </span>
          )}
        </div>
      </div>

      {/* Lodge Details */}
      <div className="flex flex-1 flex-col pt-4 px-1.5 space-y-3">
        {/* Title & Location */}
        <div className="space-y-1">
          <Link href={`/lodges/${lodge.slug}`}>
            <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
              {lodge.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{lodge.neighbourhood} • {lodge.distance_to_campus}</span>
          </div>
        </div>

        {/* Key Amenities Specs Row */}
        <div className="flex items-center gap-4 py-2 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-slate-400" />
            <span>{TYPE_LABELS[lodge.accommodation_type] || 'Lodge'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-slate-400" />
            <span>Water</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-slate-400" />
            <span>Light</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-2 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {formatNaira(lodge.pricing.min_price)}
              </span>
              <span className="text-xs text-slate-400 font-medium"> / year</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Total upfront</span>
              <span className="text-xs font-semibold text-slate-700">{formatNaira(totalUpfront)}</span>
            </div>
          </div>

          {/* Startup Style Rounded-Pill CTA (matching PrimeHouse "Schedule Visit ->") */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link href={`/lodges/${lodge.slug}`} className="w-full">
              <button
                type="button"
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300"
              >
                View Details
              </button>
            </Link>

            <button
              type="button"
              onClick={() => onBookInspection?.(lodge)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 py-2.5 px-3 text-xs font-semibold text-white transition-colors hover:bg-black shadow-xs active:scale-95"
            >
              <span>Schedule Visit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
