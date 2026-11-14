'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  inverted?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', inverted = false, size = 'md' }: LogoProps) {
  const heightClasses = {
    sm: 'h-6',
    md: 'h-7',
    lg: 'h-9',
  };

  const currentHeightClass = heightClasses[size] || heightClasses.md;

  return (
    <Link
      href="/"
      className={`group flex items-center gap-2 transition-opacity hover:opacity-90 ${className}`}
      aria-label="LodgeHere"
    >
      <div className={`relative ${currentHeightClass} w-auto aspect-[788/195] flex items-center`}>
        {inverted ? (
          <Image
            src="/logo-white.png"
            alt="LodgeHere Logo"
            width={130}
            height={32}
            className={`${currentHeightClass} w-auto object-contain`}
            priority
          />
        ) : (
          <>
            <Image
              src="/logo-dark.png"
              alt="LodgeHere Logo"
              width={130}
              height={32}
              className={`${currentHeightClass} w-auto object-contain dark:hidden`}
              priority
            />
            <Image
              src="/logo-white.png"
              alt="LodgeHere Logo"
              width={130}
              height={32}
              className={`${currentHeightClass} w-auto object-contain hidden dark:block`}
              priority
            />
          </>
        )}
      </div>
    </Link>
  );
}
