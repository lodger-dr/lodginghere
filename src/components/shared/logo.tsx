'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  inverted?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', inverted = false, size = 'md' }: LogoProps) {
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  const svgSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`group flex items-center gap-2.5 transition-opacity hover:opacity-95 ${className}`}>
      {/* Modern geometric housing icon */}
      <div
        className={`flex ${iconSizes[size]} items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 shadow-xs ${
          inverted ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={svgSizes[size]}
        >
          {/* Stylized Modern Roof & Keyhole/Doorway */}
          <path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10.5z" />
          <path d="M9 22V12h6v10" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-black tracking-tight leading-none ${textSizes[size]} ${
            inverted ? 'text-white' : 'text-slate-900'
          }`}
        >
          Lodge<span className="text-emerald-600">Here</span>
        </span>
        <span
          className={`text-[9px] font-bold tracking-widest uppercase pt-0.5 ${
            inverted ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Campus Housing
        </span>
      </div>
    </Link>
  );
}
