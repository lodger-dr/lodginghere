'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SendHorizontal } from 'lucide-react';

interface WinningCTAProps {
  idleText?: string;
  winText?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function WinningCTA({
  idleText = 'Schedule Physical Inspection',
  winText = 'Lock In Your Spot — Win!',
  href,
  onClick,
  className = '',
  size = 'md',
  type = 'button',
  disabled = false,
}: WinningCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'h-9 px-4 text-xs gap-2',
    md: 'h-11 px-5 text-xs sm:text-sm gap-2.5',
    lg: 'h-13 px-6 text-sm sm:text-base gap-3',
  };

  const content = (
    <>
      <span className="relative flex items-center justify-center transition-all duration-200">
        <SendHorizontal
          className={`h-4 w-4 shrink-0 transition-all ${
            isHovered ? 'animate-plane-loop text-emerald-300' : 'text-slate-300 dark:text-slate-900'
          }`}
        />
      </span>
      <span className="font-bold tracking-tight whitespace-nowrap transition-all duration-200">
        {isHovered ? winText : idleText}
      </span>
    </>
  );

  const baseClasses = `group relative inline-flex items-center justify-center rounded-full font-bold shadow-lg transition-all duration-300 active:scale-97 cursor-pointer overflow-hidden border border-slate-700/50 dark:border-emerald-400/40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 dark:from-emerald-500 dark:via-emerald-400 dark:to-teal-400 dark:text-slate-950 dark:hover:from-emerald-400 dark:hover:to-teal-300 hover:shadow-emerald-500/25 ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={baseClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${baseClasses} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {content}
    </button>
  );
}
