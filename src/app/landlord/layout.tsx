'use client';

import React from 'react';

interface LandlordLayoutProps {
  children: React.ReactNode;
}

export default function LandlordLayout({ children }: LandlordLayoutProps) {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <main className="relative flex-1 p-3 sm:p-4 w-full z-10 pb-20">{children}</main>
    </div>
  );
}
