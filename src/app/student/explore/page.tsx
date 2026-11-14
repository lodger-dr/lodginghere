'use client';

import React, { Suspense } from 'react';
import { ExploreView } from '@/components/lodges/explore-view';

export default function StudentExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">Loading lodges...</div>}>
      <ExploreView isDashboard={true} />
    </Suspense>
  );
}
