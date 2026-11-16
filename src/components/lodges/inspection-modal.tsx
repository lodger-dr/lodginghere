'use client';

import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/context/auth-context';

interface InspectionModalProps {
  lodge: Lodge | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InspectionModal({ lodge, isOpen, onClose, onSuccess }: InspectionModalProps) {
  const { user, profile } = useAuth();

  const [studentName, setStudentName] = useState(() => profile?.full_name || user?.user_metadata?.full_name || '');
  const [studentPhone, setStudentPhone] = useState(() => profile?.phone || user?.user_metadata?.phone || '');
  const [studentEmail, setStudentEmail] = useState(() => user?.email || profile?.email || '');
  // Default to tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<InspectionTimeSlot>('morning');
  const [notes, setNotes] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setIsSubmitted(false);
    setError(null);
    onClose();
  };

  // Populate with authenticated user data when opened
  useEffect(() => {
    if (isOpen && (user || profile)) {
      const meta = user?.user_metadata || {};
      const resolvedName = profile?.full_name || meta.full_name || meta.name || '';
      const resolvedPhone = profile?.phone || meta.phone || '';
      const resolvedEmail = user?.email || profile?.email || '';

      if (resolvedName && !studentName) setStudentName(resolvedName);
      if (resolvedPhone && !studentPhone) setStudentPhone(resolvedPhone);
      if (resolvedEmail && !studentEmail) setStudentEmail(resolvedEmail);
    }
  }, [isOpen, user, profile, studentName, studentPhone, studentEmail]);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !lodge) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim() || !date) {
      setError('Please provide your name, phone number, and requested inspection date.');
      return;
    }

    if (!consentChecked) {
      setError('You must agree to the Terms of Service and Privacy Policy to schedule an inspection.');
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
    } catch {
      setError('Failed to schedule inspection. Please try again.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl space-y-5 border-t sm:border border-slate-200/80 dark:border-slate-800/80 dark:bg-slate-900 dark:text-white pb-safe animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-250">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden -mt-1 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
          aria-label="Close inspection scheduling dialog"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                <CalendarCheck className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                <span>Zero-Commitment Physical Inspection</span>
              </div>
              <h3 id="inspection-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Schedule Lodge Inspection
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Inspect <strong className="text-slate-900 dark:text-white">{lodge.title}</strong> before making any financial commitment.
              </p>
            </div>

            {/* Lodge snippet */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3 dark:border-slate-800 dark:bg-slate-850">
              <img
                src={lodge.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                alt={`Photograph of ${lodge.title}`}
                className="h-14 w-14 rounded-lg object-cover shrink-0"
              />
              <div className="text-xs space-y-0.5 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate">{lodge.title}</p>
                <p className="text-slate-600 dark:text-slate-300 truncate flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                  <span>{lodge.neighbourhood} • {lodge.distance_to_campus}</span>
                </p>
                <p className="text-slate-700 dark:text-slate-300 font-medium">Landlord: {lodge.landlord_name}</p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-3 text-xs text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {/* Contact Details (Minimal strictly necessary data) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Full Name *</label>
                <div className="relative">
                  <Input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Your Full Name"
                    className="text-xs pl-8"
                    required
                  />
                  <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Phone Number *</label>
                <div className="relative">
                  <Input
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+234 812 345 6789"
                    className="text-xs pl-8"
                    required
                  />
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email Address (Optional)</label>
              <div className="relative">
                <Input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="text-xs pl-8"
                />
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Preferred Date *</label>
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
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">Time Window *</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as InspectionTimeSlot)}
                  className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                  <option value="evening">Evening (4:00 PM - 6:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Notes for Landlord (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Coming with a coursemate, interested in a ground floor room..."
                rows={2}
                className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>

            {/* Form Consent Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="inspection-consent"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                required
              />
              <label htmlFor="inspection-consent" className="text-xs text-slate-700 dark:text-slate-300 leading-snug cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="font-semibold text-blue-600 underline dark:text-blue-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="font-semibold text-blue-600 underline dark:text-blue-400">
                  Privacy Policy
                </Link>
                , and consent to sharing my contact details with the verified property manager for this inspection.
              </label>
            </div>

            {/* Safety Reminder */}
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400 mt-0.5" aria-hidden="true" />
              <p>
                <strong>Never pay advance rent before physical inspection.</strong> Physical inspection confirms room availability, water, electricity, and lock security.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={handleReset} className="w-full sm:w-auto rounded-full">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white rounded-full font-semibold px-5 gap-1.5 shadow-xs focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                <span>Confirm Inspection Request</span>
              </Button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inspection Request Sent!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your request to inspect <strong className="text-slate-900 dark:text-white">{lodge.title}</strong> has been logged for{' '}
                <strong className="text-slate-900 dark:text-white">{date}</strong> ({timeSlot}). Landlord{' '}
                <strong className="text-slate-900 dark:text-white">{lodge.landlord_name}</strong> will review and confirm your slot.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-left text-slate-700 space-y-1 max-w-xs mx-auto dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
              <p>
                <strong className="text-slate-900 dark:text-white">Landlord Contact:</strong> {lodge.landlord_phone || '+234 803 234 5678'}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Lodge Address:</strong> {lodge.address}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 pt-3">
              <Link href="/student/inspections" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white gap-1.5 rounded-full">
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  <span>View in My Inspections</span>
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={handleReset} className="w-full sm:w-auto rounded-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
