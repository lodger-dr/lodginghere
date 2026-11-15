'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, Check, X, SlidersHorizontal } from 'lucide-react';
import {
  getCookieConsent,
  setCookieConsent,
  acceptAllCookies,
  rejectNonEssentialCookies,
  CookiePreferences,
  COOKIE_CONSENT_CHANGE_EVENT,
} from '@/lib/data/privacy';

export const OPEN_COOKIE_MODAL_EVENT = 'lodgehere-open-cookie-modal';

export function openCookiePreferencesModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_COOKIE_MODAL_EVENT));
  }
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    preferences: false,
    analytics: false,
    marketing: false,
    timestamp: '',
  });

  useEffect(() => {
    // Check initial consent status
    const current = getCookieConsent();
    if (!current) {
      setVisible(true);
    } else {
      setPreferences(current);
    }

    const handleOpenModal = () => {
      const existing = getCookieConsent();
      if (existing) {
        setPreferences(existing);
      }
      setShowPreferences(true);
      setVisible(true);
    };

    const handleConsentChange = (e: CustomEvent<CookiePreferences>) => {
      if (e.detail) {
        setPreferences(e.detail);
      }
    };

    window.addEventListener(OPEN_COOKIE_MODAL_EVENT, handleOpenModal);
    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT as unknown as any, handleConsentChange);

    return () => {
      window.removeEventListener(OPEN_COOKIE_MODAL_EVENT, handleOpenModal);
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT as unknown as any, handleConsentChange);
    };
  }, []);

  if (!visible) return null;

  const handleAcceptAll = () => {
    const updated = acceptAllCookies();
    setPreferences(updated);
    setVisible(false);
    setShowPreferences(false);
  };

  const handleRejectNonEssential = () => {
    const updated = rejectNonEssentialCookies();
    setPreferences(updated);
    setVisible(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    const updated = setCookieConsent(preferences);
    setPreferences(updated);
    setVisible(false);
    setShowPreferences(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-50 p-2.5 sm:p-4 md:p-6 animate-in slide-in-from-bottom duration-300"
    >
      <div className="mx-auto max-w-4xl rounded-2xl sm:rounded-3xl border border-slate-300/80 bg-white/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 ring-1 ring-black/10 dark:ring-white/10">
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Cookie className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 id="cookie-banner-title" className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Cookie & Privacy Preferences
                </h3>
                <p id="cookie-banner-desc" className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  We use strictly necessary cookies to keep your authentication session secure. Optional cookies help
                  remember your university preferences and improve page performance.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRejectNonEssential}
              className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none shrink-0"
              aria-label="Close cookie banner and use essential only"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Granular Preference Accordion */}
          {showPreferences && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-800/50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Strictly Necessary Cookies</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Required for account authentication, role switching, and security. Cannot be switched off.
                  </span>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Always Active
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <div className="pr-4">
                  <span className="font-bold text-slate-900 dark:text-white block">Functional & Preference Cookies</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Remembers your selected university, dark mode theme, and campus filter settings.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, preferences: e.target.checked }))
                    }
                    className="sr-only peer"
                    aria-label="Toggle Functional and Preference Cookies"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="pr-4">
                  <span className="font-bold text-slate-900 dark:text-white block">Anonymous Analytics Cookies</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Helps us understand aggregated page views and load times. Never tied to your student identity.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                    }
                    className="sr-only peer"
                    aria-label="Toggle Anonymous Analytics Cookies"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons (Equal visual balance, strictly avoiding dark patterns) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 sm:pt-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              <Link
                href="/cookies"
                className="underline hover:text-slate-900 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded"
              >
                Cookie Policy
              </Link>
              <span>•</span>
              <Link
                href="/privacy"
                className="underline hover:text-slate-900 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded"
              >
                Privacy Notice
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              {!showPreferences ? (
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="order-2 sm:order-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Customize</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="order-2 sm:order-1 col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3.5 py-2 text-xs font-semibold hover:bg-emerald-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Save Preferences</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="order-3 sm:order-2 inline-flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="order-1 sm:order-3 col-span-2 sm:col-span-1 inline-flex items-center justify-center rounded-full bg-slate-900 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 hover:bg-black px-5 py-2 text-xs font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
