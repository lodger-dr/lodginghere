'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { getInspections, fetchInspections, updateInspectionStatus } from '@/lib/data/lodges-data';
import { Inspection, InspectionStatus } from '@/types/database';

export default function StudentEnquiriesPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rescheduled'>('all');

  const loadData = () => {
    setInspections(getInspections());
    fetchInspections().then((data) => {
      if (data && data.length > 0) setInspections(data);
    });
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => setInspections(getInspections());
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  const handleAcceptReschedule = (inspection: Inspection) => {
    if (inspection.rescheduled_date) {
      updateInspectionStatus(inspection.id, 'accepted', {
        rescheduled_date: undefined,
        landlord_notes: `Student confirmed rescheduled time: ${inspection.rescheduled_date} (${inspection.rescheduled_time_slot})`,
      });
    }
  };

  const handleCancelEnquiry = (id: string) => {
    if (confirm('Are you sure you want to cancel this accommodation enquiry / inspection?')) {
      updateInspectionStatus(id, 'cancelled');
    }
  };

  const filtered = inspections.filter((insp) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return insp.status === 'pending';
    if (activeTab === 'accepted') return insp.status === 'accepted';
    if (activeTab === 'rescheduled') return insp.status === 'reschedule_requested';
    return true;
  });

  const pendingCount = inspections.filter((i) => i.status === 'pending').length;
  const acceptedCount = inspections.filter((i) => i.status === 'accepted').length;
  const rescheduledCount = inspections.filter((i) => i.status === 'reschedule_requested').length;

  return (
    <div className="space-y-5 px-3 pt-2 pb-16">
      {/* Header */}
      <div className="space-y-0.5">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#24272B]">
          Enquiries &amp; Visits
        </h1>
        <p className="text-xs text-slate-500">
          Track landlord responses, physical inspection appointments and property visits.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="rounded-2xl border border-[#E8E8E5] bg-[#FFF0E9]/60 p-3.5 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-[#F45B2A] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-[#24272B]">Zero-Payment Rule Before Inspection</p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Never transfer rent or caution deposit before physically stepping into the room and verifying the landlord in person.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'all', label: 'All', count: inspections.length },
          { key: 'pending', label: 'Pending', count: pendingCount },
          { key: 'accepted', label: 'Confirmed', count: acceptedCount },
          { key: 'rescheduled', label: 'Rescheduled', count: rescheduledCount },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-[#F45B2A] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-[#E8E8E5] hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && <span className="ml-1 opacity-80">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E8E8E5] bg-white p-10 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#F45B2A]">
            <MessageSquare className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-xs mx-auto">
            <h3 className="font-extrabold text-base text-[#24272B]">No enquiries found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When you express interest in a lodge or request a physical inspection, the status and appointment updates will appear here.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-[#F45B2A] hover:bg-[#DE4C1D] text-white font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <Search className="h-4 w-4" />
            <span>Discover Lodges</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => {
            const isPending = item.status === 'pending';
            const isAccepted = item.status === 'accepted';
            const isRescheduled = item.status === 'reschedule_requested';
            const isCancelled = item.status === 'cancelled';

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#E8E8E5] p-4 shadow-xs space-y-3 hover:border-[#F45B2A] transition-all"
              >
                {/* Top: Property Name & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-[#24272B] truncate">
                      {item.property_title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{item.property_address}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                      isAccepted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isRescheduled
                        ? 'bg-[#FFF0E9] text-[#F45B2A] border border-[#F45B2A]/30'
                        : isCancelled
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isAccepted
                      ? 'Confirmed Visit'
                      : isRescheduled
                      ? 'Reschedule Proposed'
                      : isCancelled
                      ? 'Cancelled'
                      : 'Pending Response'}
                  </span>
                </div>

                {/* Details & Time Slot */}
                <div className="p-3 bg-[#F8F8F6] rounded-2xl border border-[#E8E8E5] space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#F45B2A] shrink-0" />
                    <span className="font-bold text-[#24272B]">Requested Time:</span>
                    <span>
                      {item.requested_date} ({item.time_slot.replace('_', ' ')})
                    </span>
                  </div>

                  {item.rescheduled_date && (
                    <div className="flex items-center gap-2 text-[#F45B2A] font-bold">
                      <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        Landlord Proposed: {item.rescheduled_date} (
                        {item.rescheduled_time_slot?.replace('_', ' ')})
                      </span>
                    </div>
                  )}

                  {item.landlord_notes && (
                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-[#E8E8E5]">
                      <span className="font-bold text-[#24272B]">Host Note:</span> {item.landlord_notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    href={`/lodges/${item.property_slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#F45B2A] hover:underline"
                  >
                    <span>View Property Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {isRescheduled && (
                      <button
                        type="button"
                        onClick={() => handleAcceptReschedule(item)}
                        className="py-1.5 px-3 rounded-xl bg-[#F45B2A] text-white font-bold text-xs shadow-xs hover:bg-[#DE4C1D]"
                      >
                        Accept New Time
                      </button>
                    )}

                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleCancelEnquiry(item.id)}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-600 p-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
