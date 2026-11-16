'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTour } from '@/context/tour-context';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  MousePointerClick,
} from 'lucide-react';

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function GuidedTour() {
  const {
    isOpen,
    currentStepIndex,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    skipTour,
  } = useTour();

  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; placement: 'top' | 'bottom' | 'center' }>({
    top: 0,
    left: 0,
    placement: 'center',
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Measure and position spotlight on the target element
  const updatePosition = useCallback(() => {
    if (!isOpen || !currentStep) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(currentStep.targetSelector);
    const rawRect = el?.getBoundingClientRect();

    if (!el || !rawRect || (rawRect.width === 0 && rawRect.height === 0)) {
      // Target element not found or hidden on current mobile viewport: fall back to screen-centered dialog
      setTargetRect(null);
      setTooltipPos({
        top: Math.max(40, window.innerHeight / 2 - 200),
        left: Math.max(16, (window.innerWidth - Math.min(window.innerWidth - 32, 460)) / 2),
        placement: 'center',
      });
      return;
    }

    // Scroll smoothly into view if needed
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

    const padding = 8;
    const rect: ElementRect = {
      top: rawRect.top - padding,
      left: rawRect.left - padding,
      width: rawRect.width + padding * 2,
      height: rawRect.height + padding * 2,
      bottom: rawRect.bottom + padding,
      right: rawRect.right + padding,
    };

    setTargetRect(rect);

    // Compute tooltip positioning
    const cardWidth = Math.min(window.innerWidth - 32, 480);
    const cardHeight = 360; // Estimated max height

    let left = rect.left + rect.width / 2 - cardWidth / 2;
    // Keep horizontally in bounds
    left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));

    let top: number;
    let placement: 'top' | 'bottom' | 'center' = 'bottom';

    // Prefer positioning below the element
    if (rect.bottom + cardHeight + 16 <= window.innerHeight) {
      top = rect.bottom + 14;
      placement = 'bottom';
    } else if (rect.top - cardHeight - 16 >= 0) {
      // Position above if not enough room below
      top = rect.top - cardHeight - 14;
      placement = 'top';
    } else {
      // Center vertically if neither fits comfortably
      top = Math.max(16, window.innerHeight / 2 - cardHeight / 2);
      placement = 'center';
    }

    setTooltipPos({ top, left, placement });
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen) return;

    // Initial positioning with slight delay for DOM paint
    const timer = setTimeout(updatePosition, 80);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, currentStepIndex, updatePosition]);

  // Global Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        skipTour();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextStep, prevStep, skipTour]);

  if (!isOpen || !currentStep) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;
  const progressPct = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Interactive Guide Step ${currentStepIndex + 1} of ${totalSteps}`}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* SVG Spotlight Backdrop Mask */}
      <svg
        className="fixed inset-0 h-full w-full pointer-events-none transition-all duration-300"
        style={{ zIndex: 51 }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White area covers entire screen (blocks everything) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout reveals the target element */}
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="16"
                ry="16"
                fill="black"
                className="transition-all duration-300 ease-out"
              />
            )}
          </mask>
        </defs>

        {/* Semi-transparent dark overlay through mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(2, 6, 23, 0.72)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Target Pulsing Highlight Ring */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-2xl ring-2 ring-blue-500/80 ring-offset-2 ring-offset-slate-900 transition-all duration-300 animate-pulse"
          style={{
            zIndex: 52,
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      )}

      {/* Floating Tooltip Card */}
      <div
        ref={cardRef}
        style={{
          zIndex: 53,
          top: tooltipPos.top,
          left: tooltipPos.left,
          maxWidth: '480px',
        }}
        className="fixed w-[calc(100vw-32px)] sm:w-full rounded-3xl border border-slate-200/90 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-2xl p-5 sm:p-6 transition-all duration-300 space-y-4 animate-in fade-in zoom-in-95"
      >
        {/* Top Header & Step Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <Compass className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>{currentStep.badge || `Step ${currentStepIndex + 1} of ${totalSteps}`}</span>
            </div>

            <button
              type="button"
              onClick={skipTour}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Close tour (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          {currentStep.title}
        </h3>

        {/* 3-Point Micro-Guide (What it is / What to do / How it works) */}
        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
          {/* What it is */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              <HelpCircle className="h-3 w-3" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="font-bold text-slate-900 dark:text-white block">What it is</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStep.whatItIs}
              </p>
            </div>
          </div>

          {/* What to do */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              <MousePointerClick className="h-3 w-3" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="font-bold text-slate-900 dark:text-white block">What to do</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStep.whatToDo}
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
              <Lightbulb className="h-3 w-3" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="font-bold text-slate-900 dark:text-white block">How it works</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStep.howItWorks}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={skipTour}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all ${
                currentStepIndex === 0 ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 px-4 py-1.5 text-xs font-bold shadow-sm transition-all active:scale-97 cursor-pointer"
            >
              <span>{isLastStep ? 'Got it — Finish Tour' : 'Next Step'}</span>
              {isLastStep ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="text-[10px] text-slate-400 dark:text-slate-400 text-center pt-0.5">
          <span>Use </span>
          <kbd className="font-mono font-semibold px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            ←
          </kbd>
          <span> / </span>
          <kbd className="font-mono font-semibold px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            →
          </kbd>
          <span> keys to navigate • </span>
          <kbd className="font-mono font-semibold px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            Esc
          </kbd>
          <span> to exit</span>
        </div>
      </div>
    </div>
  );
}
