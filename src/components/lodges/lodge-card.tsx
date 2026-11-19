'use client';

import React, { useState } from 'react';
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
  const [isFavorited, setIsFavorited] = useState(false);

  const primaryImage =
    lodge.images[0] ||
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const totalUpfront =
    lodge.pricing.min_price +
    (lodge.pricing.caution_deposit || 0) +
    (lodge.pricing.service_charge || 0) +
    (lodge.pricing.legal_agency_fee || 0);

  const hasReviews = typeof lodge.review_count === 'number' && lodge.review_count > 0 && lodge.rating;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700">
      {/* Property Cover Image */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10">
        <img
          src={primaryImage}
          alt={`Exterior photograph of ${lodge.title} student lodge`}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {lodge.landlord_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#24272B] shadow-sm backdrop-blur-md border border-[#E8E8E5]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F45B2A]" aria-hidden="true" />
              <span>Verified Owner</span>
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-[#24272B]/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            {TYPE_LABELS[lodge.accommodation_type] || lodge.accommodation_type}
          </span>
        </div>

        {/* Top-Right Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-150 z-10 active:scale-90 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#F45B2A] focus-visible:outline-none border border-[#E8E8E5] ${isFavorited
            ? 'bg-[#FFF0E9] text-[#F45B2A] shadow-xs'
            : 'bg-white/95 text-slate-700 hover:text-[#F45B2A] hover:bg-white'
            }`}
          aria-label="Save to favourites"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-[#F45B2A] text-[#F45B2A]' : ''}`} aria-hidden="true" />
        </button>

        {/* Bottom Availability Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          {lodge.available_rooms > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#24272B]/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F45B2A] animate-pulse" aria-hidden="true" />
              <span>{lodge.available_rooms} room{lodge.available_rooms > 1 ? 's' : ''} vacant</span>
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-800/90 px-2.5 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-md">
              Fully Occupied
            </span>
          )}
        </div>
      </div>

      {/* Lodge Details */}
      <div className="flex flex-1 flex-col pt-3.5 px-1 space-y-2.5">
        {/* Row 1: Title & Price */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/lodges/${lodge.slug}`}
            className="flex-1 min-w-0 focus-visible:ring-2 focus-visible:ring-[#F45B2A] focus-visible:outline-none rounded"
          >
            <h3 className="font-bold text-base text-[#24272B] group-hover:text-[#F45B2A] transition-colors truncate">
              {lodge.title}
            </h3>
          </Link>
          <div className="text-right shrink-0">
            <span className="text-base font-black text-[#F45B2A] tracking-tight tabular-nums">
              {formatNaira(lodge.pricing.min_price)}
            </span>
            <span className="text-xs text-slate-500 font-medium"> / yr</span>
          </div>
        </div>

        {/* Row 2: Location & Total Upfront */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1 min-w-0 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F45B2A]" aria-hidden="true" />
            <span className="truncate">{lodge.neighbourhood} • {lodge.distance_to_campus}</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-500">
              Total: <span className="font-bold text-[#24272B] tabular-nums">{formatNaira(totalUpfront)}</span>
            </span>
          </div>
        </div>

        {/* Row 3: Reviews Status & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pt-2 border-t border-[#E8E8E5]">
          <div className="shrink-0">
            {hasReviews ? (
              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-[#24272B] tabular-nums">
                  {lodge.rating?.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500 tabular-nums">
                  ({lodge.review_count} {lodge.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-[#F45B2A]" aria-hidden="true" />
                <span className="font-semibold text-slate-700">Verified Listing</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            <button
              type="button"
              onClick={() => onBookInspection?.(lodge)}
              className="inline-flex items-center gap-1 rounded-full bg-[#24272B] hover:bg-[#1a1c1e] text-white px-3 sm:px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all active:scale-[0.96] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#F45B2A] focus-visible:outline-none"
            >
              <CalendarCheck className="h-3 w-3 text-[#F45B2A]" aria-hidden="true" />
              <span>Inspect</span>
            </button>
            <Link
              href={`/lodges/${lodge.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-[#E8E8E5] bg-white hover:bg-[#FFF0E9] hover:border-[#F45B2A]/40 text-[#24272B] hover:text-[#F45B2A] px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#F45B2A] focus-visible:outline-none"
            >
              <span>Details</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
