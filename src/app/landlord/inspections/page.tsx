'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Phone,
  Mail,
  User,
  MapPin,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  X,
} from 'lucide-react';
import { getInspections, fetchInspections, updateInspectionStatus } from '@/lib/data/lodges-data';
import { Inspection, InspectionStatus, InspectionTimeSlot } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function LandlordInspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  // Reschedule Modal State
  const [rescheduleTarget, setRescheduleTarget] = useState<Inspection | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState<InspectionTimeSlot>('afternoon');
  const [rescheduleNote, setRescheduleNote] = useState('');

  // Accept with note modal state
  const [acceptTarget, setAcceptTarget] = useState<Inspection | null>(null);
  const [acceptNote, setAcceptNote] = useState('Confirmed. Caretaker will be on-site to guide you.');

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

  const handleConfirmAccept = () => {
    if (!acceptTarget) return;
    updateInspectionStatus(acceptTarget.id, 'accepted', {
      landlord_notes: acceptNote.trim(),
    });
    setAcceptTarget(null);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleTarget || !rescheduleDate) return;
    updateInspectionStatus(rescheduleTarget.id, 'reschedule_requested', {
      rescheduled_date: rescheduleDate,
      rescheduled_time_slot: rescheduleSlot,
      landlord_notes: rescheduleNote.trim() || 'Landlord proposed a more convenient time slot.',
    });
    setRescheduleTarget(null);
  };

  const handleMarkCompleted = (id: string) => {
    updateInspectionStatus(id, 'completed');
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to decline this inspection request?')) {
      updateInspectionStatus(id, 'rejected');
    }
  };

  const filteredInspections = inspections.filter((insp) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return insp.status === 'pending' || insp.status === 'reschedule_requested';
    if (activeTab === 'accepted') return insp.status === 'accepted';
    if (activeTab === 'completed') return insp.status === 'completed';
    return true;
  });

  const pendingCount = inspections.filter(
    (i) => i.status === 'pending' || i.status === 'reschedule_requested'
  ).length;
  const acceptedCount = inspections.filter((i) => i.status === 'accepted').length;
  const completedCount = inspections.filter((i) => i.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Student Inspection Requests</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Review student appointments, accept inspection slots, propose reschedules, and record completed physical visits.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Pending Response</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Confirmed & Scheduled</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{acceptedCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Inspections</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{completedCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          All Requests ({inspections.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'pending'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'accepted'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Confirmed Appointments ({acceptedCount})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'completed'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Inspection Requests List */}
      <div className="space-y-4">
        {filteredInspections.length > 0 ? (
          <div className="space-y-4">
            {filteredInspections.map((insp) => {
              const isPending = insp.status === 'pending';
              const isAccepted = insp.status === 'accepted';
              const isRescheduled = insp.status === 'reschedule_requested';
              const isCompleted = insp.status === 'completed';

              return (
                <div
                  key={insp.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Left: Student & Lodge Info */}
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={
                        insp.property_image ||
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={insp.property_title}
                      className="h-20 w-24 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                    />

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                            <Clock className="h-3 w-3" />
                            <span>Action Required</span>
                          </span>
                        )}
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Confirmed & Scheduled</span>
                          </span>
                        )}
                        {isRescheduled && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
                            <RotateCcw className="h-3 w-3" />
                            <span>Reschedule Sent to Student</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Visit Finished</span>
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md dark:bg-emerald-950/60 dark:text-emerald-400">
                          {insp.property_title}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{insp.student_name}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{insp.student_phone}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{insp.student_email}</span>
                          </span>
                        </div>
                      </div>

                      {/* Appointment Time */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 pt-1">
                        <CalendarCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          Requested for {insp.requested_date} ({insp.time_slot} slot)
                        </span>
                      </div>

                      {insp.student_notes && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                          <strong className="text-slate-800 dark:text-white">Student Note:</strong> &quot;{insp.student_notes}&quot;
                        </div>
                      )}

                      {insp.landlord_notes && (
                        <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                          <strong className="text-emerald-950 dark:text-white">Your Caretaker Instructions:</strong> {insp.landlord_notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    {isPending && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setAcceptTarget(insp)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs h-8 px-3 gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Accept & Confirm</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRescheduleTarget(insp);
                            setRescheduleDate(insp.requested_date);
                          }}
                          className="text-xs h-8 px-2.5 gap-1"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Reschedule</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(insp.id)}
                          className="text-xs h-8 px-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          Decline
                        </Button>
                      </>
                    )}

                    {isAccepted && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkCompleted(insp.id)}
                        className="bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-xs h-8 px-3 gap-1 text-white"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 dark:text-white" />
                        <span>Mark Inspection Completed</span>
                      </Button>
                    )}

                    <Link href={`/lodges/${insp.property_slug}`}>
                      <Button size="sm" variant="ghost" className="text-xs h-8 px-2 text-slate-500 dark:text-slate-400">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <CalendarCheck className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">No requests in this category</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                When students schedule physical inspections on your approved lodges, they will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Accept & Add Note Modal */}
      {acceptTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setAcceptTarget(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Inspection Slot</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confirm {acceptTarget.requested_date} ({acceptTarget.time_slot}) for student{' '}
                <strong className="text-slate-800 dark:text-slate-200">{acceptTarget.student_name}</strong>.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Caretaker Note or Meeting Location
              </label>
              <textarea
                value={acceptNote}
                onChange={(e) => setAcceptNote(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setAcceptTarget(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmAccept} className="bg-emerald-600 hover:bg-emerald-700">
                Confirm & Notify Student
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setRescheduleTarget(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Propose Alternative Inspection Date</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Suggest an alternative date and time for <strong className="text-slate-800 dark:text-slate-200">{rescheduleTarget.student_name}</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Proposed New Date *</label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Proposed Time Slot *</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value as InspectionTimeSlot)}
                  className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                  <option value="evening">Evening (4:00 PM - 6:30 PM)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reason / Note for Student</label>
                <textarea
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  placeholder="e.g. I will be out of town on your requested date. Can we do this day instead?"
                  rows={2}
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setRescheduleTarget(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmReschedule} className="bg-blue-600 hover:bg-blue-700">
                Send Reschedule Offer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
