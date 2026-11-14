'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { getInspections, fetchInspections, updateInspectionStatus } from '@/lib/data/lodges-data';
import { Inspection, InspectionStatus } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentInspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rescheduled' | 'completed'>('all');

  const loadData = () => {
    setInspections(getInspections());
    fetchInspections().then((data) => setInspections(data));
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => {
      setInspections(getInspections());
    };
    window.addEventListener('lodgehere-data-change', handleDataChange);
    return () => window.removeEventListener('lodgehere-data-change', handleDataChange);
  }, []);

  const handleAcceptReschedule = (inspection: Inspection) => {
    if (inspection.rescheduled_date) {
      updateInspectionStatus(inspection.id, 'accepted', {
        rescheduled_date: undefined,
        landlord_notes: `Student accepted rescheduled time: ${inspection.rescheduled_date} (${inspection.rescheduled_time_slot})`,
      });
    }
  };

  const handleCancelInspection = (id: string) => {
    if (confirm('Are you sure you want to cancel this inspection request?')) {
      updateInspectionStatus(id, 'cancelled');
    }
  };

  const filteredInspections = inspections.filter((insp) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return insp.status === 'pending';
    if (activeTab === 'accepted') return insp.status === 'accepted';
    if (activeTab === 'rescheduled') return insp.status === 'reschedule_requested';
    if (activeTab === 'completed') return insp.status === 'completed';
    return true;
  });

  const pendingCount = inspections.filter((i) => i.status === 'pending').length;
  const acceptedCount = inspections.filter((i) => i.status === 'accepted').length;
  const rescheduledCount = inspections.filter((i) => i.status === 'reschedule_requested').length;
  const completedCount = inspections.filter((i) => i.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Inspection Requests</h1>
          <p className="text-xs text-slate-500">
            Track physical inspection appointments, landlord responses, and directions to properties.
          </p>
        </div>
        <Link href="/explore">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-xs">
            <Search className="h-4 w-4" />
            <span>Find Another Lodge</span>
          </Button>
        </Link>
      </div>

      {/* Trust Reminder Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Zero-Payment Rule Before Inspection</span>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Never transfer rent, legal fees, or caution deposits before personally walking into the room, testing water taps, and confirming the lock security.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'all'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          All Requests ({inspections.length})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'accepted'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Confirmed / Accepted ({acceptedCount})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'pending'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Awaiting Response ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('rescheduled')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'rescheduled'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Reschedule Proposed ({rescheduledCount})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'completed'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Inspections List */}
      <div className="space-y-4">
        {filteredInspections.length > 0 ? (
          <div className="space-y-4">
            {filteredInspections.map((insp) => {
              const isAccepted = insp.status === 'accepted';
              const isPending = insp.status === 'pending';
              const isRescheduled = insp.status === 'reschedule_requested';
              const isCompleted = insp.status === 'completed';
              const isCancelled = insp.status === 'cancelled';

              return (
                <div
                  key={insp.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all hover:border-slate-300"
                >
                  {/* Left: Thumbnail & Lodge Details */}
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={
                        insp.property_image ||
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={insp.property_title}
                      className="h-20 w-24 rounded-xl object-cover shrink-0 bg-slate-100"
                    />

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Confirmed by Landlord</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                            <Clock className="h-3 w-3" />
                            <span>Awaiting Landlord Response</span>
                          </span>
                        )}
                        {isRescheduled && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                            <RotateCcw className="h-3 w-3" />
                            <span>Landlord Suggested New Time</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Inspection Completed</span>
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                            <XCircle className="h-3 w-3" />
                            <span>Cancelled</span>
                          </span>
                        )}
                      </div>

                      <Link href={`/lodges/${insp.property_slug}`}>
                        <h3 className="font-bold text-base text-slate-900 hover:text-emerald-600 transition-colors truncate">
                          {insp.property_title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{insp.property_address}</span>
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <CalendarCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{insp.requested_date}</span>
                        </span>
                        <span>•</span>
                        <span className="capitalize font-medium text-slate-600">
                          {insp.time_slot} Slot
                        </span>
                      </div>

                      {/* Reschedule Offer Notice */}
                      {isRescheduled && (
                        <div className="mt-2 rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-950 space-y-2">
                          <p className="font-bold flex items-center gap-1 text-blue-900">
                            <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                            <span>
                              Proposed New Date: {insp.rescheduled_date} ({insp.rescheduled_time_slot})
                            </span>
                          </p>
                          {insp.landlord_notes && (
                            <p className="text-[11px] text-blue-800 italic">
                              Landlord note: &quot;{insp.landlord_notes}&quot;
                            </p>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptReschedule(insp)}
                              className="bg-blue-600 hover:bg-blue-700 text-xs h-7 px-2.5"
                            >
                              Accept New Time
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelInspection(insp.id)}
                              className="text-xs h-7 px-2.5 text-slate-600"
                            >
                              Decline Request
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Landlord notes on acceptance */}
                      {isAccepted && insp.landlord_notes && (
                        <div className="mt-1 text-xs text-emerald-800 bg-emerald-50/60 rounded-md p-2 border border-emerald-100">
                          <strong>Caretaker Note:</strong> {insp.landlord_notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Link href={`/lodges/${insp.property_slug}`}>
                      <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
                        <span>View Lodge</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>

                    {(isPending || isAccepted) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancelInspection(insp.id)}
                        className="text-xs h-8 text-red-600 hover:bg-red-50"
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarCheck className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-sm text-slate-900">No inspection requests in this view</h3>
              <p className="text-xs text-slate-500">
                Browse student accommodations around your campus and schedule zero-risk physical inspections before renting.
              </p>
            </div>
            <Link href="/explore">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
                <Search className="h-4 w-4" />
                <span>Explore Approved Lodges</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
