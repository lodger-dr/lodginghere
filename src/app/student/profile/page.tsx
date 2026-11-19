'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Phone,
  Mail,
  Save,
  CheckCircle2,
  Trash2,
  Bell,
  MapPin,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  Download,
  Share,
  Check,
  Sparkles,
  LogOut,
  Sliders,
} from 'lucide-react';
import { NIGERIAN_UNIVERSITIES } from '@/lib/data/nigerian-universities';
import { useAuth } from '@/context/auth-context';
import { updateStudentProfileAction } from '@/app/(auth)/actions';

export default function StudentProfilePage() {
  const { user, profile, refreshProfile, updateProfileState, signOut } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Personal Information
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedUniSlug, setSelectedUniSlug] = useState('abia-state-university');
  const [department, setDepartment] = useState('');

  // Preferences
  const [budgetPreference, setBudgetPreference] = useState('under_100k');
  const [roomTypePreference, setRoomTypePreference] = useState('self_contained');

  // Location & Notification Toggles
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // PWA & Installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Sync state from authenticated user and localStorage
  useEffect(() => {
    if (user || profile) {
      const meta = user?.user_metadata || {};
      const resolvedName = profile?.full_name || meta.full_name || meta.name || '';
      const resolvedPhone = profile?.phone || meta.phone || '';
      const resolvedUni =
        profile?.student_profile?.university_slug ||
        meta.university_slug ||
        (typeof window !== 'undefined' ? localStorage.getItem('lodgehere_user_university') : null) ||
        'abia-state-university';
      const resolvedDept = profile?.student_profile?.department || meta.department || '';

      if (resolvedName && !fullName) setFullName(resolvedName);
      if (resolvedPhone && !phone) setPhone(resolvedPhone);
      if (resolvedUni) setSelectedUniSlug(resolvedUni);
      if (resolvedDept && !department) setDepartment(resolvedDept);
    }

    if (typeof window !== 'undefined') {
      try {
        const rawPrefs = localStorage.getItem('lodgehere_user_preferences');
        if (rawPrefs) {
          const parsed = JSON.parse(rawPrefs);
          if (parsed.budget) setBudgetPreference(parsed.budget);
          if (parsed.accommodationType) setRoomTypePreference(parsed.accommodationType);
          if (parsed.locationEnabled) setLocationEnabled(Boolean(parsed.locationEnabled));
          if (parsed.notificationsEnabled) setNotificationsEnabled(Boolean(parsed.notificationsEnabled));
        }
      } catch { }

      // PWA Standalone check
      const standalone =
        (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
        Boolean((window.navigator as any)?.standalone);
      setIsStandalone(Boolean(standalone));

      // Detect iOS
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIos(/iphone|ipad|ipod/.test(ua));

      // Listen for Android beforeinstallprompt
      const handleInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handleInstallPrompt);
      return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    }
  }, [user, profile]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('universitySlug', selectedUniSlug);
    formData.append('department', department);

    startTransition(async () => {
      try {
        const response = await updateStudentProfileAction(formData);

        if (!response.success) {
          if (response.errors) setFieldErrors(response.errors);
          if (response.message) setErrorMessage(response.message);
          return;
        }

        if (typeof window !== 'undefined' && selectedUniSlug) {
          try {
            localStorage.setItem('lodgehere_user_university', selectedUniSlug);
            localStorage.setItem(
              'lodgehere_user_preferences',
              JSON.stringify({
                budget: budgetPreference,
                accommodationType: roomTypePreference,
                locationEnabled,
                notificationsEnabled,
              })
            );
            window.dispatchEvent(new CustomEvent('lodgehere-data-change'));
          } catch { }
        }

        updateProfileState({
          full_name: fullName,
          phone: phone,
          student_profile: {
            university_slug: selectedUniSlug,
            department: department,
          },
        });

        await refreshProfile();
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } catch {
        setErrorMessage('Failed to save profile. Please check your network and try again.');
      }
    });
  };

  const displayEmail = user?.email || profile?.email || '';

  return (
    <div className="space-y-6 px-3 pt-2 pb-20 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="space-y-0.5">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#24272B]">
          Student Profile
        </h1>
        <p className="text-xs text-slate-500">
          Manage your institution, accommodation preferences and app settings.
        </p>
      </div>

      {/* Save Success Alert */}
      {saved && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 flex items-center gap-2 text-xs font-bold text-rose-800">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. PERSONAL INFORMATION FORM */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8E5] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8E5]">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0E9] text-[#F45B2A]">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#24272B]">Personal Information</h2>
            <p className="text-[11px] text-slate-500">Shared with landlords only when you schedule an inspection</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="fullName" className="block text-xs font-bold text-[#24272B]">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Chioma Adeyemi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] text-xs sm:text-sm text-[#24272B] focus:outline-none focus:border-[#F45B2A] focus:ring-1 focus:ring-[#F45B2A]"
            />
            {fieldErrors.fullName && (
              <p className="text-[11px] text-rose-600">{fieldErrors.fullName[0]}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-bold text-[#24272B]">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={displayEmail}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] bg-slate-50 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* WhatsApp Phone Number */}
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-xs font-bold text-[#24272B]">
              WhatsApp Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08098765432"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] text-xs sm:text-sm text-[#24272B] focus:outline-none focus:border-[#F45B2A] focus:ring-1 focus:ring-[#F45B2A]"
            />
            {fieldErrors.phone && (
              <p className="text-[11px] text-rose-600">{fieldErrors.phone[0]}</p>
            )}
          </div>

          {/* Department / Faculty */}
          <div className="space-y-1">
            <label htmlFor="department" className="block text-xs font-bold text-[#24272B]">
              Department / Faculty
            </label>
            <input
              id="department"
              name="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Biochemistry, Medicine, Economics"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] text-xs sm:text-sm text-[#24272B] focus:outline-none focus:border-[#F45B2A] focus:ring-1 focus:ring-[#F45B2A]"
            />
          </div>

          {/* University Selector */}
          <div className="space-y-1">
            <label htmlFor="university" className="block text-xs font-bold text-[#24272B]">
              Selected School (Primary Map Anchor)
            </label>
            <select
              id="university"
              value={selectedUniSlug}
              onChange={(e) => setSelectedUniSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E5] text-xs sm:text-sm text-[#24272B] focus:outline-none focus:border-[#F45B2A]"
            >
              <option value="abia-state-university">Abia State University (ABSU)</option>
              <option value="university-of-nigeria-nsukka">University of Nigeria, Nsukka (UNN)</option>
              <option value="michael-okpara-university-of-agriculture-umudike">Michael Okpara University (MOUAU)</option>
              <option value="university-of-lagos">University of Lagos (UNILAG)</option>
              <option value="university-of-ibadan">University of Ibadan (UI)</option>
              <option value="obafemi-awolowo-university">Obafemi Awolowo University (OAU)</option>
              <option value="university-of-benin">University of Benin (UNIBEN)</option>
              <option value="federal-university-of-technology-akure">FUTA Akure</option>
              {NIGERIAN_UNIVERSITIES.slice(0, 30).map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.name} ({u.acronym})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500">
              The discovery map automatically centres around this institution.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-xl bg-[#F45B2A] hover:bg-[#DE4C1D] text-white font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ======================================================== */}
      {/* 2. ACCOMMODATION PREFERENCES */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8E5] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8E5]">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0E9] text-[#F45B2A]">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#24272B]">Accommodation Preferences</h2>
            <p className="text-[11px] text-slate-500">Tailors which lodges appear first on your discovery feed</p>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#24272B]">Target Budget</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'under_100k', label: 'Under ₦100k' },
              { id: '100k_200k', label: '₦100k – ₦200k' },
              { id: '200k_plus', label: '₦200k+' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBudgetPreference(opt.id)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${budgetPreference === opt.id
                    ? 'border-[#F45B2A] bg-[#FFF0E9] text-[#F45B2A]'
                    : 'border-[#E8E8E5] text-slate-600 hover:border-slate-300'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#24272B]">Preferred Accommodation Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'single_room', label: 'Single room' },
              { id: 'self_contained', label: 'Self-contained' },
              { id: 'shared_apartment', label: 'Shared flat' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRoomTypePreference(opt.id)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${roomTypePreference === opt.id
                    ? 'border-[#F45B2A] bg-[#FFF0E9] text-[#F45B2A]'
                    : 'border-[#E8E8E5] text-slate-600 hover:border-slate-300'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DOWNLOADABLE STUDENT APPLICATION (PWA INSTALLATION) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8E5] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8E5]">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0E9] text-[#F45B2A]">
            <Download className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#24272B]">Downloadable Application</h2>
            <p className="text-[11px] text-slate-500">Install LodgeHere directly on your mobile device</p>
          </div>
        </div>

        {isStandalone ? (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">LodgeHere App Active</span>
              <p className="text-[11px] text-emerald-700">Running in standalone app mode on your home screen.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Install LodgeHere for instant map access, offline navigation shell, and faster enquiry updates right from your home screen.
            </p>

            {/* Android / Desktop Install Button */}
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-[#24272B] hover:bg-black text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4 text-[#F45B2A]" />
                <span>Install LodgeHere (Android / Chrome)</span>
              </button>
            )}

            {installSuccess && (
              <div className="p-3 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-800">
                Installation initiated! Check your home screen.
              </div>
            )}

            {/* iPhone / iOS Add to Home Screen Instructions */}
            <div className="p-3.5 bg-[#F8F8F6] rounded-2xl border border-[#E8E8E5] space-y-2">
              <div className="flex items-center gap-2">
                <Share className="h-4 w-4 text-[#F45B2A]" />
                <span className="text-xs font-extrabold text-[#24272B]">iPhone / iPad Instructions:</span>
              </div>
              <ol className="text-[11px] text-slate-600 space-y-1 list-decimal pl-4 leading-relaxed">
                <li>Open LodgeHere in Safari browser.</li>
                <li>Tap the <strong>Share</strong> button (box with upward arrow) at the bottom.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> at top right to install the standalone application.</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. ACCOUNT & LOGOUT ACTIONS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-[#E8E8E5] p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#24272B]">Account Actions</h3>
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
