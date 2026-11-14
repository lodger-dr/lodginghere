'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  MapPin,
  BedDouble,
  Droplets,
  Sun,
  Zap,
  Lock,
  Wifi,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Share2,
  Heart,
  ChevronLeft,
  Phone,
  User,
  ArrowRight,
  AlertTriangle,
  Info,
  Building2,
  Layers,
  Grid,
  Utensils,
} from 'lucide-react';
import { getLodgeBySlug, getRooms, fetchLodges, fetchRooms, AMENITIES_CATALOG } from '@/lib/data/lodges-data';
import { Lodge, Room, AmenityKey } from '@/types/database';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InspectionModal } from '@/components/lodges/inspection-modal';
import { WinningCTA } from '@/components/ui/winning-cta';
import { Accordion, AccordionItem } from '@/components/ui/accordion';

const AMENITY_ICONS: Record<AmenityKey, React.ComponentType<{ className?: string }>> = {
  running_water: Droplets,
  solar_inverter: Sun,
  generator: Zap,
  security_guard: ShieldCheck,
  gated_compound: Lock,
  prepaid_meter: Zap,
  wifi: Wifi,
  wardrobe: Layers,
  tiled_floor: Grid,
  kitchen_cabinet: Utensils,
};

export default function LodgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = () => {
      const found = getLodgeBySlug(slug);
      if (found) {
        setLodge(found);
        setRooms(getRooms(found.id));
      } else {
        // Try fetching from Supabase if not in memory
        fetchLodges().then((all) => {
          const matched = all.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
          if (matched) {
            setLodge(matched);
            fetchRooms(matched.id).then((r) => setRooms(r));
          }
        });
      }
    };
    load();

    const handleDataChange = () => load();
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, [slug]);

  if (!lodge) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Building2 className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lodge Listing Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          The lodge you are searching for may have been archived or is awaiting physical verification review.
        </p>
        <Link href="/explore">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            Browse All Verified Lodges
          </Button>
        </Link>
      </div>
    );
  }

  const images = lodge.images.length > 0 ? lodge.images : [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  ];

  const totalMoveIn =
    lodge.pricing.min_price +
    lodge.pricing.caution_deposit +
    lodge.pricing.service_charge +
    lodge.pricing.legal_agency_fee;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-28 lg:pb-20 dark:bg-slate-950">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <Link href="/explore" className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Back to Lodges</span>
            </Link>
            <span>/</span>
            <span className="truncate">{lodge.university_name}</span>
            <span>/</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{lodge.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                isSaved
                  ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {lodge.landlord_verified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Verified Landlord & Property Surveyed</span>
                </span>
              )}
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-800">
                {lodge.accommodation_type.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800">
                {lodge.available_rooms > 0
                  ? `${lodge.available_rooms} Room${lodge.available_rooms > 1 ? 's' : ''} Vacant`
                  : 'Fully Occupied'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {lodge.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {lodge.distance_to_campus}
              </span>
              <span>•</span>
              <span>{lodge.address}</span>
            </div>
          </div>

          {/* Quick Header Price */}
          <div className="text-left md:text-right shrink-0">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Annual Rent From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {formatNaira(lodge.pricing.min_price)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-normal">/ year</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
              Direct Landlord • ₦0 Agent Fee
            </span>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="space-y-3">
          <div className="relative aspect-16/9 md:aspect-21/9 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-850 shadow-md">
            <img
              src={images[activeImageIndex]}
              alt={`${lodge.title} - photo ${activeImageIndex + 1}`}
              className="h-full w-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-4 right-4 rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
              Photo {activeImageIndex + 1} of {images.length}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                    idx === activeImageIndex
                      ? 'border-emerald-600 shadow-md scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details, Rooms, Amenities, House Rules */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lodge Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">About this Accommodation</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {lodge.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Campus</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lodge.campus_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Neighbourhood</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lodge.neighbourhood}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Total Units</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lodge.total_rooms} Rooms</span>
                </div>
              </div>
            </div>

            {/* Transparent Fees Breakdown (Anti-Agent Scam Feature) */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs space-y-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Strict Transparent Pricing</span>
                  </h2>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400/90">
                    No hidden agency fees, no sudden agreement commissions, no unexpected charges.
                  </p>
                </div>
                <Badge variant="outline" className="border-emerald-300 bg-white text-emerald-800 font-bold dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-400">
                  Guaranteed
                </Badge>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white p-4 space-y-3 text-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Base Annual Rent</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNaira(lodge.pricing.min_price)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block">Caution Deposit</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">100% Refundable at lease expiration</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNaira(lodge.pricing.caution_deposit)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 block">Service & Maintenance Charge</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Covers waste disposal, security, water pump</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{formatNaira(lodge.pricing.service_charge)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">Legal & Agency Commission</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-500">LodgeHere Direct Landlord Guarantee</span>
                  </div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">₦0 (FREE)</span>
                </div>

                <div className="flex items-center justify-between pt-2 text-sm font-black text-slate-900 dark:text-white">
                  <span>Total Transparent Move-in Cost</span>
                  <span className="text-emerald-700 dark:text-emerald-400 text-base">{formatNaira(totalMoveIn)}</span>
                </div>
              </div>
            </div>

            {/* Available Rooms Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Rooms & Current Vacancy</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Specific rooms in this lodge with live availability status.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                  {rooms.length} Room{rooms.length === 1 ? '' : 's'} Configured
                </span>
              </div>

              {rooms.length > 0 ? (
                <div className="space-y-3">
                  {rooms.map((room) => {
                    const isAvailable = room.status === 'available';
                    return (
                      <div
                        key={room.id}
                        className={`rounded-xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isAvailable
                            ? 'border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-850 dark:hover:border-emerald-500/50'
                            : 'border-slate-100 bg-slate-50/70 opacity-75 dark:border-slate-850 dark:bg-slate-900/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{room.room_number}</h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                isAvailable
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {isAvailable ? 'Vacant / Ready' : 'Occupied'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{room.title}</p>
                          {room.features && room.features.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {room.features.map((feat, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                >
                                  {feat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                          <div className="text-left sm:text-right">
                            <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                              {formatNaira(room.annual_rent)}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">per annum</span>
                          </div>

                          {isAvailable ? (
                            <Button
                              size="sm"
                              onClick={() => setIsInspectionModalOpen(true)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-xs h-8 px-3 gap-1"
                            >
                              <CalendarCheck className="h-3.5 w-3.5" />
                              <span>Inspect This Room</span>
                            </Button>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                              Currently Occupied
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
                  <BedDouble className="h-6 w-6 text-slate-400 dark:text-slate-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All room types listed under general pricing</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Book an inspection to view all available vacant layouts with the caretaker.
                  </p>
                </div>
              )}
            </div>

            {/* Secondary Details Folded into Accordions (Order of Operation Hierarchy) */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Property Specifications & Safe Housing Protocols
              </h2>

              <Accordion>
                {/* Accordion 1: Amenities & Facility Features */}
                <AccordionItem
                  title="Full Amenities & Utilities Catalog"
                  subtitle={`${lodge.amenities.length} amenities verified on-premises`}
                  badge="Verified"
                  icon={<Droplets className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                  defaultOpen={true}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    {AMENITIES_CATALOG.map((cat) => {
                      const Icon = AMENITY_ICONS[cat.key] || CheckCircle2;
                      const isIncluded = lodge.amenities.includes(cat.key);
                      return (
                        <div
                          key={cat.key}
                          className={`flex items-center gap-3 rounded-xl border p-3 ${
                            isIncluded
                              ? 'border-emerald-200 bg-emerald-50/30 text-slate-900 font-medium dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-slate-200'
                              : 'border-slate-100 bg-slate-50/50 text-slate-400 dark:border-slate-800 dark:bg-slate-850/30 dark:text-slate-500'
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              isIncluded
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block truncate">{cat.label}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {isIncluded ? 'Provided on-premises' : 'Not available'}
                            </span>
                          </div>
                          {isIncluded ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionItem>

                {/* Accordion 2: Safety Guidelines */}
                <AccordionItem
                  title="Safety & Student Protection Guidelines"
                  subtitle="Strict zero-advance-fee protocol and landlord authority"
                  badge="Anti-Scam"
                  icon={<ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                >
                  <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pt-2">
                    <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/80 border border-amber-200 p-3.5 text-amber-950 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold">Golden Rule: Never pay before physical inspection</span>
                        <p className="text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
                          LodgeHere never asks students to pay rent or deposit into personal accounts before physical
                          verification. Always schedule an inspection, verify the room locks, water flow, and speak with the verified caretaker.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-slate-700 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-300">
                      <Info className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white">Verified Landlord Authority</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          The landlord profile for this lodge has undergone identity and ownership verification by LodgeHere moderators.
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Right Column: Sticky Booking & Landlord Profile Card (Frosted Glass) */}
          <div className="space-y-6">
            <div className="sticky top-20 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl space-y-5 dark:border-slate-800/70 dark:bg-slate-900/80 backdrop-blur-xl">
              <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Transparent Upfront Pricing
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {formatNaira(lodge.pricing.min_price)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ yr</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{lodge.available_rooms} Room{lodge.available_rooms > 1 ? 's' : ''} currently vacant</span>
                </div>
              </div>

              {/* Action Button: Winning CTA with Animated Flying Plane Loop */}
              <div className="space-y-3">
                <WinningCTA
                  onClick={() => setIsInspectionModalOpen(true)}
                  idleText="Schedule Physical Inspection"
                  winText="Claim Your Room Spot — Win!"
                  size="lg"
                  className="w-full"
                />

                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                  Free of charge • Zero advance commitment required
                </p>
              </div>

              {/* Landlord Contact Snippet */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3 text-xs dark:border-slate-800 dark:bg-slate-800/50">
                <span className="font-bold text-slate-900 dark:text-white block">Verified Property Owner</span>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{lodge.landlord_name}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified Landlord</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{lodge.landlord_phone || '+234 803 234 5678'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{lodge.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Inspection Modal */}
      <InspectionModal
        lodge={lodge}
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
      />

      {/* Mobile Fixed Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-4 py-3 shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Annual Rent
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {formatNaira(lodge.pricing.min_price)}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">/ yr</span>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsInspectionModalOpen(true)}
          className="bg-slate-900 hover:bg-black dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-bold text-xs h-10 px-5 gap-1.5 shadow-sm rounded-full"
        >
          <CalendarCheck className="h-4 w-4" />
          <span>Schedule Inspection</span>
        </Button>
      </div>
    </div>
  );
}
