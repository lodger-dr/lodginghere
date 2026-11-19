'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export function MobilePwaBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    const isStandalone =
      (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
      Boolean((window.navigator as any)?.standalone);

    if (isStandalone) return;

    // Check if dismissed previously
    const dismissed = localStorage.getItem('lodgehere_pwa_dismissed');
    if (dismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    // Capture Chrome/Android install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On iOS, show banner if on mobile screen and not standalone
    if (iosDevice && window.innerWidth < 768) {
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('lodgehere_pwa_dismissed', 'true');
    } catch { }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-18 left-3 right-3 max-w-md mx-auto z-30 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E8E8E5] bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E9] text-[#F45B2A] border border-[#F45B2A]/20 shadow-xs">
            <Download className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#24272B] truncate">
              Install LodgeHere App
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {isIos ? 'Tap Share and Add to Home Screen' : 'Fast standalone access on your phone'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isIos && deferredPrompt && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="rounded-full bg-[#F45B2A] hover:bg-[#DE4C1D] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              Install
            </button>
          )}

          {isIos && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#F45B2A] bg-[#FFF0E9] px-2.5 py-1 rounded-lg">
              <Share className="h-3 w-3" />
              <span>Share</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-[#24272B]"
            aria-label="Dismiss app install banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
