'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: React.ReactNode;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  subtitle,
  badge,
  icon,
  children,
  defaultOpen = false,
  className = '',
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white/80 dark:border-slate-800/70 dark:bg-slate-900/75 backdrop-blur-md overflow-hidden transition-all duration-200 shadow-2xs ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5 min-w-0 pr-4">
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {icon}
            </div>
          )}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {title}
              </span>
              {badge && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-800 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-900 dark:text-white' : ''
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-5 pt-1 sm:px-5 border-t border-slate-100/80 dark:border-slate-800/60 animate-in fade-in-50 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}
