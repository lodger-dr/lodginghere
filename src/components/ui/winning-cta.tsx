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
  winText,
  href,
  onClick,
  className = '',
  size = 'md',
  type = 'button',
  disabled = false,
}: WinningCTAProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayText = isHovered && winText ? winText : idleText;

  const sizeClasses = {
    sm: 'h-9 px-4 text-xs gap-2',
    md: 'h-11 px-5 text-xs sm:text-sm gap-2.5',
    lg: 'h-13 px-6 text-sm sm:text-base gap-3',
  };

  const content = (
    <>
      <span className="relative flex items-center justify-center transition-all duration-200">
        <SendHorizontal
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-all ${isHovered ? 'animate-plane-loop text-white dark:text-slate-900' : 'text-slate-300 dark:text-slate-600'
            }`}
        />
      </span>
      <span className="font-bold tracking-tight whitespace-nowrap transition-all duration-200">
        {displayText}
      </span>
    </>
  );

  const baseClasses = `group relative inline-flex items-center justify-center rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-97 cursor-pointer overflow-hidden border border-slate-900 dark:border-white/20 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${sizeClasses[size]} ${className}`;

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
