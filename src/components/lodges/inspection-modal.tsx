'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  MapPin,
  AlertCircle,
  Phone,
  User,
  Mail,
} from 'lucide-react';
import { Lodge, InspectionTimeSlot } from '@/types/database';
import { saveInspection } from '@/lib/data/lodges-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InspectionModalProps {
  lodge: Lodge | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InspectionModal({ lodge, isOpen, onClose, onSuccess }: InspectionModalProps) {
  const [studentName, setStudentName] = useState('Daniel Okafor');
  const [studentPhone, setStudentPhone] = useState('+234 814 990 1234');
  const [studentEmail, setStudentEmail] = useState('daniel.student@example.com');
  // Default to tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<InspectionTimeSlot>('morning');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !lodge) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim() || !date) {
      setError('Please provide your name, phone number, and requested inspection date.');
      return;
    }

    try {
      const newInspection = {
        id: `insp-${Date.now()}`,
        property_id: lodge.id,
        property_title: lodge.title,
        property_slug: lodge.slug,
        property_address: lodge.address,
        property_image: lodge.images[0] || '',
        student_id: 'student-current-user',
        student_name: studentName.trim(),
        student_phone: studentPhone.trim(),
        student_email: studentEmail.trim(),
        landlord_id: lodge.landlord_id,
        requested_date: date,
        time_slot: timeSlot,
        status: 'pending' as const,
        student_notes: notes.trim() || undefined,
        created_at: new Date().toISOString(),
      };

      saveInspection(newInspection);
      setIsSubmitted(true);
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to schedule inspection. Please try again.');
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-slate-200">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>Zero-Commitment Physical Inspection</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Schedule Lodge Inspection</h3>
              <p className="text-xs text-slate-500">
                Inspect <strong className="text-slate-800">{lodge.title}</strong> before making any financial commitment.
              </p>
            </div>

            {/* Lodge snippet */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-center gap-3">
              <img
                src={lodge.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                alt={lodge.title}
                className="h-14 w-14 rounded-lg object-cover shrink-0"
              />
              <div className="text-xs space-y-0.5 min-w-0">
                <p className="font-bold text-slate-900 truncate">{lodge.title}</p>
                <p className="text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>{lodge.neighbourhood} • {lodge.distance_to_campus}</span>
                </p>
                <p className="text-emerald-700 font-semibold">Landlord: {lodge.landlord_name}</p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <div className="relative">
                  <Input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Your Full Name"
                    className="text-xs pl-8"
                    required
                  />
                  <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                <div className="relative">
                  <Input
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+234 812 345 6789"
                    className="text-xs pl-8"
                    required
                  />
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="text-xs pl-8"
                />
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Preferred Date *</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Time Window *</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as InspectionTimeSlot)}
                  className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                  <option value="evening">Evening (4:00 PM - 6:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Notes for Landlord (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Coming with my friend, interested in an ensuite room on ground floor..."
                rows={2}
                className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Safety Reminder */}
            <div className="rounded-lg bg-emerald-50/80 p-3 text-[11px] text-emerald-900 border border-emerald-100 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <p>
                <strong>Never pay advance rent before physical inspection.</strong> Physical inspection confirms room availability, water, electricity, and lock security.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
                <CalendarCheck className="h-4 w-4" />
                <span>Confirm Inspection Request</span>
              </Button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-slate-900">Inspection Request Sent!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your request to inspect <strong className="text-slate-800">{lodge.title}</strong> has been logged for{' '}
                <strong className="text-slate-800">{date}</strong> ({timeSlot}). Landlord{' '}
                <strong className="text-slate-800">{lodge.landlord_name}</strong> will review and confirm your slot.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-left text-slate-600 space-y-1 max-w-xs mx-auto">
              <p>
                <strong className="text-slate-800">Landlord Contact:</strong> {lodge.landlord_phone || '+234 803 234 5678'}
              </p>
              <p>
                <strong className="text-slate-800">Lodge Address:</strong> {lodge.address}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <Link href="/student/inspections">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
                  <CalendarCheck className="h-4 w-4" />
                  <span>View in My Inspections</span>
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={handleReset}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
