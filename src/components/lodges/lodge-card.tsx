'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  MapPin,
  BedDouble,
  Droplets,
  Sun,
  Zap,
  Lock,
  Wifi,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { Lodge, AmenityKey } from '@/types/database';
import { formatNaira } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LodgeCardProps {
  lodge: Lodge;
  onBookInspection?: (lodge: Lodge) => void;
}

const AMENITY_ICONS: Record<AmenityKey, React.ComponentType<{ className?: string }>> = {
  running_water: Droplets,
  solar_inverter: Sun,
  generator: Zap,
  security_guard: ShieldCheck,
  gated_compound: Lock,
  prepaid_meter: Zap,
  wifi: Wifi,
  wardrobe: BedDouble,
  tiled_floor: CheckCircle2,
  kitchen_cabinet: CheckCircle2,
};

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

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Image with Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={lodge.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {lodge.landlord_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Lodge</span>
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
            {TYPE_LABELS[lodge.accommodation_type] || lodge.accommodation_type}
          </span>
        </div>

        {/* Room Availability Pill */}
        <div className="absolute bottom-3 right-3">
          {lodge.available_rooms > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {lodge.available_rooms} room{lodge.available_rooms > 1 ? 's' : ''} left
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-xs">
              Fully Occupied
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        {/* Title & Distance */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lodge.distance_to_campus}</span>
          </div>
          <Link href={`/lodges/${lodge.slug}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {lodge.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-1">{lodge.address}</p>
        </div>

        {/* Top Amenities Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {lodge.amenities.slice(0, 4).map((amenity) => {
            const Icon = AMENITY_ICONS[amenity] || CheckCircle2;
            const label = amenity.replace(/_/g, ' ');
            return (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-100 capitalize"
              >
                <Icon className="h-3 w-3 text-emerald-600" />
                <span>{label}</span>
              </span>
            );
          })}
          {lodge.amenities.length > 4 && (
            <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-100">
              +{lodge.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Price & Actions (sticks to bottom) */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Annual Rent
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                {formatNaira(lodge.pricing.min_price)}
              </span>
              <span className="text-xs font-normal text-slate-500">/ yr</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              Zero hidden agent fees
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/lodges/${lodge.slug}`}>
              <Button size="sm" variant="outline" className="text-xs h-9 px-3 gap-1 hover:border-emerald-500 hover:text-emerald-700">
                <span>View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            {onBookInspection && (
              <Button
                size="sm"
                onClick={() => onBookInspection(lodge)}
                className="bg-emerald-600 hover:bg-emerald-700 text-xs h-9 px-3 gap-1 shadow-xs"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>Inspect</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
